<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->route('id');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('users', 'phone_number')->ignore($userId)],
            'role' => ['sometimes', 'required', Rule::in(['owner', 'admin', 'family', 'viewer'])],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
        ];
    }
}
