// MANAGE SESSIONS 
export const Storage = {
  /**
   * Saves the user session to localStorage
   * @param {Object} user - The user object
   */
  saveSession(user) {
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    localStorage.setItem('user', JSON.stringify(sessionUser));
  },

  /**
   * Retrieves the current user session
   * @returns {Object|null}
   */
  getSession() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // DELETE SESSION
  clearSession() {
    localStorage.removeItem('user');
  },
};
