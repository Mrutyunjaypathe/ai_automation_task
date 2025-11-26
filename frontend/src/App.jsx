import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/Dashboard';
import CreateWorkflow from './pages/CreateWorkflow';
import WorkflowDetails from './pages/WorkflowDetails';
import VisualEditor from './pages/VisualEditor';
import RunDetails from './pages/RunDetails';
import Connectors from './pages/Connectors';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgba(15, 23, 42, 0.95)',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#14b8a6',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="workflows/create" element={<CreateWorkflow />} />
                        <Route path="workflows/:id" element={<WorkflowDetails />} />
                        <Route path="workflows/:id/edit" element={<VisualEditor />} />
                        <Route path="runs/:runId" element={<RunDetails />} />
                        <Route path="connectors" element={<Connectors />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
