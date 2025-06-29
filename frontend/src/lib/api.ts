import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from Clerk
    const token = window.Clerk?.session?.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  credits: number
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export interface ProcessImageRequest {
  imageUrl: string
  operation: 'remove-background' | 'enhance' | 'upscale'
  prompt?: string
}

export interface GenerateVideoRequest {
  imageUrl: string
  prompt: string
  style: string
  duration: number
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  isAudio?: boolean
}

// API functions
export const userApi = {
  getProfile: () => api.get<User>('/user/profile'),
  updateCredits: (credits: number) => api.patch('/user/credits', { credits }),
}

export const imageApi = {
  processImage: (data: ProcessImageRequest) => 
    api.post('/image/process', data),
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/image/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export const videoApi = {
  generateVideo: (data: GenerateVideoRequest) => 
    api.post('/video/generate', data),
}

export const chatApi = {
  sendMessage: (message: string) => 
    api.post('/chat/message', { message }),
  sendAudioMessage: (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    return api.post('/chat/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}