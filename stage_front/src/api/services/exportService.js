// src/api/services/exportService.js
import axiosInstance from '../axios';
import { ADMIN } from '../endpoints';

/**
 * Service pour gérer les exports (PDF/Excel)
 */
const exportService = {
    /**
     * Exporter la liste des stagiaires en PDF
     * @param {Object} filters - { etablissement, niveau_etude, statut_stage }
     * @returns {Promise<Blob>}
     */
    exportStagiairesPDF: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const baseUrl = `${ADMIN.EXPORT_STAGIAIRES}/pdf`;
            const url = params ? `${baseUrl}?${params}` : baseUrl;

            const response = await axiosInstance.get(url, {
                responseType: 'blob', // Important pour recevoir le fichier
            });

            // Créer un lien de téléchargement
            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `stagiaires_${exportService.getCurrentDateString()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, message: 'Export PDF réussi' };
        } catch (error) {
            throw new Error('Erreur lors de l\'export PDF des stagiaires');
        }
    },

    /**
     * Exporter la liste des encadrants en Excel
     * @param {Object} filters - { departement_id }
     * @returns {Promise<Blob>}
     */
    exportEncadrantsExcel: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const baseUrl = `${ADMIN.EXPORT_ENCADRANTS}/excel`;
            const url = params ? `${baseUrl}?${params}` : baseUrl;

            const response = await axiosInstance.get(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `encadrants_${exportService.getCurrentDateString()}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, message: 'Export Excel réussi' };
        } catch (error) {
            throw new Error('Erreur lors de l\'export Excel des encadrants');
        }
    },

    /**
     * Exporter la liste des stages en PDF
     * @param {Object} filters - { statut, departement_id, date_debut_from, date_fin_to }
     * @returns {Promise<Blob>}
     */
    exportStagesPDF: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const baseUrl = `${ADMIN.EXPORT_STAGES}/pdf`;
            const url = params ? `${baseUrl}?${params}` : baseUrl;

            const response = await axiosInstance.get(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `stages_${exportService.getCurrentDateString()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, message: 'Export PDF réussi' };
        } catch (error) {
            throw new Error('Erreur lors de l\'export PDF des stages');
        }
    },

    /**
     * Exporter la liste des stages en Excel
     * @param {Object} filters
     * @returns {Promise<Blob>}
     */
    exportStagesExcel: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const baseUrl = `${ADMIN.EXPORT_STAGES}/excel`;
            const url = params ? `${baseUrl}?${params}` : baseUrl;

            const response = await axiosInstance.get(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `stages_${exportService.getCurrentDateString()}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, message: 'Export Excel réussi' };
        } catch (error) {
            throw new Error('Erreur lors de l\'export Excel des stages');
        }
    },

    // ========================
    // HELPERS
    // ========================

    /**
     * Obtenir la date actuelle formatée pour nom de fichier
     * @returns {string} Format: YYYY-MM-DD
     */
    getCurrentDateString: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Télécharger un fichier depuis une URL blob
     * @param {Blob} blob
     * @param {string} filename
     * @param {string} mimeType
     */
    downloadBlob: (blob, filename, mimeType) => {
        const blobObj = new Blob([blob], { type: mimeType });
        const downloadUrl = window.URL.createObjectURL(blobObj);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    },

    /**
     * Exporter des données en CSV (côté client)
     * @param {Array} data - Tableau d'objets
     * @param {string} filename - Nom du fichier
     * @param {Array} columns - Liste des colonnes à exporter
     */
    exportToCSV: (data, filename, columns = null) => {
        if (!data || data.length === 0) {
            throw new Error('Aucune donnée à exporter');
        }

        // Si columns non fourni, prendre toutes les clés du premier objet
        const cols = columns || Object.keys(data[0]);

        // Créer l'en-tête CSV
        const csvHeader = cols.join(',') + '\n';

        // Créer les lignes CSV
        const csvRows = data
            .map((row) => {
                return cols
                    .map((col) => {
                        let value = row[col] ?? '';
                        // Échapper les guillemets et virgules
                        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                            value = `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    })
                    .join(',');
            })
            .join('\n');

        const csvContent = csvHeader + csvRows;

        // Créer le blob et télécharger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        exportService.downloadBlob(blob, `${filename}_${exportService.getCurrentDateString()}.csv`, 'text/csv');
    },

    /**
     * Exporter des données en JSON (côté client)
     * @param {Array|Object} data
     * @param {string} filename
     */
    exportToJSON: (data, filename) => {
        if (!data) {
            throw new Error('Aucune donnée à exporter');
        }

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        exportService.downloadBlob(blob, `${filename}_${exportService.getCurrentDateString()}.json`, 'application/json');
    },

    /**
     * Vérifier si le navigateur supporte le téléchargement de fichiers
     * @returns {boolean}
     */
    isDownloadSupported: () => {
        return typeof window !== 'undefined' && 'download' in document.createElement('a');
    },

    /**
     * Obtenir la taille lisible d'un fichier
     * @param {number} bytes
     * @returns {string}
     */
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Types de formats d'export supportés
     * @returns {Array}
     */
    getSupportedFormats: () => {
        return [
            { value: 'pdf', label: 'PDF', icon: 'FileText', mimeType: 'application/pdf' },
            {
                value: 'excel',
                label: 'Excel',
                icon: 'FileSpreadsheet',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            { value: 'csv', label: 'CSV', icon: 'File', mimeType: 'text/csv' },
            { value: 'json', label: 'JSON', icon: 'FileCode', mimeType: 'application/json' },
        ];
    },
};

export default exportService;
