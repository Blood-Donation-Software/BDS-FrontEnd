import axiosInstance, { endpoint } from "@/utils/axios"

export const checkStock = () => {
    return axiosInstance.get(endpoint.bloodStock.getStock)
    .then(res => res.data);
}