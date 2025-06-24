import axiosInstance, { endpoint } from "@/utils/axios"

export const getAllBlogs = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
  const params = { page, size, sortBy, ascending }
  return axiosInstance.get(endpoint.blog.listBlogs, { params })
    .then(res => res.data)
}

// Get blog details by ID (public)
export const getBlogById = (blogId) => {
  return axiosInstance.get(endpoint.blog.getBlogById(blogId))
    .then(res => res.data)
}

// Get my blogs (authenticated user)
export const getMyBlogs = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
  const params = { pageNumber: page, pageSize: size, sortBy, ascending }
  return axiosInstance.get(endpoint.blog.getMyBlogs, { params })
    .then(res => res.data)
}

// Get my blog details by ID (authenticated user)
export const getMyBlogById = (blogId) => {
  return axiosInstance.get(endpoint.blog.getMyBlogById(blogId))
    .then(res => res.data)
}

// Create blog request
export const createBlogRequest = (blogData, thumbnail) => {
  const formData = new FormData()
  
  // Create blog object without thumbnail for JSON part
  const blogDto = {
    title: blogData.title,
    content: blogData.content,
    status: blogData.status?.toUpperCase() === 'PUBLISHED' ? 'ACTIVE' : 'INACTIVE'
  }
  
  // Add blog data as JSON part
  formData.append('blog', new Blob([JSON.stringify(blogDto)], {
    type: 'application/json'
  }))
  
  // Add thumbnail file
  if (thumbnail) {
    formData.append('thumbnail', thumbnail)
  }
  
  return axiosInstance.post(endpoint.blog.createBlogRequest, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data)
}

// Update blog
export const updateBlog = (blogId, blogData, thumbnail) => {
  const formData = new FormData()
  
  const blogDto = {
    title: blogData.title,
    content: blogData.content,
    status: blogData.status?.toUpperCase() === 'PUBLISHED' ? 'ACTIVE' : 'INACTIVE'
  }
  
  formData.append('blog', new Blob([JSON.stringify(blogDto)], {
    type: 'application/json'
  }))
  
  if (thumbnail) {
    formData.append('thumbnail', thumbnail)
  }
  
  return axiosInstance.put(endpoint.blog.updateBlog(blogId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data)
}

// Delete blog
export const deleteBlog = (blogId) => {
  return axiosInstance.post(endpoint.blog.deleteBlog(blogId))
    .then(res => res.data)
}

// Get pending blog requests (admin only)
export const getPendingBlogRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
  const params = { pageNumber: page, pageSize: size, sortBy, ascending }
  return axiosInstance.get(endpoint.blog.getPendingRequests, { params })
    .then(res => res.data)
}

// Get blog request details by ID (admin only)
export const getBlogRequestById = (requestId) => {
  return axiosInstance.get(endpoint.blog.getBlogRequestById(requestId))
    .then(res => res.data)
}

// Verify blog request (approve or reject) (admin only)
export const verifyBlogRequest = (requestId, action) => {
  const params = { action }
  return axiosInstance.put(endpoint.blog.verifyBlogRequest(requestId), null, { params })
    .then(res => res.data)
}

// Approve blog request (admin only)
export const approveBlogRequest = (requestId) => {
  return verifyBlogRequest(requestId, 'APPROVE')
}

// Reject blog request (admin only)
export const rejectBlogRequest = (requestId) => {
  return verifyBlogRequest(requestId, 'REJECT')
}

// Get my blog requests (authenticated user)
export const getMyBlogRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
  const params = { pageNumber: page, pageSize: size, sortBy, ascending }
  return axiosInstance.get(endpoint.blog.getMyBlogRequests, { params })
    .then(res => res.data)
}

// Get my blog request details by ID (authenticated user)
export const getMyBlogRequestById = (requestId) => {
  return axiosInstance.get(endpoint.blog.getMyBlogRequestById(requestId))
    .then(res => res.data)
}
