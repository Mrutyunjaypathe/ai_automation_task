import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisualEditor = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="btn-ghost">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold text-white">Visual Editor</h1>
            </div>

            <div className="glass-card p-8 text-center">
                <p className="text-slate-400 mb-4">Visual drag-and-drop editor coming soon!</p>
                <p className="text-sm text-slate-500">
                    This feature will allow you to visually design workflows with a node-based interface.
                </p>
            </div>
        </div>
    );
};

export default VisualEditor;
