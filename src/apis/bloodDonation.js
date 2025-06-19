import axiosInstance, { endpoint } from "@/utils/axios"

// Create donation event request
export const createEvent = (event) => {
    return axiosInstance.post(endpoint.bloodDonation.createEvent, event)
        .then(res => res.data);
}

// Get all donation events (approved/public)
export const getAllEvents = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.listEvent, { params })
        .then(res => res.data);
}

// Get donation events by date range
export const getEventsByDateRange = (startDate, endDate, page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(`${endpoint.bloodDonation.listEvent}/${startDate}/${endDate}`, { params })
        .then(res => res.data);
}

// Get event details by ID
export const getEventById = (eventId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.listEvent}/${eventId}`)
        .then(res => res.data);
}

// Get my donation event requests
export const getMyRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.getMyRequests, { params })
        .then(res => res.data);
}

// Get pending requests (admin only)
export const getPendingRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.getPendingRequests, { params })
        .then(res => res.data);
}

// Verify donation request (admin only)
export const verifyRequest = (requestId, action) => {
    const params = { action };
    return axiosInstance.put(endpoint.bloodDonation.verifyRequest(requestId), null, { params })
        .then(res => res.data);
}

// Get request details by ID
export const getRequestById = (requestId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.getPendingRequests}/${requestId}`)
        .then(res => res.data);
}

// Get my request details by ID
export const getMyRequestById = (requestId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.getMyRequests}/${requestId}`)
        .then(res => res.data);
}

// Update donation event request
export const updateEventRequest = (eventId, eventData) => {
    return axiosInstance.put(endpoint.bloodDonation.updateEventRequest(eventId), eventData)
        .then(res => res.data);
}

// Delete donation event request
export const deleteEventRequest = (eventId) => {
    return axiosInstance.delete(endpoint.bloodDonation.deleteEventRequest(eventId))
        .then(res => res.data);
}