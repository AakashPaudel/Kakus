<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $table = $this->route('restaurantTable');

        return [
            'table_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('restaurant_tables', 'table_number')
                    ->ignore($table),
            ],
            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:50',
            ],
        ];
    }
}
