'use client'

import { getRequestById } from '@/apis/bloodrequest';
import { BASE_URL } from '@/global-config';
import axios from 'axios';

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
        window.location.href = '/login';
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export const endpoint = {
  auth: {
    login: `${BASE_URL}/user/login`,
    register: `${BASE_URL}/user/register`,
    verify: `${BASE_URL}/user/verify`,
    loginGoogle: `${BASE_URL}/oauth2/authorization/google`
  },
  user: {
    profile: `${BASE_URL}/user/info`,
  },
  bloodRequest: {
    getAll: `${BASE_URL}/blood-request/request-list`,
    create: `${BASE_URL}/blood-request/create-request`,
    getById: `${BASE_URL}/blood-request`
  },
  bloodStock: {
    checkStock: `${BASE_URL}/medical-facility-stock/check-stock`,
    addToStock: `${BASE_URL}/medical-facility-stock/add-from-event`,
    withdraw: `${BASE_URL}/medical-facility-stock/withdrawn`,
    getStock: `${BASE_URL}/medical-facility-stock/get-stock`
  }
}

export default axiosInstance;
