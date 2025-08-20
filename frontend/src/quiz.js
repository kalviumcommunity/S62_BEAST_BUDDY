import axios from "axios";

export const fetchAnimal = async (answers, userId = null) => {
  return axios.post("http://localhost:8000/quiz/fetch-animal", {
    answers,
    userId, // can be null
  });
};
