import axiosInstance, { endpoint } from "@/utils/axios";

// Get distance for a specific profile
export const getProfileDistance = (profileId) => {
    return axiosInstance.get(endpoint.profileDistance.getDistance(profileId))
        .then(res => res.data);
};

// Calculate distance for a specific profile
export const calculateProfileDistance = (profileId) => {
    return axiosInstance.post(endpoint.profileDistance.calculateDistance(profileId))
        .then(res => res.data);
};

// Recalculate distance for a specific profile
export const recalculateProfileDistance = (profileId) => {
    return axiosInstance.post(endpoint.profileDistance.recalculateDistance(profileId))
        .then(res => res.data);
};

// Get profiles within a certain distance
export const getProfilesWithinDistance = (maxDistanceKm) => {
    return axiosInstance.get(endpoint.profileDistance.getWithinDistance, {
        params: { maxDistanceKm }
    }).then(res => res.data);
};

// Get all profiles ordered by distance
export const getAllProfilesOrderedByDistance = () => {
    return axiosInstance.get(endpoint.profileDistance.getAllOrdered)
        .then(res => res.data);
};

// New APIs that return ProfileDto with distance information for frontend pagination
export const getProfilesWithinDistanceAsProfileDto = (maxDistanceKm, page = 0, size = 10) => {
    return axiosInstance.get(endpoint.profileDistance.getProfilesWithinDistance, {
        params: { maxDistanceKm, page, size }
    }).then(res => res.data);
};

export const getAllProfilesOrderedByDistanceAsProfileDto = (page = 0, size = 10) => {
    return axiosInstance.get(endpoint.profileDistance.getProfilesAllOrdered, {
        params: { page, size }
    }).then(res => res.data);
};

// Calculate missing distances (admin only)
export const calculateMissingDistances = () => {
    return axiosInstance.post(endpoint.profileDistance.calculateMissing)
        .then(res => res.data);
};

// Delete distance for a specific profile (admin only)
export const deleteProfileDistance = (profileId) => {
    return axiosInstance.delete(endpoint.profileDistance.deleteDistance(profileId))
        .then(res => res.data);
};