import { Font, NewFontData, UpdateFontData } from "@/models/Font";
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

export const uploadFont = async (data: NewFontData) => {
  try {
    const formData = new FormData();
    for (const key of Object.keys(data)) {
      if (data[key as keyof NewFontData] instanceof Blob) {
        formData.append(key, data[key as keyof NewFontData] as Blob);
      } else {
        formData.append(key, `${data[key as keyof NewFontData]}`);
      }
    }
    const response = await apiClient.post<Font>(`/fonts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFont = async (id: string, data: UpdateFontData) => {
  try {
    const response = await apiClient.put<Font>(`/fonts/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFont = async (id: string) => {
  try {
    const response = await apiClient.delete(`/fonts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
