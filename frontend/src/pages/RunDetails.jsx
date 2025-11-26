import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { runService } from '../services/workflowService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RunDetails = () => {
    const { runId } = useParams();
    const { data: run, isLoading } = useQuery(['run', runId], () => runService.getById(runId));

    const handleRetry = async () => {
        try {
            await runService.retry(runId);
            toast.success('Retry initiated!');
        } catch (error) {
            toast.error('Failed to retry');
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            success: <CheckCircle className="w-6 h-6 text-green-400" />,
            failed: <XCircle className="w-6 h-6 text-red-400" />,
            running: <Clock className="w-6 h-6 text-blue-400 animate-spin" />,
            pending: <Clock className="w-6 h-6 text-yellow-400" />,
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
                <Link to={`/workflows/${run?.workflow_id}`} className="btn-ghost">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-1">Run Details</h1>
                    <p className="text-slate-400">Run ID: {runId}</p>
                </div>
                {run?.run_status === 'failed' && (
                    <button onClick={handleRetry} className="btn-primary flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Retry
                    </button>
                )}
            </div>

            {/* Status Overview */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-6">
                    {getStatusIcon(run?.run_status)}
                    <div>
                        <h2 className="text-2xl font-bold text-white capitalize">{run?.run_status}</h2>
                        <p className="text-slate-400">
                            Started: {run?.started_at && format(new Date(run.started_at), 'MMM dd, yyyy HH:mm:ss')}
                        </p>
                        {run?.finished_at && (
                            <p className="text-slate-400">
                                Finished: {format(new Date(run.finished_at), 'MMM dd, yyyy HH:mm:ss')}
                            </p>
                        )}
                    </div>
                </div>

                {run?.input_payload && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Input Payload</h3>
                        <div className="code-block">
                            <pre className="text-xs text-slate-300">
                                {JSON.stringify(run.input_payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {run?.result_summary && (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Result Summary</h3>
                        <div className="code-block">
                            <pre className="text-xs text-slate-300">
                                {JSON.stringify(run.result_summary, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Task Logs */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Task Execution Logs</h2>
                <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-slate-400 text-sm">Detailed task logs will appear here...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RunDetails;
