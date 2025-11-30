<?php

namespace App\Http\Requests\Stagiaire;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;
        
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'cin' => 'sometimes|string|max:20',
            'date_naissance' => 'sometimes|date|before:today',
            'telephone' => 'sometimes|string|max:20',
            'etablissement' => 'sometimes|string|max:255',
            'niveau_etude' => 'sometimes|string|max:100',
            'filiere' => 'sometimes|string|max:100',
            'adresse' => 'sometimes|string'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui.'
        ];
    }
}