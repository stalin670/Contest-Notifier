import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL) console.warn("[api] VITE_API_BASE_URL not set");

export const api = axios.create({
    baseURL,
    timeout: 15000,
});

export const fetchAllContests = async () => {
    const { data } = await api.get("/api/contests/all");
    return data;
};

export const fetchSolution = async (contestId) => {
    try {
        const { data } = await api.get(`/api/contests/solution/${encodeURIComponent(contestId)}`);
        return data.solutionLink ?? null;
    } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
    }
};

export const addSolution = async (payload) => {
    const { data } = await api.post("/api/contests/add-solution", payload);
    return data;
};
