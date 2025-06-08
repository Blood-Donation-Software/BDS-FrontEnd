import axiosInstance, { endpoint } from "@/utils/axios"

export const checkStock = () => {
    return axiosInstance.get(endpoint.bloodStock.getStock)
    .then(res => res.data);
}

export const checkStockByType = (componentTypes, bloodType) => {
    return axiosInstance.post(endpoint.bloodStock.getStockByType,componentTypes,
        {params: {
            bloodType
        }})
        .then(res => res.data);
}