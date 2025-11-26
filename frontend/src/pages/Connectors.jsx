import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Trash2, Globe, Mail, Database } from 'lucide-react';
import { connectorService } from '../services/workflowService';
import toast from 'react-hot-toast';

const Connectors = () => {
    const queryClient = useQueryClient();
    const { data: connectors, isLoading } = useQuery('connectors', connectorService.getAll);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'http',
        config: {},
    });

    const deleteMutation = useMutation(connectorService.delete, {
        onSuccess: () => {
            queryClient.invalidateQueries('connectors');
            toast.success('Connector deleted');
        },
    });

    const createMutation = useMutation(connectorService.create, {
        onSuccess: () => {
            queryClient.invalidateQueries('connectors');
            setShowModal(false);
            setFormData({ name: '', type: 'http', config: {} });
            toast.success('Connector created');
        },
    });

    const connectorTypes = [
        { value: 'http', label: 'HTTP API', icon: Globe },
        { value: 'smtp', label: 'Email (SMTP)', icon: Mail },
        { value: 'google_sheets', label: 'Google Sheets', icon: Database },
        { value: 'notion', label: 'Notion', icon: Database },
        { value: 'slack', label: 'Slack', icon: Database },
    ];

    const getConnectorIcon = (type) => {
        const connector = connectorTypes.find(c => c.value === type);
        const Icon = connector?.icon || Globe;
        return <Icon className="w-5 h-5" />;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Connectors</h1>
                    <p className="text-slate-400">Manage your external service connections</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Connector
                </button>
            </div>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-6 h-40 animate-pulse" />
                    ))
                ) : connectors && connectors.length > 0 ? (
                    connectors.map((connector) => (
                        <div key={connector.id} className="glass-card-hover p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                                    {getConnectorIcon(connector.type)}
                                </div>
                                <button
                                    onClick={() => deleteMutation.mutate(connector.id)}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{connector.name}</h3>
                            <p className="text-sm text-slate-400 capitalize">{connector.type.replace('_', ' ')}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full glass-card p-12 text-center">
                        <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">No connectors yet</p>
                        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Your First Connector
                        </button>
                    </div>
                )}
            </div>

            {/* Add Connector Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Add Connector</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="My API Connector"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="input-field"
                                >
                                    {connectorTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Connectors;
