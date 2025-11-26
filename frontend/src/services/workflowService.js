import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    signup: async (name, email, password) => {
        const response = await api.post('/auth/signup', { name, email, password });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const workflowService = {
    getAll: async () => {
        const response = await api.get('/workflows');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/workflows/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/workflows', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/workflows/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/workflows/${id}`);
        return response.data;
    },

    dryRun: async (id, payload = {}) => {
        const response = await api.post(`/workflows/${id}/dry-run`, payload);
        return response.data;
    },

    run: async (id, payload = {}) => {
        const response = await api.post(`/workflows/${id}/run`, payload);
        return response.data;
    },

    activate: async (id) => {
        const response = await api.post(`/workflows/${id}/activate`);
        return response.data;
    },

    getRuns: async (id) => {
        const response = await api.get(`/workflows/${id}/runs`);
        return response.data;
    },
};

export const runService = {
    getById: async (runId) => {
        const response = await api.get(`/runs/${runId}`);
        return response.data;
    },

    retry: async (runId) => {
        const response = await api.post(`/runs/${runId}/retry`);
        return response.data;
    },
};

export const connectorService = {
    getAll: async () => {
        const response = await api.get('/connectors');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/connectors', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/connectors/${id}`);
        return response.data;
    },
};
