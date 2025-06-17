import axiosInstance, { endpoint } from "@/utils/axios"

export const createEvent = (event) => {
    return axiosInstance.post(endpoint.bloodDonation.createEvent, event)
    .then(res => res.data);
}