'use client'

import { getRequestById } from '@/apis/bloodrequest';
<<<<<<< HEAD
import { deleteStock } from '@/apis/bloodStock';
import { getAllAccount, updateProfile } from '@/apis/user';
import { AVATAR_URL, BASE_URL } from '@/global-config';
=======
import { BASE_URL } from '@/global-config';
>>>>>>> 874435d2c0dd0c48c141f345f39be682ed8ef5a5
import axios from 'axios';
import { add } from 'lodash';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // window.location.href = '/login';
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export const endpoint = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    verify: `${BASE_URL}/api/auth/verify`,
    loginGoogle: `${BASE_URL}/oauth2/authorization/google`
  },  
  user: {
<<<<<<< HEAD
    updateProfile: `${BASE_URL}/api/user/profile/update`,
    getProfile: `${BASE_URL}/api/user/profile`,
    getAllProfile: `${BASE_URL}/api/user/profile/list-profile`,
    getAllAccount: `${BASE_URL}/api/user/account/list-account`,
    genAvatar: (name,rounded) => `${AVATAR_URL}/api/?name=${name}&rounded=${rounded}`,
    getAccount: `${BASE_URL}/api/user/account`,
    updateAvatar: (accountId) => `${BASE_URL}/api/user/account/${accountId}/avatar`,
=======
    profile: `${BASE_URL}/user/info`,
>>>>>>> 874435d2c0dd0c48c141f345f39be682ed8ef5a5
  },
  bloodRequest: {
    getAll: `${BASE_URL}/blood-request/request-list`,
    create: `${BASE_URL}/blood-request/create-request`,
    getById: `${BASE_URL}/blood-request`
  },
  bloodStock: {
<<<<<<< HEAD
    checkStock: `${BASE_URL}/api/medical-facility-stock/check-stock`,
    addToStock: `${BASE_URL}/api/medical-facility-stock/add-from-event`,
    withdraw: `${BASE_URL}/api/medical-facility-stock/withdrawn`,
    getStock: `${BASE_URL}/api/medical-facility-stock/get-stock`,
    getStockByType: `${BASE_URL}/api/medical-facility-stock/get-stock-by-type`,
    addStock: `${BASE_URL}/api/medical-facility-stock/add-blood-into-stock`,
    deleteStock: (id) => `${BASE_URL}/api/medical-facility-stock/${id}`,
  },      bloodDonation: {
    createEvent: `${BASE_URL}/api/donation-event-request/create`,
    listEvent: `${BASE_URL}/api/donation-event/list-donation`,
    approveEvent: (eventId) => `${BASE_URL}/api/donation-event/list-donation`,
    getMyRequests: `${BASE_URL}/api/donation-event-request/my-requests`,
    getPendingRequests: `${BASE_URL}/api/donation-event-request/pending`,
    verifyRequest: (requestId) => `${BASE_URL}/api/donation-event-request/pending/${requestId}/verify`,
    updateEventRequest: (eventId) => `${BASE_URL}/api/donation-event-request/update/${eventId}`,
    deleteEventRequest: (eventId) => `${BASE_URL}/api/donation-event-request/delete/${eventId}`,
  },
  organizer: {
    getAll: `${BASE_URL}/api/organizers`,
    getActive: `${BASE_URL}/api/organizers/active`,
    getById: (id) => `${BASE_URL}/api/organizers/${id}`,
    getByEmail: (email) => `${BASE_URL}/api/organizers/email/${email}`,
    create: `${BASE_URL}/api/organizers`,
    update: (id) => `${BASE_URL}/api/organizers/${id}`,
    delete: (id) => `${BASE_URL}/api/organizers/${id}`,
    activate: (id) => `${BASE_URL}/api/organizers/${id}/activate`,
    deactivate: (id) => `${BASE_URL}/api/organizers/${id}/deactivate`,
    getByCity: (city) => `${BASE_URL}/api/organizers/city/${city}`,
    checkEmail: `${BASE_URL}/api/organizers/check-email`,
    getTotalCount: `${BASE_URL}/api/organizers/stats/count`,
    getActiveCount: `${BASE_URL}/api/organizers/stats/active-count`,
=======
    checkStock: `${BASE_URL}/medical-facility-stock/check-stock`,
    addToStock: `${BASE_URL}/medical-facility-stock/add-from-event`,
    withdraw: `${BASE_URL}/medical-facility-stock/withdrawn`,
    getStock: `${BASE_URL}/medical-facility-stock/get-stock`,
    getStockByType: `${BASE_URL}/medical-facility-stock/get-stock-by-type`,
  },
  donationEvent: {
    getAll: `${BASE_URL}/api/donation-event/list-donation`,
>>>>>>> 874435d2c0dd0c48c141f345f39be682ed8ef5a5
  }
}

export default axiosInstance;
