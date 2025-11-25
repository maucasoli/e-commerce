import api from "../api/axiosInstance";

const API_URL = "/listes";

export const createListe = async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
};

export const getListeByCode = async (code) => {
    const response = await api.get(`${API_URL}/${code}`);
    return response.data;
};

export const acheterDepuisListe = async (code, items) => {
    const response = await api.post(`${API_URL}/${code}`, { items });
    return response.data;
};
