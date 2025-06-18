// Real API service for PLANIT application

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "member" | "guest"
  emailVerified?: boolean
  notificationPreferences?: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  lastLogin?: string
  // Profile fields
  bio?: string
  jobTitle?: string
  department?: string
  phone?: string
  location?: string
  website?: string
  timezone?: string
  github?: string
  linkedin?: string
  twitter?: string
  skills?: string[]
  profileCompleted?: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  progress: number
  members: User[]
  owner: User
  workspace: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate?: string
  assignee?: User
  createdBy: User
  project?: string
  workspace: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  title: string
  content: string
  type: "document" | "note" | "template"
  project?: string
  workspace: string
  createdBy: User
  createdAt: string
  updatedAt: string
  starred: boolean
  tags: string[]
}

export interface Workspace {
  id: string
  name: string
  description: string
  type: "personal" | "team" | "organization"
  owner: User
  members: {
    user: User
    role: "admin" | "member" | "guest"
    joinedAt: string
  }[]
  subscription: {
    plan: "free" | "pro" | "enterprise"
    status: "active" | "cancelled" | "past_due"
  }
  createdAt: string
  updatedAt: string
}

// Demo user for quick login
export const DEMO_USER: User = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@planit.app",
  avatar: "/placeholder-user.jpg",
  role: "admin",
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  
  const token = localStorage.getItem("auth_token")
  return token
}

// Helper function to make authenticated requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }))
    console.error("API request failed:", endpoint, error)
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Helper function to upload files with authentication
async function uploadFile(endpoint: string, formData: FormData) {
  const token = getAuthToken()

  const config: RequestInit = {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Demo credentials for backward compatibility
export const DEMO_CREDENTIALS = {
  email: "demo@planit.app",
  password: "demo1234",
}

// Authentication service
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Store token
    if (response.token) {
      localStorage.setItem("auth_token", response.token)
    }

    return response.user
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })

    // Store token
    if (response.token) {
      localStorage.setItem("auth_token", response.token)
    }

    return response.user
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("auth_token")
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiRequest("/auth/me")
      return response
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem("auth_token")
      return null
    }
  },
}

// Projects service
export const projectsService = {
  getProjects: async (workspaceId?: string): Promise<Project[]> => {
    const params = workspaceId ? `?workspace=${workspaceId}` : ""
    return apiRequest(`/projects${params}`)
  },

  getProject: async (id: string): Promise<Project> => {
    return apiRequest(`/projects/${id}`)
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    return apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    return apiRequest(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    })
  },

  deleteProject: async (id: string): Promise<void> => {
    return apiRequest(`/projects/${id}`, {
      method: "DELETE",
    })
  },

  getProjectMembers: async (projectId: string): Promise<User[]> => {
    try {
      const response = await apiRequest(`/projects/${projectId}/members`)
      return response
    } catch (error) {
      console.error("Error fetching project members:", error)
      throw error
    }
  },

  addProjectMember: async (projectId: string, email: string): Promise<User> => {
    try {
      const response = await apiRequest(`/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      return response
    } catch (error) {
      console.error("Error adding project member:", error)
      throw error
    }
  },

  removeProjectMember: async (projectId: string, userId: string): Promise<void> => {
    try {
      await apiRequest(`/projects/${projectId}/members/${userId}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Error removing project member:", error)
      throw error
    }
  },

  getProjectTasks: async (projectId: string): Promise<Task[]> => {
    try {
      const response = await tasksService.getTasks({ project: projectId })
      return response
    } catch (error) {
      console.error("Error fetching project tasks:", error)
      throw error
    }
  },
}

// Tasks service
export const tasksService = {
  getTasks: async (filters?: {
    workspace?: string
    project?: string
    status?: string
    assignee?: string
  }): Promise<Task[]> => {
    try {
      const params = new URLSearchParams()
      if (filters?.workspace) params.append("workspace", filters.workspace)
      if (filters?.project) params.append("project", filters.project)
      if (filters?.status) params.append("status", filters.status)
      if (filters?.assignee) params.append("assignee", filters.assignee)

      const queryString = params.toString()
      const response = await apiRequest(`/tasks${queryString ? `?${queryString}` : ""}`)
      return response
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }
  },

  getTask: async (id: string): Promise<Task> => {
    return apiRequest(`/tasks/${id}`)
  },

  createTask: async (taskData: any): Promise<Task> => {
    try {
      const response = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      })
      return response
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await apiRequest(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      })
      return response
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },
}

// Documents service
export const documentsService = {
  getDocuments: async (filters?: {
    workspace?: string
    project?: string
  }): Promise<Document[]> => {
    const params = new URLSearchParams()
    if (filters?.workspace) params.append("workspace", filters.workspace)
    if (filters?.project) params.append("project", filters.project)

    const queryString = params.toString()
    return apiRequest(`/documents${queryString ? `?${queryString}` : ""}`)
  },

  getDocument: async (id: string): Promise<Document> => {
    return apiRequest(`/documents/${id}`)
  },

  createDocument: async (documentData: Partial<Document>): Promise<Document> => {
    return apiRequest("/documents", {
      method: "POST",
      body: JSON.stringify(documentData),
    })
  },

  updateDocument: async (id: string, documentData: Partial<Document>): Promise<Document> => {
    return apiRequest(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(documentData),
    })
  },

  deleteDocument: async (id: string): Promise<void> => {
    return apiRequest(`/documents/${id}`, {
      method: "DELETE",
    })
  },
}

// Workspaces service
export const workspacesService = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    return apiRequest("/workspaces")
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    return apiRequest(`/workspaces/${id}`)
  },

  createWorkspace: async (workspaceData: Partial<Workspace>): Promise<Workspace> => {
    return apiRequest("/workspaces", {
      method: "POST",
      body: JSON.stringify(workspaceData),
    })
  },

  updateWorkspace: async (id: string, workspaceData: Partial<Workspace>): Promise<Workspace> => {
    return apiRequest(`/workspaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(workspaceData),
    })
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    return apiRequest(`/workspaces/${id}`, {
      method: "DELETE",
    })
  },
}

// AI service
export const aiService = {
  generateResponse: async (message: string, context?: string): Promise<string> => {
    const response = await apiRequest("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    })
    return response.response
  },

  suggestTasks: async (projectId?: string, context?: string): Promise<any[]> => {
    const response = await apiRequest("/ai/task-suggestions", {
      method: "POST",
      body: JSON.stringify({ projectId, context }),
    })
    return response.suggestions
  },
}

// Profile service
export const profileService = {
  getProfile: async (): Promise<User> => {
    return apiRequest("/profile")
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
    return response.user
  },

  updateAvatar: async (avatarUrl: string): Promise<User> => {
    const response = await apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify({ avatar: avatarUrl }),
    })
    return response.user
  },
}

// Upload service
export const uploadService = {
  uploadProfilePhoto: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append("file", file)
    return uploadFile("/upload", formData)
  },
}

const getToken = () => {
  // Replace with your actual token retrieval logic
  return localStorage.getItem("authToken") || "your_default_token"
}
