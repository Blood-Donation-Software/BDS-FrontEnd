'use client'

import { getRequestById } from '@/apis/bloodrequest';
import { getAllAccount } from '@/apis/user';
import { BASE_URL } from '@/global-config';
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
    profile: `${BASE_URL}/api/user/profile`,
    getAllProfile: `${BASE_URL}/api/user/profile/list-profile`,
    getAllAccount: `${BASE_URL}/api/user/account/list-account`,
  },
  bloodRequest: {
    getAll: `${BASE_URL}/api/blood-request/request-list`,
    create: `${BASE_URL}/api/blood-request/create-request`,
    getById: `${BASE_URL}/api/blood-request`,
    addDonor: `${BASE_URL}/api/blood-request/add-donor`,
    fulfillRequest: `${BASE_URL}/api/blood-request/fulfill-request`
  },
  bloodStock: {
    checkStock: `${BASE_URL}/api/medical-facility-stock/check-stock`,
    addToStock: `${BASE_URL}/api/medical-facility-stock/add-from-event`,
    withdraw: `${BASE_URL}/api/medical-facility-stock/withdrawn`,
    getStock: `${BASE_URL}/api/medical-facility-stock/get-stock`,
    getStockByType: `${BASE_URL}/api/medical-facility-stock/get-stock-by-type`,
    addStock: `${BASE_URL}/api/medical-facility-stock/add-blood-into-stock`,
  },
  bloodDonation: {
    createEvent: `${BASE_URL}/api/donation-event/create`,
    listEvent: `${BASE_URL}/api/donation-event/list-donation`,
    approveEvent: (eventId) => `${BASE_URL}/api/donation-event/list-donation`,
  }
}

export default axiosInstance;
