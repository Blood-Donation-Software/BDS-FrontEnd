// Profile API functions

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const searchProfiles = async (query) => {
  try {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return [];
    }

    const response = await fetch(`${BASE_URL}/api/user/profile/search?q=${encodeURIComponent(query.trim())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error searching profiles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
};

export const getProfileById = async (profileId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/profile/${profileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error getting profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};
