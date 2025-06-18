import { cache, CACHE_KEYS, CACHE_TTL } from './cache'

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>()

interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

class OptimizedApiService {
  private baseUrl = '/api'

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true,
    cacheKey?: string,
    ttl = CACHE_TTL.MEDIUM
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const requestKey = `${options.method || 'GET'}:${url}`

    // Check cache first
    if (useCache && cacheKey) {
      const cached = cache.get<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Check for pending request
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey)!
    }

    // Make the request
    const requestPromise = fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: ApiResponse<T>) => {
        if (!data.success) {
          throw new Error(data.error || 'Request failed')
        }
        return data.data
      })
      .then((data) => {
        // Cache the result
        if (useCache && cacheKey) {
          cache.set(cacheKey, data, ttl)
        }
        return data
      })
      .finally(() => {
        // Remove from pending requests
        pendingRequests.delete(requestKey)
      })

    pendingRequests.set(requestKey, requestPromise)
    return requestPromise
  }

  // Tasks API
  async getTasks() {
    return this.request('/tasks', {}, true, CACHE_KEYS.TASKS, CACHE_TTL.SHORT)
  }

  async createTask(taskData: any) {
    const result = await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }, false)
    
    // Invalidate cache
    cache.delete(CACHE_KEYS.TASKS)
    return result
  }

  async updateTask(id: string, taskData: any) {
    const result = await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }, false)
    
    // Invalidate cache
    cache.delete(CACHE_KEYS.TASKS)
    return result
  }

  async deleteTask(id: string) {
    const result = await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    }, false)
    
    // Invalidate cache
    cache.delete(CACHE_KEYS.TASKS)
    return result
  }

  // Documents API
  async getDocuments() {
    return this.request('/documents', {}, true, CACHE_KEYS.DOCUMENTS, CACHE_TTL.MEDIUM)
  }

  async createDocument(documentData: any) {
    const result = await this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    }, false)
    
    cache.delete(CACHE_KEYS.DOCUMENTS)
    return result
  }

  async updateDocument(id: string, documentData: any) {
    const result = await this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    }, false)
    
    cache.delete(CACHE_KEYS.DOCUMENTS)
    return result
  }

  async deleteDocument(id: string) {
    const result = await this.request(`/documents/${id}`, {
      method: 'DELETE',
    }, false)
    
    cache.delete(CACHE_KEYS.DOCUMENTS)
    return result
  }

  // Projects API
  async getProjects() {
    return this.request('/projects', {}, true, CACHE_KEYS.PROJECTS, CACHE_TTL.MEDIUM)
  }

  async createProject(projectData: any) {
    const result = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }, false)
    
    cache.delete(CACHE_KEYS.PROJECTS)
    return result
  }

  async updateProject(id: string, projectData: any) {
    const result = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }, false)
    
    cache.delete(CACHE_KEYS.PROJECTS)
    return result
  }

  async deleteProject(id: string) {
    const result = await this.request(`/projects/${id}`, {
      method: 'DELETE',
    }, false)
    
    cache.delete(CACHE_KEYS.PROJECTS)
    return result
  }

  // Workspaces API
  async getWorkspaces() {
    return this.request('/workspaces', {}, true, CACHE_KEYS.WORKSPACES, CACHE_TTL.LONG)
  }

  async createWorkspace(workspaceData: any) {
    const result = await this.request('/workspaces', {
      method: 'POST',
      body: JSON.stringify(workspaceData),
    }, false)
    
    cache.delete(CACHE_KEYS.WORKSPACES)
    return result
  }

  async updateWorkspace(id: string, workspaceData: any) {
    const result = await this.request(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workspaceData),
    }, false)
    
    cache.delete(CACHE_KEYS.WORKSPACES)
    return result
  }

  async deleteWorkspace(id: string) {
    const result = await this.request(`/workspaces/${id}`, {
      method: 'DELETE',
    }, false)
    
    cache.delete(CACHE_KEYS.WORKSPACES)
    return result
  }

  // Clear all cache
  clearCache() {
    cache.clear()
  }

  // Preload critical data
  async preloadData() {
    const promises = [
      this.getTasks(),
      this.getDocuments(),
      this.getProjects(),
      this.getWorkspaces(),
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Preload failed:', error)
    }
  }
}

export const optimizedApiService = new OptimizedApiService() 