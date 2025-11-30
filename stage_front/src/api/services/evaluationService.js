// src/api/services/evaluationService.js
import axiosInstance from '../axios';
import { ENCADRANT, STAGIAIRE } from '../endpoints';

/**
 * Service pour gérer les évaluations de stage
 */
const evaluationService = {
    // ========================
    // ENCADRANT ENDPOINTS
    // ========================

    /**
     * Créer une évaluation pour un stage (Encadrant)
     * @param {Object} data - { stage_id, note, competences_acquises, appreciation }
     * @returns {Promise}
     */
    createEvaluation: async (data) => {
        return await axiosInstance.post(ENCADRANT.EVALUATIONS, data);
    },

    /**
     * Récupérer l'évaluation d'un stage (Encadrant)
     * @param {number} stageId
     * @returns {Promise}
     */
    getEvaluationByStage: async (stageId) => {
        return await axiosInstance.get(ENCADRANT.EVALUATION_BY_STAGE(stageId));
    },

    /**
     * Modifier une évaluation (Encadrant)
     * @param {number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateEvaluation: async (id, data) => {
        return await axiosInstance.put(ENCADRANT.EVALUATION_BY_ID(id), data);
    },

    // ========================
    // STAGIAIRE ENDPOINTS
    // ========================

    /**
     * Récupérer mon évaluation (Stagiaire)
     * @returns {Promise}
     */
    getMonEvaluation: async () => {
        return await axiosInstance.get(STAGIAIRE.MON_EVALUATION);
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir la mention selon la note
     * @param {number} note
     * @returns {Object} { label, color, bgColor }
     */
    getMention: (note) => {
        if (note >= 16) {
            return {
                label: 'Très Bien',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                emoji: '🌟',
            };
        } else if (note >= 14) {
            return {
                label: 'Bien',
                color: 'text-blue-700',
                bgColor: 'bg-blue-100',
                emoji: '👍',
            };
        } else if (note >= 12) {
            return {
                label: 'Assez Bien',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-100',
                emoji: '✓',
            };
        } else if (note >= 10) {
            return {
                label: 'Passable',
                color: 'text-orange-700',
                bgColor: 'bg-orange-100',
                emoji: '⚠️',
            };
        } else {
            return {
                label: 'Insuffisant',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                emoji: '❌',
            };
        }
    },

    /**
     * Formater une évaluation pour affichage
     * @param {Object} evaluation
     * @returns {Object}
     */
    formatEvaluation: (evaluation) => {
        return {
            ...evaluation,
            mention: evaluationService.getMention(evaluation.note),
            note_sur_20: `${evaluation.note}/20`,
            created_at_formatted: new Date(evaluation.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        };
    },

    /**
     * Valider les données d'évaluation
     * @param {Object} data
     * @returns {Object} { valid: boolean, errors: object }
     */
    validateEvaluation: (data) => {
        const errors = {};

        // Validation note
        if (!data.note && data.note !== 0) {
            errors.note = 'La note est requise';
        } else if (data.note < 0 || data.note > 20) {
            errors.note = 'La note doit être entre 0 et 20';
        }

        // Validation appreciation
        if (!data.appreciation || data.appreciation.trim().length < 20) {
            errors.appreciation = 'L\'appréciation doit contenir au moins 20 caractères';
        }

        // Validation competences_acquises
        if (!data.competences_acquises || data.competences_acquises.trim().length === 0) {
            errors.competences_acquises = 'Les compétences acquises sont requises';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
        };
    },

    /**
     * Liste des compétences suggérées
     * @returns {Array}
     */
    getCompetencesSuggestions: () => {
        return [
            'Capacité d\'analyse',
            'Esprit d\'équipe',
            'Communication',
            'Autonomie',
            'Rigueur',
            'Créativité',
            'Adaptabilité',
            'Gestion du temps',
            'Résolution de problèmes',
            'Initiative',
            'Organisation',
            'Leadership',
            'Techniques métier',
            'Maîtrise des outils',
            'Respect des délais',
        ];
    },

    /**
     * Calculer la moyenne des évaluations
     * @param {Array} evaluations
     * @returns {number}
     */
    calculateMoyenne: (evaluations) => {
        if (!evaluations || evaluations.length === 0) return 0;

        const sum = evaluations.reduce((acc, evalItem) => acc + parseFloat(evalItem.note), 0);
        return (sum / evaluations.length).toFixed(2);
    },

    /**
     * Obtenir les statistiques des évaluations
     * @param {Array} evaluations
     * @returns {Object}
     */
    getStatsEvaluations: (evaluations) => {
        if (!evaluations || evaluations.length === 0) {
            return {
                total: 0,
                moyenne: 0,
                note_min: 0,
                note_max: 0,
                par_mention: {},
            };
        }

        const notes = evaluations.map((e) => parseFloat(e.note));
        const moyenne = (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2);
        const note_min = Math.min(...notes);
        const note_max = Math.max(...notes);

        // Répartition par mention
        const par_mention = {
            'Très Bien': evaluations.filter((e) => e.note >= 16).length,
            Bien: evaluations.filter((e) => e.note >= 14 && e.note < 16).length,
            'Assez Bien': evaluations.filter((e) => e.note >= 12 && e.note < 14).length,
            Passable: evaluations.filter((e) => e.note >= 10 && e.note < 12).length,
            Insuffisant: evaluations.filter((e) => e.note < 10).length,
        };

        return {
            total: evaluations.length,
            moyenne: parseFloat(moyenne),
            note_min,
            note_max,
            par_mention,
        };
    },

    /**
     * Générer un graphique de répartition des notes
     * @param {Array} evaluations
     * @returns {Array} Data pour Recharts
     */
    getChartData: (evaluations) => {
        const stats = evaluationService.getStatsEvaluations(evaluations);

        return [
            { mention: 'Très Bien', count: stats.par_mention['Très Bien'], fill: '#16a34a' },
            { mention: 'Bien', count: stats.par_mention['Bien'], fill: '#3b82f6' },
            { mention: 'Assez Bien', count: stats.par_mention['Assez Bien'], fill: '#eab308' },
            { mention: 'Passable', count: stats.par_mention['Passable'], fill: '#f97316' },
            { mention: 'Insuffisant', count: stats.par_mention['Insuffisant'], fill: '#dc2626' },
        ];
    },
};

export default evaluationService;
