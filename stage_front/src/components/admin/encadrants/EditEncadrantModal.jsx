// src/components/admin/encadrants/EditEncadrantModal.jsx
export const EditEncadrantModal = ({ isOpen, onClose, encadrant, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [departements, setDepartements] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        departement_id: '',
        specialite: '',
        telephone: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && encadrant) {
            loadDepartements();
            setFormData({
                name: encadrant.user?.name || '',
                departement_id: encadrant.departement_id || '',
                specialite: encadrant.specialite || '',
                telephone: encadrant.telephone || '',
            });
        }
    }, [isOpen, encadrant]);

    const loadDepartements = async () => {
        try {
            const response = await departementService.getAllDepartements();
            setDepartements(response.departements.map(d => ({ value: d.id, label: d.nom })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await encadrantService.updateEncadrant(encadrant.id, formData);
            Toast.success('Encadrant modifié avec succès !');
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
            title="Modifier l'encadrant"
            size="md"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={loading}>Enregistrer</Button>
                </div>
            }
        >
            <form className="space-y-4">
                <Input label="Nom complet" name="name" value={formData.name} onChange={handleChange} required />
                <Select label="Département" name="departement_id" value={formData.departement_id} onChange={handleChange} options={departements} required />
                <Input label="Spécialité" name="specialite" value={formData.specialite} onChange={handleChange} required />
                <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} />
            </form>
        </Modal>
    );
};