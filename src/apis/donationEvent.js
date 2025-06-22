import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllEvents = () => {
    return axiosInstance.get(endpoint.bloodDonation.listEvent)
    .then(res => res.data);
}