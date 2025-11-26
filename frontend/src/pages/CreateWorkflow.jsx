import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Eye, Play, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { workflowService } from '../services/workflowService';

const CreateWorkflow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: NL input, 2: Review JSON
    const [loading, setLoading] = useState(false);
    const [nlInput, setNlInput] = useState('');
    const [workflowData, setWorkflowData] = useState(null);

    const examplePrompts = [
        "Every morning at 8 AM IST — fetch https://api.metrics.io/metrics and email me a one-paragraph summary to me@company.com",
        "When a row is added in Google Sheet X — generate a PDF proposal using template Y and upload to S3 and notify on Slack",
        "Every Monday at 9 AM — scrape competitor prices from website X and update our pricing sheet",
    ];

    const handleGenerate = async () => {
        if (!nlInput.trim()) {
            toast.error('Please describe your workflow');
            return;
        }

        setLoading(true);
        try {
            // In production, this would call the LLM parser endpoint
            // For now, we'll create a mock workflow
            const mockWorkflow = {
                name: nlInput.slice(0, 50) + (nlInput.length > 50 ? '...' : ''),
                description: nlInput,
                spec_json: {
                    trigger: { type: 'cron', cron: '0 8 * * *', tz: 'Asia/Kolkata' },
                    nodes: [
                        { id: 'n1', type: 'http_fetch', name: 'Fetch data', config: { url: 'https://api.example.com/data' } },
                        { id: 'n2', type: 'llm', name: 'Summarize', config: { prompt_template_id: 'summarize_v1' } },
                        { id: 'n3', type: 'email', name: 'Send email', config: { to: 'user@example.com', subject: 'Summary', body: '{{n2.output}}' } },
                    ],
                    edges: [['n1', 'n2'], ['n2', 'n3']],
                },
            };

            setWorkflowData(mockWorkflow);
            setStep(2);
            toast.success('Workflow generated successfully!');
        } catch (error) {
            toast.error('Failed to generate workflow');
        } finally {
            setLoading(false);
        }
    };

    const handleDryRun = async () => {
        setLoading(true);
        try {
            // Simulate dry run
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Dry run completed successfully!');
        } catch (error) {
            toast.error('Dry run failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const created = await workflowService.create(workflowData);
            toast.success('Workflow saved successfully!');
            navigate(`/workflows/${created.id}`);
        } catch (error) {
            toast.error('Failed to save workflow');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Create Workflow</h1>
                <p className="text-slate-400">Describe your automation in plain English and let AI build it for you</p>
            </div>

            {step === 1 ? (
                <>
                    {/* Natural Language Input */}
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6 text-primary-400" />
                            <h2 className="text-2xl font-bold text-white">Describe Your Workflow</h2>
                        </div>

                        <textarea
                            value={nlInput}
                            onChange={(e) => setNlInput(e.target.value)}
                            className="input-field min-h-[200px] resize-none font-mono"
                            placeholder="Example: Every morning at 8 AM, fetch data from https://api.example.com and send me a summary email..."
                        />

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                {loading ? 'Generating...' : 'Generate Workflow'}
                            </button>
                        </div>
                    </div>

                    {/* Example Prompts */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Example Workflows</h3>
                        <div className="space-y-3">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => setNlInput(prompt)}
                                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-primary-500/50 transition-all duration-200"
                                >
                                    <p className="text-sm text-slate-300">{prompt}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Generated Workflow Review */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* JSON Preview */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="w-5 h-5 text-primary-400" />
                                <h3 className="text-xl font-bold text-white">Workflow Specification</h3>
                            </div>
                            <div className="code-block max-h-[500px] overflow-auto scrollbar-thin">
                                <pre className="text-xs text-slate-300">
                                    {JSON.stringify(workflowData?.spec_json, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Visual Preview */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-5 h-5 text-primary-400" />
                                <h3 className="text-xl font-bold text-white">Visual Preview</h3>
                            </div>
                            <div className="space-y-4">
                                {workflowData?.spec_json?.nodes?.map((node, index) => (
                                    <div key={node.id} className="relative">
                                        <div className="node-card">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{node.name}</p>
                                                    <p className="text-xs text-slate-400">{node.type}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {index < workflowData.spec_json.nodes.length - 1 && (
                                            <div className="flex justify-center my-2">
                                                <div className="w-0.5 h-8 bg-gradient-to-b from-primary-500 to-transparent" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="btn-ghost"
                            >
                                ← Back to Edit
                            </button>
                            <div className="flex-1" />
                            <button
                                onClick={handleDryRun}
                                disabled={loading}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                {loading ? 'Running...' : 'Dry Run'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Workflow
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateWorkflow;
