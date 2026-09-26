<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Validator;
 

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'restaurant_table_id' => [
                'required',
                'integer',
                'exists:restaurant_tables,id',
            ],

            'reservation_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
            ],

            'guest_count' => [
                'required',
                'integer',
                'min:1',
            ],

            'special_request' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $startTime = $this->input('start_time');
            $endTime = $this->input('end_time');

            if (
                $startTime &&
                $endTime &&
                $startTime >= $endTime
            ) {
                $validator->errors()->add(
                    'end_time',
                    'The end time must be after the start time.'
                );
            }
        });
    }
}