import apiClient from "../api/client";

/**
 * Fetch all animals from the encyclopedia
 * @param {string} sort - Sort order: 'name' (default) or 'newest'
 * @param {string} tags - Comma-separated tags to filter by
 * @returns {Promise} Array of animals
 */
export const fetchAllAnimals = async (sort = "name", tags = null) => {
  try {
    let url = "/animals?sort=" + sort;
    if (tags) {
      url += "&tags=" + tags;
    }
    const response = await apiClient.get(`/api${url}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};

/**
 * Fetch a single animal by ID
 * @param {string} animalId - MongoDB ObjectId of the animal
 * @returns {Promise} Animal object
 */
export const fetchAnimalById = async (animalId) => {
  try {
    const response = await apiClient.get(`/api/animals/${animalId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching animal ${animalId}:`, error);
    throw error;
  }
};

export default {
  fetchAllAnimals,
  fetchAnimalById,
};
