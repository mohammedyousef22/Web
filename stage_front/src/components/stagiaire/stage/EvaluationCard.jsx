// src/components/stagiaire/stage/EvaluationCard.jsx
import React, { useState } from 'react';
import { Card, Badge, Button, Toast } from '@/components/common';
import { Star, Award, FileText, Download } from 'lucide-react';
import { evaluationService, stageService } from '@/api/services';

export const EvaluationCard = ({ evaluation, stage }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadAttestation = async () => {
        setDownloading(true);
        try {
            // Le service retourne directement le Blob (grâce à l'intercepteur axios)
            const blob = await stageService.downloadAttestation();

            // Vérifier si c'est une erreur JSON déguisée en Blob
            if (blob.type === 'application/json') {
                const text = await blob.text();
                const json = JSON.parse(text);
                throw new Error(json.message || 'Erreur lors du téléchargement');
            }

            if (blob.size === 0) {
                throw new Error('Le fichier est vide');
            }

            // Créer le lien de téléchargement
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Attestation_Stage.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Toast.success('Attestation téléchargée avec succès');
        } catch (error) {
            console.error('Erreur téléchargement:', error);

            let message = error.message || 'Erreur lors du téléchargement';

            // Si l'erreur contient un Blob (cas d'erreur 4xx/5xx avec responseType: blob)
            if (error.data instanceof Blob && error.data.type === 'application/json') {
                try {
                    const text = await error.data.text();
                    const json = JSON.parse(text);
                    if (json.message) message = json.message;
                } catch (e) {
                    console.error('Erreur parsing erreur JSON:', e);
                }
            }

            Toast.error(message);
        } finally {
            setDownloading(false);
        }
    };

    if (!evaluation) {
        return (
            <Card title="Mon Évaluation" padding="normal">
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Votre évaluation n'est pas encore disponible</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Votre encadrant n'a pas encore complété votre évaluation
                    </p>
                </div>
            </Card>
        );
    }

    const mention = evaluationService.getMention(evaluation.note);

    return (
        <Card title="Mon Évaluation" padding="normal">
            <div className="space-y-6">
                {/* Note et Mention */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        <span className="text-4xl font-bold text-gray-900">{evaluation.note}</span>
                        <span className="text-2xl text-gray-600">/20</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${mention.bgColor} ${mention.color} font-medium`}>
                        <Award className="w-5 h-5" />
                        <span>{mention.label} {mention.emoji}</span>
                    </div>
                </div>

                {/* Télécharger Attestation */}
                {stage?.attestation_path && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Award className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">Attestation de Stage</p>
                                    <p className="text-sm text-gray-600">Votre attestation est disponible</p>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={Download}
                                onClick={handleDownloadAttestation}
                                loading={downloading}
                            >
                                Télécharger
                            </Button>
                        </div>
                    </div>
                )}

                {/* Compétences Acquises */}
                {evaluation.competences_acquises && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Compétences Acquises</h4>
                        <div className="flex flex-wrap gap-2">
                            {evaluation.competences_acquises.split(',').map((comp, index) => (
                                <Badge key={index} variant="primary">
                                    {comp.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Appréciation */}
                {evaluation.appreciation && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Appréciation de l'Encadrant</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap">{evaluation.appreciation}</p>
                        </div>
                    </div>
                )}

                {/* Date */}
                <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Évaluée le {new Date(evaluation.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>
        </Card>
    );
};
