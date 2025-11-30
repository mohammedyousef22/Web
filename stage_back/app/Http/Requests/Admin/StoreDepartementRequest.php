<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartementRequest extends FormRequest
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
        $departementId = $this->route('departement');
        
        return [
            'nom' => 'required|string|max:255|unique:departements,nom,' . $departementId,
            'description' => 'nullable|string',
            'responsable' => 'nullable|string|max:255'
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
            'nom.required' => 'Le nom du département est requis.',
            'nom.unique' => 'Ce nom de département existe déjà.',
            'nom.max' => 'Le nom ne peut pas dépasser 255 caractères.'
        ];
    }
}