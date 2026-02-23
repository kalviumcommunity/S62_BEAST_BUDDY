import apiClient from "./api/client";

export const fetchAnimal = async (answers) => {
  return apiClient.post("/quiz/fetch-animal", {
    answers
  });
};
