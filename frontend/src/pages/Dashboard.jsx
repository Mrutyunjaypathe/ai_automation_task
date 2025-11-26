import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
    Plus,
    Workflow,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Zap,
    Activity
} from 'lucide-react';
import { workflowService } from '../services/workflowService';
import { format } from 'date-fns';

const Dashboard = () => {
    const { data: workflows, isLoading } = useQuery('workflows', workflowService.getAll);

    const stats = [
        {
            label: 'Total Workflows',
            value: workflows?.length || 0,
            icon: Workflow,
            color: 'from-primary-500 to-primary-600',
        },
        {
            label: 'Active Workflows',
            value: workflows?.filter(w => w.status === 'active').length || 0,
            icon: Activity,
            color: 'from-green-500 to-green-600',
        },
        {
            label: 'Total Runs',
            value: '127', // Mock data
            icon: Zap,
            color: 'from-accent-500 to-accent-600',
        },
        {
            label: 'Success Rate',
            value: '94%', // Mock data
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            active: 'badge-success',
            draft: 'badge-warning',
            archived: 'badge-info',
        };
        return badges[status] || 'badge-info';
    };

    const getRunStatusIcon = (status) => {
        const icons = {
            success: <CheckCircle className="w-4 h-4 text-green-400" />,
            failed: <XCircle className="w-4 h-4 text-red-400" />,
            running: <Clock className="w-4 h-4 text-blue-400 animate-spin" />,
            pending: <Clock className="w-4 h-4 text-yellow-400" />,
        };
        return icons[status] || icons.pending;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">Welcome back! Here's what's happening with your workflows.</p>
                </div>
                <Link to="/workflows/create" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Workflow
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="glass-card-hover p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Workflows */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Recent Workflows</h2>
                    <Link to="/workflows/create" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                        View All →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : workflows && workflows.length > 0 ? (
                    <div className="space-y-4">
                        {workflows.slice(0, 5).map((workflow) => (
                            <Link
                                key={workflow.id}
                                to={`/workflows/${workflow.id}`}
                                className="block glass-card-hover p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                                            <span className={`badge ${getStatusBadge(workflow.status)}`}>
                                                {workflow.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-1">{workflow.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-xs text-slate-500">
                                            Updated {format(new Date(workflow.updated_at), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Workflow className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">No workflows yet</p>
                        <Link to="/workflows/create" className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Your First Workflow
                        </Link>
                    </div>
                )}
            </div>

            {/* Recent Runs */}
            <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Runs</h2>
                <div className="space-y-3">
                    {/* Mock data */}
                    {[
                        { id: 1, workflow: 'Daily Analytics Summary', status: 'success', time: '2 hours ago' },
                        { id: 2, workflow: 'Auto-generate Proposals', status: 'running', time: '5 hours ago' },
                        { id: 3, workflow: 'Slack Notifications', status: 'success', time: '1 day ago' },
                    ].map((run) => (
                        <div key={run.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
                            <div className="flex items-center gap-3">
                                {getRunStatusIcon(run.status)}
                                <div>
                                    <p className="text-white font-medium">{run.workflow}</p>
                                    <p className="text-xs text-slate-400">{run.time}</p>
                                </div>
                            </div>
                            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
