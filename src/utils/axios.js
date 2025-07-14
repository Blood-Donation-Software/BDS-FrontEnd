'use client'

import { getRequestById } from '@/apis/bloodrequest';
import { deleteStock } from '@/apis/bloodStock';
import { getAllAccount, updateProfile } from '@/apis/user';
import { AVATAR_URL, BASE_URL } from '@/global-config';
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
    updateProfile: `${BASE_URL}/api/user/profile/update`,
    getProfile: `${BASE_URL}/api/user/profile`,
    getAllProfile: `${BASE_URL}/api/user/profile/list-profile`,
    getAllAccount: `${BASE_URL}/api/user/account/list-account`,
    genAvatar: (name,rounded) => `${AVATAR_URL}/api/?name=${name}&rounded=${rounded}`,
    getAccount: `${BASE_URL}/api/user/account`,
    updateAvatar: (accountId) => `${BASE_URL}/api/user/account/${accountId}/avatar`,
    getDonationHistory: `${BASE_URL}/api/user/profile/history`,
    profile: `${BASE_URL}/api/user/info`,
  },
  profileDistance: {
    getDistance: (profileId) => `${BASE_URL}/api/profile-distances/${profileId}`,
    calculateDistance: (profileId) => `${BASE_URL}/api/profile-distances/calculate/${profileId}`,
    recalculateDistance: (profileId) => `${BASE_URL}/api/profile-distances/recalculate/${profileId}`,
    getWithinDistance: `${BASE_URL}/api/profile-distances/within-distance`,
    getAllOrdered: `${BASE_URL}/api/profile-distances/all-ordered`,
    getProfilesWithinDistance: `${BASE_URL}/api/profile-distances/profiles/within-distance`,
    getProfilesAllOrdered: `${BASE_URL}/api/profile-distances/profiles/all-ordered`,
    calculateMissing: `${BASE_URL}/api/profile-distances/calculate-missing`,
    deleteDistance: (profileId) => `${BASE_URL}/api/profile-distances/${profileId}`,
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
    deleteStock: (id) => `${BASE_URL}/api/medical-facility-stock/${id}`,
  },          
  bloodDonation: {
    createEvent: `${BASE_URL}/api/donation-event-request/create`,
    listEvent: `${BASE_URL}/api/donation-event/list-donation`,
    ongoingEvents: `${BASE_URL}/api/donation-event/list-donation/on-going`,
    approveEvent: (eventId) => `${BASE_URL}/api/donation-event/list-donation`,
    getMyRequests: `${BASE_URL}/api/donation-event-request/my-requests`,
    getPendingRequests: `${BASE_URL}/api/donation-event-request/pending`,
    verifyRequest: (requestId) => `${BASE_URL}/api/donation-event-request/pending/${requestId}/verify`,
    updateEventRequest: (eventId) => `${BASE_URL}/api/donation-event-request/update/${eventId}`,
    deleteEventRequest: (eventId) => `${BASE_URL}/api/donation-event-request/delete/${eventId}`,
    recordDonation: (eventId) => `${BASE_URL}/api/donation-event/list-donation/${eventId}/record-donations`,
  },
  eventRegistration: {
    register: (eventId, timeSlotId) => `${BASE_URL}/api/event-registration/${eventId}/${timeSlotId}/register`,
    registerOffline: (eventId) => `${BASE_URL}/api/event-registration/${eventId}/registerOffline`,
    cancel: (eventId) => `${BASE_URL}/api/event-registration/${eventId}/cancel`,
  },  
  checkin: {
    getToken: (eventId) => `${BASE_URL}/api/checkin/${eventId}/checkin-token`,
    getInfo: (eventId) => `${BASE_URL}/api/checkin/info/${eventId}`,
    checkIn: (eventId) => `${BASE_URL}/api/checkin/action/${eventId}`,
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
  },
  blog: {
    listBlogs: `${BASE_URL}/api/blog/list-blogs`,
    getBlogById: (blogId) => `${BASE_URL}/api/blog/list-blogs/${blogId}`,
    getMyBlogs: `${BASE_URL}/api/blog/my-blogs`,
    getMyBlogById: (blogId) => `${BASE_URL}/api/blog/my-blogs/${blogId}`,
    updateBlog: (blogId) => `${BASE_URL}/api/blog/my-blogs/${blogId}/update`,
    deleteBlog: (blogId) => `${BASE_URL}/api/blog/my-blogs/${blogId}/delete`,
      createBlogRequest: `${BASE_URL}/api/blog-request/create`,
    getPendingRequests: `${BASE_URL}/api/blog-request/pending`,
    getBlogRequestById: (requestId) => `${BASE_URL}/api/blog-request/pending/${requestId}`,
    verifyBlogRequest: (requestId) => `${BASE_URL}/api/blog-request/pending/${requestId}/verify`,
    getMyBlogRequests: `${BASE_URL}/api/blog-request/my-requests`,
    getMyBlogRequestById: (requestId) => `${BASE_URL}/api/blog-request/my-requests/${requestId}`,
  }
}

export default axiosInstance;
