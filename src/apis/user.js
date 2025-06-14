import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllProfile = (page,size) => {
    return axiosInstance.get(endpoint.user.getAllProfile,
        {params : {
            page,
            size
        }}
    )
    .then(res => res.data);
}