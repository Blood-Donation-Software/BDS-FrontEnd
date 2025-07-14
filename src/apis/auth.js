import axiosInstance, { endpoint } from "@/utils/axios"
import axios from "axios";

export const login = ({ email, password }) => {
  return axiosInstance.post(
    endpoint.auth.login,
    { email, password },
  ).then(res => res.data);
};

export const loginGoogle = () => {
  window.location.href = `${endpoint.auth.loginGoogle}`;
};

export const register = (account, name) => {
  return axiosInstance.post(
    endpoint.auth.register,
    account,
    { params: { name } }
  ).then(res => res.data);
};

export const verifyOtp = (otp) => {
  return axiosInstance.post(endpoint.auth.verify, null, {
    params: {
      "verificationCode": otp,
    }
  }).then(res => res.data);
}

export const resendOtp = (email) => {
  return axiosInstance.post(
    endpoint.auth.resendVerification,
    null,
    { params: { email } }
  ).then(res => res.data);
}

export const logout = () => {
  return axiosInstance.get('/api/auth/logout');
}

export const forgotPassword = (email) => {
  return axiosInstance.post(
    '/api/auth/forgot-password',
    null,
    { params: { email } }
  ).then(res => res.data);
}