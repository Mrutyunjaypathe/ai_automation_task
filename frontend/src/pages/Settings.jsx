import { User, Key, Bell } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-4xl space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your account and preferences</p>
            </div>

            {/* Profile Settings */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-bold text-white">Profile</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                        <input type="text" className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input type="email" className="input-field" placeholder="your@email.com" />
                    </div>
                    <button className="btn-primary">Save Changes</button>
                </div>
            </div>

            {/* API Keys */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Key className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-bold text-white">API Keys</h2>
                </div>
                <p className="text-slate-400 mb-4">Manage your API keys for external integrations</p>
                <button className="btn-secondary">Generate New Key</button>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                </div>
                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5" defaultChecked />
                        <span className="text-slate-300">Email notifications for workflow failures</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-white/5" defaultChecked />
                        <span className="text-slate-300">Weekly summary reports</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
