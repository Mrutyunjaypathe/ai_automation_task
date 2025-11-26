import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Play, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { workflowService } from '../services/workflowService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const WorkflowDetails = () => {
    const { id } = useParams();
    const { data: workflow, isLoading } = useQuery(['workflow', id], () => workflowService.getById(id));
    const { data: runs } = useQuery(['workflow-runs', id], () => workflowService.getRuns(id));

    const handleRun = async () => {
        try {
            await workflowService.run(id);
            toast.success('Workflow started successfully!');
        } catch (error) {
            toast.error('Failed to start workflow');
        }
    };

    const handleActivate = async () => {
        try {
            await workflowService.activate(id);
            toast.success('Workflow activated!');
        } catch (error) {
            toast.error('Failed to activate workflow');
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            success: <CheckCircle className="w-4 h-4 text-green-400" />,
            failed: <XCircle className="w-4 h-4 text-red-400" />,
            running: <Clock className="w-4 h-4 text-blue-400 animate-spin" />,
            pending: <Clock className="w-4 h-4 text-yellow-400" />,
        };
        return icons[status] || icons.pending;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="btn-ghost">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-1">{workflow?.name}</h1>
                    <p className="text-slate-400">{workflow?.description}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleRun} className="btn-primary flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Run Now
                    </button>
                    <Link to={`/workflows/${id}/edit`} className="btn-secondary flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Edit
                    </Link>
                    <button className="btn-ghost text-red-400 hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Workflow Spec */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Workflow Specification</h2>
                <div className="code-block">
                    <pre className="text-xs text-slate-300">
                        {JSON.stringify(workflow?.spec_json, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Trigger Settings */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Trigger Settings</h2>
                    <button onClick={handleActivate} className="btn-secondary text-sm">
                        Activate Schedule
                    </button>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-300">
                        <span className="text-slate-500">Type:</span> {workflow?.spec_json?.trigger?.type || 'manual'}
                    </p>
                    {workflow?.spec_json?.trigger?.cron && (
                        <p className="text-slate-300 mt-2">
                            <span className="text-slate-500">Schedule:</span> {workflow.spec_json.trigger.cron}
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Runs */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Runs</h2>
                <div className="space-y-3">
                    {runs && runs.length > 0 ? (
                        runs.map((run) => (
                            <Link
                                key={run.id}
                                to={`/runs/${run.id}`}
                                className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(run.run_status)}
                                        <div>
                                            <p className="text-white font-medium">Run #{run.id.slice(0, 8)}</p>
                                            <p className="text-xs text-slate-400">
                                                {format(new Date(run.started_at), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${run.run_status === 'success' ? 'success' : run.run_status === 'failed' ? 'error' : 'info'}`}>
                                        {run.run_status}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-slate-400 py-8">No runs yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkflowDetails;
