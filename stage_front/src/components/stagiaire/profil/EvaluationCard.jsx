// src/components/stagiaire/profil/EvaluationCard.jsx
export const EvaluationCard = ({ evaluation }) => {
    if (!evaluation) return null;
    const formatted = evaluationService.formatEvaluation(evaluation);

    return (
        <Card title="Mon Évaluation Finale" padding="normal">
            <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-5xl font-bold text-gray-900 mb-2">{formatted.note_sur_20}</p>
                    <Badge variant={formatted.mention.label === 'Très Bien' ? 'success' : 'primary'} size="lg">
                        {formatted.mention.label}
                    </Badge>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Appréciation de l'encadrant</h4>
                    <p className="text-gray-700 whitespace-pre-line">{evaluation.appreciation}</p>
                </div>
                {evaluation.competences_acquises && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Compétences acquises</h4>
                        <div className="flex flex-wrap gap-2">
                            {evaluation.competences_acquises.split(',').map((comp, i) => (
                                <Badge key={i} variant="success">{comp.trim()}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};