/**
 * API Service for database interaction.
 * @namespace
 */
const API_URL = 'http://localhost:3000/users';

export const API = {
  /**
   * Finds a user by their email address.
   * @param {string} email - User email to search for.
   * @returns {Promise<Object[]>} Array containing user if found.
   */
  async findUserByEmail(email) {
    try {
      const response = await fetch(`${API_URL}?email=${email}`);
      return await response.json();
    } catch (error) {
      console.error('API Error (findUser):', error);
      throw error;
    }
  },

  /**
   * Saves a new user to the database.
   * @param {Object} userData - User information object.
   * @returns {Promise<Object>} Created user data.
   */
  async createUser(userData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error (createUser):', error);
      throw error;
    }
  },
};
