// Frontend API Client for SecurePulse
class SecurePulseAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Remove token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Generic request method
  async request(endpoint, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ============ AUTHENTICATION ============

  async register(name, email, password) {
    return this.request('/api/auth/register', 'POST', {
      name,
      email,
      password,
    });
  }

  async login(email, password) {
    const response = await this.request('/api/auth/login', 'POST', {
      email,
      password,
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  // ============ USER PROFILE ============

  async getProfile() {
    return this.request('/api/users/profile', 'GET');
  }

  async updateProfile(name, phone, plan) {
    return this.request('/api/users/profile', 'PUT', {
      name,
      phone,
      plan,
    });
  }

  async addEmergencyContact(name, phone, email) {
    return this.request('/api/users/emergency-contacts', 'POST', {
      name,
      phone,
      email,
    });
  }

  // ============ BRACELETS ============

  async registerBracelet(deviceId, nickname) {
    return this.request('/api/bracelets', 'POST', {
      deviceId,
      nickname,
    });
  }

  async getBracelets() {
    return this.request('/api/bracelets', 'GET');
  }

  async updateBracelet(braceletId, status, battery, nickname) {
    return this.request(`/api/bracelets/${braceletId}`, 'PUT', {
      status,
      battery,
      nickname,
    });
  }

  // ============ HEALTH DATA ============

  async submitHealthData(braceletId, heartRate, bloodOxygen, temperature, steps) {
    return this.request('/api/health-data', 'POST', {
      braceletId,
      heartRate,
      bloodOxygen,
      temperature,
      steps,
    });
  }

  async getHealthData(braceletId) {
    return this.request(`/api/health-data/${braceletId}`, 'GET');
  }

  // ============ EMERGENCY ALERTS ============

  async createEmergencyAlert(braceletId, alertType, description, latitude, longitude) {
    return this.request('/api/emergency-alerts', 'POST', {
      braceletId,
      alertType,
      description,
      latitude,
      longitude,
    });
  }

  async getEmergencyAlerts() {
    return this.request('/api/emergency-alerts', 'GET');
  }

  async updateAlertStatus(alertId, status) {
    return this.request(`/api/emergency-alerts/${alertId}`, 'PUT', {
      status,
      respondedAt: new Date(),
    });
  }

  // ============ HEALTH CHECK ============

  async checkServerHealth() {
    return this.request('/api/health', 'GET');
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurePulseAPI;
}
