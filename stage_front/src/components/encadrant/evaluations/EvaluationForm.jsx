// src/components/encadrant/evaluations/EvaluationForm.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Input, Textarea, Button, Card } from '@/components/common';
import { evaluationService } from '@/api/services';
import { Toast } from '@/components/common';

/**
 * Formulaire d'évaluation d'un stagiaire
 */
const EvaluationForm = ({ stage, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        note: '',
        competences_acquises: '',
        appreciation: '',
    });
    const [errors, setErrors] = useState({});

    const competencesSuggestions = evaluationService.getCompetencesSuggestions();
    const [selectedCompetences, setSelectedCompetences] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const toggleCompetence = (competence) => {
        setSelectedCompetences((prev) => {
            if (prev.includes(competence)) {
                return prev.filter((c) => c !== competence);
            } else {
                return [...prev, competence];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = evaluationService.validateEvaluation({
            ...formData,
            competences_acquises: selectedCompetences.join(', '),
        });

        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);

        try {
            await evaluationService.createEvaluation({
                stage_id: stage.id,
                note: parseFloat(formData.note),
                competences_acquises: selectedCompetences.join(', '),
                appreciation: formData.appreciation,
            });

            Toast.success('Évaluation enregistrée avec succès !');
            onSuccess();
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de l\'évaluation');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const mention = formData.note ? evaluationService.getMention(parseFloat(formData.note)) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Stagiaire */}
            <Card padding="normal">
                <h3 className="font-semibold text-gray-900 mb-2">
                    {stage.candidature?.stagiaire?.user?.name || stage.stagiaire?.user?.name}
                </h3>
                <p className="text-sm text-gray-600">
                    {stage.candidature?.offre?.titre || stage.offre?.titre}
                </p>
                <p className="text-sm text-gray-500">
                    {new Date(stage.date_debut_reelle).toLocaleDateString('fr-FR')} - {new Date(stage.date_fin_reelle).toLocaleDateString('fr-FR')}
                </p>
            </Card>

            {/* Note */}
            <div>
                <Input
                    label="Note sur 20"
                    type="number"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    step="0.5"
                    error={errors.note}
                    helperText="Note entre 0 et 20"
                    required
                />

                {mention && (
                    <div className={`mt-2 p-3 rounded-lg ${mention.label === 'Très Bien' ? 'bg-green-50 text-green-700' : mention.label === 'Bien' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            <span className="font-medium">Mention: {mention.label}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Compétences */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Compétences acquises <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {competencesSuggestions.map((competence) => (
                        <button
                            key={competence}
                            type="button"
                            onClick={() => toggleCompetence(competence)}
                            className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedCompetences.includes(competence)
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                                }
              `}
                        >
                            {competence}
                        </button>
                    ))}
                </div>
                {errors.competences_acquises && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.competences_acquises}</p>
                )}
            </div>

            {/* Appréciation */}
            <Textarea
                label="Appréciation générale"
                name="appreciation"
                value={formData.appreciation}
                onChange={handleChange}
                rows={6}
                placeholder="Votre appréciation détaillée sur le travail du stagiaire, son comportement, ses points forts et axes d'amélioration..."
                error={errors.appreciation}
                showCharCount
                maxLength={1000}
                helperText="Minimum 20 caractères"
                required
            />

            {/* Submit */}
            <div className="flex justify-end gap-3">
                <Button type="submit" variant="primary" size="lg" loading={loading}>
                    Enregistrer l'évaluation
                </Button>
            </div>
        </form>
    );
};

export default EvaluationForm;