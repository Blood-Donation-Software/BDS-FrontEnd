import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllRequest = () => {
    return axiosInstance.get(endpoint.bloodRequest.getAll)
    .then(res => res.data);
}

export const createRequest = (bloodRequest) => {
    return axiosInstance.post(endpoint.bloodRequest.create, bloodRequest)
    .then(res=>res.data);
}

export const getRequestById = (id) => {
    return axiosInstance.get(`${endpoint.bloodRequest.getById}/${id}`)
    .then(res => res.data);
}