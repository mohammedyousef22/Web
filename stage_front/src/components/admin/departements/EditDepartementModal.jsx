// src/components/admin/departements/EditDepartementModal.jsx
export const EditDepartementModal = ({ isOpen, onClose, departement, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        responsable: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && departement) {
            setFormData({
                nom: departement.nom || '',
                description: departement.description || '',
                responsable: departement.responsable || '',
            });
        }
    }, [isOpen, departement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await departementService.updateDepartement(departement.id, formData);
            Toast.success('Département modifié avec succès !');
            onSuccess();
            onClose();
        } catch (error) {
            Toast.error(error.message || 'Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Modifier le département"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>Enregistrer</Button>
                </div>
            }
        >
            <form className="space-y-4">
                <Input
                    label="Nom du département"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                />

                <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />

                <Input
                    label="Responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                />
            </form>
        </Modal>
    );
};