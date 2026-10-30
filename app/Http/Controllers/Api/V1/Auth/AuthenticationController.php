<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;
use Laravel\Fortify\Fortify;

class AuthenticationController extends Controller
{
    private const TWO_FACTOR_CHALLENGE_TTL = 300;

    private const TWO_FACTOR_CHALLENGE_LOCK_LEASE = 30;

    public function __construct(
        private readonly TwoFactorAuthenticationProvider $twoFactorProvider,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $credentials = [
            'email' => Str::lower($validated['email']),
            'password' => $validated['password'],
        ];

        $guard = Auth::guard('web');

        if (! $guard->validate($credentials)) {
            return response()->json([
                'message' => 'The provided credentials are invalid.',
            ], 401);
        }

        /** @var User $user */
        $user = User::query()
            ->where('email', $credentials['email'])
            ->firstOrFail();

        if ($user->hasEnabledTwoFactorAuthentication()) {
            $challengeId = Str::random(64);

            Cache::put(
                $this->challengeCacheKey($challengeId),
                ['user_id' => $user->getAuthIdentifier()],
                now()->addSeconds(self::TWO_FACTOR_CHALLENGE_TTL),
            );

            return response()->json([
                'message' => 'Two-factor authentication is required.',
                'two_factor_required' => true,
                'challenge_id' => $challengeId,
                'expires_in' => self::TWO_FACTOR_CHALLENGE_TTL,
            ], 202);
        }

        $token = $user->createToken('mobile-api', ['api:access']);

        return response()->json([
            'token' => $token->plainTextToken,
            'user' => $this->safeUser($user),
        ]);
    }

    public function twoFactorChallenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_id' => ['required', 'string', 'max:128'],
            'code' => ['nullable', 'string'],
            'recovery_code' => ['nullable', 'string'],
        ]);

        if (blank($validated['code'] ?? null) === blank($validated['recovery_code'] ?? null)) {
            return response()->json([
                'message' => 'A valid two-factor authentication code is required.',
            ], 422);
        }

        $challengeId = $validated['challenge_id'];
        $challengeKey = $this->challengeCacheKey($challengeId);

        try {
            $result = Cache::lock($challengeKey.':lock', self::TWO_FACTOR_CHALLENGE_LOCK_LEASE)
                ->block(5, function () use ($challengeKey, $validated): ?array {
                    $challenge = Cache::get($challengeKey);

                    if (! is_array($challenge) || ! isset($challenge['user_id'])) {
                        return null;
                    }

                    $result = DB::transaction(function () use ($challenge, $validated): ?array {
                        $user = User::query()
                            ->whereKey($challenge['user_id'])
                            ->lockForUpdate()
                            ->first();

                        if (! $user instanceof User || ! $user->hasEnabledTwoFactorAuthentication()) {
                            return null;
                        }

                        $verified = isset($validated['recovery_code'])
                            ? $this->verifyRecoveryCode($user, $validated['recovery_code'])
                            : $this->verifyTotpCode($user, $validated['code']);

                        if (! $verified) {
                            return [];
                        }

                        $token = $user->createToken('mobile-api', ['api:access']);

                        return [
                            'token' => $token->plainTextToken,
                            'user' => $this->safeUser($user),
                        ];
                    });

                    if (is_array($result) && $result !== []) {
                        Cache::forget($challengeKey);
                    }

                    return $result;
                });
        } catch (LockTimeoutException) {
            return response()->json([
                'message' => 'The two-factor authentication challenge could not be completed.',
            ], 503);
        }

        if ($result === null || $result === []) {
            return response()->json([
                'message' => 'The two-factor authentication challenge could not be completed.',
            ], 401);
        }

        return response()->json($result);
    }

    private function verifyTotpCode(User $user, string $code): bool
    {
        try {
            return $this->twoFactorProvider->verify(
                Fortify::currentEncrypter()->decrypt($user->two_factor_secret),
                $code,
            );
        } catch (DecryptException) {
            return false;
        }
    }

    private function verifyRecoveryCode(User $user, string $recoveryCode): bool
    {
        try {
            $validCode = collect($user->recoveryCodes())->first(
                fn (string $code): bool => hash_equals($code, $recoveryCode),
            );

            if (! is_string($validCode)) {
                return false;
            }

            $user->replaceRecoveryCode($validCode);

            return true;
        } catch (DecryptException) {
            return false;
        }
    }

    /**
     * @return array{id: mixed, name: string, email: string, role: string}
     */
    private function safeUser(User $user): array
    {
        return [
            'id' => $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }

    private function challengeCacheKey(string $challengeId): string
    {
        return 'api-auth:two-factor:'.hash('sha256', $challengeId);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->safeUser($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }
}
