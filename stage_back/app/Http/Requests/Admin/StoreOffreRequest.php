<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOffreRequest extends FormRequest
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
            'titre' => 'required|string|min:10|max:255',
            'description' => 'required|string|min:50',
            'departement_id' => 'required|exists:departements,id',
            'duree_jours' => 'required|integer|min:7|max:365',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin' => 'required|date|after:date_debut',
            'competences_requises' => 'required|string|min:10',
            'nombre_places' => 'required|integer|min:1|max:50',
            'statut' => 'nullable|in:ouvert,ferme'
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
            'titre.required' => 'Le titre est requis.',
            'titre.min' => 'Le titre doit contenir au moins 10 caractères.',
            'description.required' => 'La description est requise.',
            'description.min' => 'La description doit contenir au moins 50 caractères.',
            'departement_id.required' => 'Le département est requis.',
            'departement_id.exists' => 'Le département sélectionné n\'existe pas.',
            'duree_jours.required' => 'La durée est requise.',
            'duree_jours.min' => 'La durée minimale est de 7 jours.',
            'duree_jours.max' => 'La durée maximale est de 365 jours.',
            'date_debut.required' => 'La date de début est requise.',
            'date_debut.after_or_equal' => 'La date de début doit être aujourd\'hui ou dans le futur.',
            'date_fin.required' => 'La date de fin est requise.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
            'competences_requises.required' => 'Les compétences requises sont nécessaires.',
            'competences_requises.min' => 'Décrivez les compétences (minimum 10 caractères).',
            'nombre_places.required' => 'Le nombre de places est requis.',
            'nombre_places.min' => 'Le nombre minimum de places est 1.',
            'nombre_places.max' => 'Le nombre maximum de places est 50.',
            'statut.in' => 'Le statut doit être "ouvert" ou "fermé".'
        ];
    }
}