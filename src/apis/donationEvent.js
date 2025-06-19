import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllEvents = () => {
    return axiosInstance.get(endpoint.donationEvent.getAll)
    .then(res => res.data);
}