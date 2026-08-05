import { httpClient } from "@/lib/axios/httpClient";
import { ISpecialty } from "@/types/specialty.types";

export const getAllSpecialties = async (): Promise<ISpecialty[]> => {
  const response = await httpClient.get<ISpecialty[]>("/specialties");
  return response.data;
};
