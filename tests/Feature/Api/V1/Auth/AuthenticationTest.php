<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\TwoFactorAuthenticationProvider;
use PragmaRX\Google2FA\Google2FA;

test('users can receive a mobile API token with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
    ]);

    $response = $this->postJson(route('api.v1.auth.login'), [
        'email' => 'USER@EXAMPLE.COM',
        'password' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.email', $user->email)
        ->assertJsonMissingPath('user.password')
        ->assertJsonMissingPath('user.two_factor_secret')
        ->assertJsonMissingPath('user.two_factor_recovery_codes')
        ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']]);

    expect($user->fresh()->tokens)->toHaveCount(1);
});

test('invalid API credentials return a generic authentication error', function () {
    User::factory()->create();

    $response = $this->postJson(route('api.v1.auth.login'), [
        'email' => 'missing@example.com',
        'password' => 'wrong-password',
    ]);

    $response
        ->assertUnauthorized()
        ->assertExactJson(['message' => 'The provided credentials are invalid.']);
});

test('users with confirmed two-factor authentication receive a temporary challenge', function () {
    $user = User::factory()->withTwoFactor()->create();

    $response = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $challengeId = $response->json('challenge_id');

    $response
        ->assertAccepted()
        ->assertJsonPath('two_factor_required', true)
        ->assertJsonPath('expires_in', 300)
        ->assertJsonMissingPath('token');

    expect($challengeId)
        ->toBeString()
        ->and(Cache::has('api-auth:two-factor:'.hash('sha256', $challengeId)))->toBeTrue();

    $this->assertGuest('web');
    expect($user->fresh()->tokens)->toHaveCount(0);
});

test('API login attempts are rate limited', function () {
    $email = 'user@example.com';
    $throttleKey = md5('api-login'.$email.'|127.0.0.1');

    RateLimiter::increment($throttleKey, amount: 5);

    $this->postJson(route('api.v1.auth.login'), [
        'email' => $email,
        'password' => 'wrong-password',
    ])->assertTooManyRequests();
});

test('users can complete an API TOTP challenge and receive a token', function () {
    $secret = app(TwoFactorAuthenticationProvider::class)->generateSecretKey();
    $user = User::factory()->withTwoFactor()->create([
        'two_factor_secret' => Fortify::currentEncrypter()->encrypt($secret),
    ]);
    $challengeId = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->json('challenge_id');

    $code = app(Google2FA::class)->getCurrentOtp($secret);

    $response = $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => $code,
    ]);

    $response
        ->assertOk()
        ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']])
        ->assertJsonPath('user.id', $user->id);

    expect($user->fresh()->tokens)->toHaveCount(1)
        ->and(Cache::has('api-auth:two-factor:'.hash('sha256', $challengeId)))->toBeFalse();
});

test('users can complete an API recovery-code challenge and the code is replaced', function () {
    $user = User::factory()->withTwoFactor()->create();
    $recoveryCode = $user->recoveryCodes()[0];
    $challengeId = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->json('challenge_id');

    $response = $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'recovery_code' => $recoveryCode,
    ]);

    $response->assertOk()->assertJsonStructure(['token', 'user']);

    expect($user->fresh()->recoveryCodes())
        ->not->toContain($recoveryCode);
});

test('invalid API two-factor challenges do not issue tokens', function () {
    $secret = app(TwoFactorAuthenticationProvider::class)->generateSecretKey();
    $user = User::factory()->withTwoFactor()->create([
        'two_factor_secret' => Fortify::currentEncrypter()->encrypt($secret),
    ]);
    $challengeId = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->json('challenge_id');

    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => '000000',
    ])->assertUnauthorized()->assertExactJson([
        'message' => 'The two-factor authentication challenge could not be completed.',
    ]);

    expect($user->fresh()->tokens)->toHaveCount(0)
        ->and(Cache::has('api-auth:two-factor:'.hash('sha256', $challengeId)))->toBeTrue();
});

test('an API two-factor challenge can only be used once', function () {
    $secret = app(TwoFactorAuthenticationProvider::class)->generateSecretKey();
    $user = User::factory()->withTwoFactor()->create([
        'two_factor_secret' => Fortify::currentEncrypter()->encrypt($secret),
    ]);
    $challengeId = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->json('challenge_id');
    $code = app(Google2FA::class)->getCurrentOtp($secret);

    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => $code,
    ])->assertOk();

    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => $code,
    ])->assertUnauthorized();

    expect($user->fresh()->tokens)->toHaveCount(1);
});

test('API two-factor attempts are rate limited', function () {
    $challengeId = 'challenge-id';
    $throttleKey = md5('api-two-factor'.hash('sha256', $challengeId).'|127.0.0.1');

    RateLimiter::increment($throttleKey, amount: 5);

    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => '000000',
    ])->assertTooManyRequests();
});

test('invalid encrypted TOTP secrets return a generic challenge error', function () {
    $user = User::factory()->withTwoFactor()->create([
        'two_factor_secret' => 'invalid-encrypted-secret',
    ]);
    $challengeId = $this->postJson(route('api.v1.auth.login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->json('challenge_id');

    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => $challengeId,
        'code' => '000000',
    ])->assertUnauthorized()->assertExactJson([
        'message' => 'The two-factor authentication challenge could not be completed.',
    ]);
});

test('challenge IDs exceeding the maximum length are rejected', function () {
    $this->postJson(route('api.v1.auth.two-factor-challenge'), [
        'challenge_id' => str_repeat('a', 129),
        'code' => '000000',
    ])->assertUnprocessable();
});
