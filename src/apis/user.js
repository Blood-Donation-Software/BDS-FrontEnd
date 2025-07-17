import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllProfile = (page,size) => {
    return axiosInstance.get(endpoint.user.getAllProfile,
        {
            params : {
                page,
                size
            }
        }
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

export const createProfile = (profileData) => {
    return axiosInstance.post(endpoint.user.create, profileData)
        .then(res => res.data);
}

export const updatePassword = (oldPassword, newPassword) => {
    return axiosInstance.put(endpoint.user.updatePassword, {
        oldPassword,
        newPassword
    }).then(res => res.data);
}

export const getDonationHistoryById = (profileId) => {
    return axiosInstance.get(endpoint.user.getDonationHistoryById(profileId))
        .then(res => res.data);
}

export const updateStatus = (accountId, status) => {
    return axiosInstance.put(
        endpoint.user.updateStatus(accountId),
        { status }
    ).then(res => res.data);
}
export const uploadAvatar = (accountId, avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return axiosInstance.put(endpoint.user.updateAvatar(accountId), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },    }).then(res => res.data);
}

export const getDonationHistory = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    return axiosInstance.get(endpoint.user.getDonationHistory, {
        params: {
            page,
            size,
            sortBy,
            ascending
        }
    }).then(res => res.data);
}