<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOffreRequest extends FormRequest
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
            'titre' => 'sometimes|string|min:10|max:255',
            'description' => 'sometimes|string|min:50',
            'departement_id' => 'sometimes|exists:departements,id',
            'duree_jours' => 'sometimes|integer|min:7|max:365',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after:date_debut',
            'competences_requises' => 'sometimes|string|min:10',
            'nombre_places' => 'sometimes|integer|min:1|max:50',
            'statut' => 'sometimes|in:ouvert,ferme'
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
            'titre.min' => 'Le titre doit contenir au moins 10 caractères.',
            'description.min' => 'La description doit contenir au moins 50 caractères.',
            'departement_id.exists' => 'Le département sélectionné n\'existe pas.',
            'duree_jours.min' => 'La durée minimale est de 7 jours.',
            'duree_jours.max' => 'La durée maximale est de 365 jours.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
            'competences_requises.min' => 'Décrivez les compétences (minimum 10 caractères).',
            'nombre_places.min' => 'Le nombre minimum de places est 1.',
            'nombre_places.max' => 'Le nombre maximum de places est 50.',
            'statut.in' => 'Le statut doit être "ouvert" ou "fermé".'
        ];
    }
}