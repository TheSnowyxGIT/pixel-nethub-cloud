import { Font } from "@/models/Font";
import apiClient from "./index";

export const getFonts = async () => {
  try {
    const response = await apiClient.get<Font[]>(`/fonts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFont = async (id: string) => {
  try {
    const response = await apiClient.get<Font>(`/fonts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadFont = async (id: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/fonts/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
