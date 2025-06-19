import axiosInstance, { endpoint } from "@/utils/axios"

// Get all organizers
export const getAllOrganizers = (page = 0, size = 10, sortBy = 'organizationName', sortDir = 'asc', search = null, status = null) => {
    let params = { page, size, sortBy, sortDir };
    if (search) params.search = search;
    if (status) params.status = status;
    
    return axiosInstance.get(endpoint.organizer.getAll, { params })
        .then(res => res.data);
}

// Get active organizers
export const getActiveOrganizers = () => {
    return axiosInstance.get(endpoint.organizer.getActive)
        .then(res => res.data);
}

// Get organizer by ID
export const getOrganizerById = (id) => {
    return axiosInstance.get(endpoint.organizer.getById(id))
        .then(res => res.data);
}

// Get organizer by email
export const getOrganizerByEmail = (email) => {
    return axiosInstance.get(endpoint.organizer.getByEmail(email))
        .then(res => res.data);
}

// Create new organizer
export const createOrganizer = (organizerData) => {
    return axiosInstance.post(endpoint.organizer.create, organizerData)
        .then(res => res.data);
}

// Update organizer
export const updateOrganizer = (id, organizerData) => {
    return axiosInstance.put(endpoint.organizer.update(id), organizerData)
        .then(res => res.data);
}

// Delete organizer
export const deleteOrganizer = (id) => {
    return axiosInstance.delete(endpoint.organizer.delete(id))
        .then(res => res.data);
}

// Activate organizer
export const activateOrganizer = (id) => {
    return axiosInstance.put(endpoint.organizer.activate(id))
        .then(res => res.data);
}

// Deactivate organizer
export const deactivateOrganizer = (id) => {
    return axiosInstance.put(endpoint.organizer.deactivate(id))
        .then(res => res.data);
}

// Get organizers by city
export const getOrganizersByCity = (city) => {
    return axiosInstance.get(endpoint.organizer.getByCity(city))
        .then(res => res.data);
}

// Check if email exists
export const checkEmailExists = (email) => {
    return axiosInstance.get(endpoint.organizer.checkEmail, { params: { email } })
        .then(res => res.data);
}

// Get organizer statistics
export const getOrganizerStats = () => {
    return Promise.all([
        axiosInstance.get(endpoint.organizer.getTotalCount),
        axiosInstance.get(endpoint.organizer.getActiveCount)
    ]).then(([total, active]) => ({
        total: total.data,
        active: active.data
    }));
}
