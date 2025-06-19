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

export const getAllAccount = () => {
    return axiosInstance.get(endpoint.user.getAllAccount)
        .then(res => res.data);
}

export const getProfile = () => {
    return axiosInstance.get(endpoint.user.getProfile)
        .then(res => res.data);
}

export const genAvatar = (name,rounded) => {
    return axiosInstance.get(endpoint.user.genAvatar(name,rounded),{
        withCredentials: false
    })
        .then(res => res.data);
}

export const getAccount = () => {
    return axiosInstance.get(endpoint.user.getAccount)
        .then(res => res.data);
}

export const updateProfile = (profile) => {
    return axiosInstance.put(endpoint.user.updateProfile, profile)
        .then(res => res.data);
}

export const uploadAvatar = (accountId, avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return axiosInstance.put(endpoint.user.updateAvatar(accountId), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => res.data);
}