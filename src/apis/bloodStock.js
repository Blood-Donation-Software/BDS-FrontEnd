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

export const withdrawStock = (bloodRequest) => {
    return axiosInstance.post(endpoint.bloodStock.withdraw,bloodRequest)
<<<<<<< HEAD
}

export const addToStock = (bloodUnit) => {
    return axiosInstance.post(endpoint.bloodStock.addStock, bloodUnit)
    .then(res => res.data);
}

export const deleteStock = (id) => {
    return axiosInstance.delete(`${endpoint.bloodStock.deleteStock(id)}`)
        .then(res => res.data);
=======
>>>>>>> 874435d2c0dd0c48c141f345f39be682ed8ef5a5
}