<?php

namespace App\Http\Requests\Encadrant;

use Illuminate\Foundation\Http\FormRequest;

class EvaluationRequest extends FormRequest
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
        return [
            'stage_id' => 'required|exists:stages,id',
            'note' => 'required|numeric|min:0|max:20',
            'competences_acquises' => 'nullable|string',
            'appreciation' => 'required|string|min:20'
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
            'stage_id.required' => 'Le stage est requis.',
            'stage_id.exists' => 'Le stage sélectionné n\'existe pas.',
            'note.required' => 'La note est requise.',
            'note.numeric' => 'La note doit être un nombre.',
            'note.min' => 'La note minimale est 0.',
            'note.max' => 'La note maximale est 20.',
            'appreciation.required' => 'L\'appréciation est requise.',
            'appreciation.min' => 'L\'appréciation doit contenir au moins 20 caractères.'
        ];
    }
}