// src/components/stagiaire/profil/UploadCVModal.jsx
export const UploadCVModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            await stagiaireService.uploadCV(file);
            Toast.success('CV téléchargé avec succès !');
            onSuccess();
            onClose();
        } catch (error) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Télécharger mon CV" size="md" footer={
            <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                <Button variant="primary" onClick={handleUpload} loading={loading}>Télécharger</Button>
            </div>
        }>
            <FileUpload label="CV (PDF uniquement)" accept=".pdf" maxSize={5 * 1024 * 1024} onChange={setFile} required />
        </Modal>
    );
};