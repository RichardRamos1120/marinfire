interface CrewSenseConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ScheduleShift {
  id: number;
  href: string;
  start: string;
  end: string;
  length: number;
  user: {
    id: number;
    href: string;
    name: string;
    ts_userid?: number;
  };
  scheduled_by: {
    id: number;
    href: string;
    name: string;
    ts_userid?: number;
  };
  work_type: {
    id: number;
    href: string;
    name: string;
    work_code: string;
    color: string;
    text_color: string;
  };
  notes?: string;
  labels: any[];
  qualifiers: Array<{
    id: number;
    href: string;
    shortcode: string;
    name: string;
    color: string;
    text_color: string;
  }>;
  groups: Array<{
    id: number;
    label: string;
  }>;
}

interface Assignment {
  id: number;
  href: string;
  date: string;
  start: string;
  end: string;
  name: string;
  qualifiers_needed: Array<{
    id: number;
    name: string;
    shortcode: string;
    color: string;
    text_color: string;
    minimum_staffing: number;
  }>;
  minimum_staffing: number;
  is_finalized: boolean;
  notes?: string;
  shifts: ScheduleShift[];
}

interface ScheduleResponse {
  start: string;
  end: string;
  days: {
    [date: string]: {
      assignments: Assignment[];
      time_off?: any[];
      callbacks?: any[];
      trades?: any[];
      misc?: any[];
      notes?: string;
      activities?: string;
      day_color?: {
        color: string;
        label: string;
      };
    };
  };
}

class CrewSenseService {
  private config: CrewSenseConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.config = {
      clientId: process.env.REACT_APP_CREWSENSE_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_CREWSENSE_CLIENT_SECRET || '',
      baseUrl: process.env.REACT_APP_CREWSENSE_BASE_URL || 'https://api.crewsense.com'
    };

    // Validate that required environment variables are present
    if (!this.config.clientId || !this.config.clientSecret) {
      console.error('CrewSense API credentials are missing from environment variables');
      throw new Error('CrewSense API configuration is incomplete');
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Request new token
    const formData = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials'
    });

    try {
      const response = await fetch(`${this.config.baseUrl}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OAuth failed: ${response.status} ${response.statusText}`);
      }

      const data: TokenResponse = await response.json();
      
      this.accessToken = data.access_token;
      // Set expiry 5 minutes before actual expiry for safety
      this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Authentication failed');
    }
  }

  private async makeAuthenticatedRequest<T>(endpoint: string, options?: RequestInit & { retrying?: boolean }): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, clear token and retry once
      if (response.status === 401 && !options?.retrying) {
        this.accessToken = null;
        this.tokenExpiry = null;
        return this.makeAuthenticatedRequest(endpoint, {
          ...options,
          retrying: true
        });
      }
      
      // Log error details for debugging
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('API Error Details:', errorData);
        if (errorData.message || errorData.error) {
          errorMessage += ` - ${errorData.message || errorData.error}`;
        }
      } catch (e) {
        // Response might not be JSON
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Remove these methods as we're using the schedule endpoint instead
  // The /v1/schedule endpoint provides all the shift information we need

  async getSchedule(params?: {
    start?: string;
    end?: string;
    user_id?: string;
  }): Promise<ScheduleResponse> {
    const queryParams = new URLSearchParams();
    if (params?.start) queryParams.append('start', params.start);
    if (params?.end) queryParams.append('end', params.end);
    if (params?.user_id) queryParams.append('user_id', params.user_id);

    const query = queryParams.toString();
    const endpoint = `/v1/schedule${query ? `?${query}` : ''}`;
    
    return this.makeAuthenticatedRequest<ScheduleResponse>(endpoint);
  }

  async getUsers(): Promise<any[]> {
    return this.makeAuthenticatedRequest<any[]>('/v1/users');
  }

  async getWorkTypes(): Promise<any[]> {
    return this.makeAuthenticatedRequest<any[]>('/v1/work_types');
  }
}

export default new CrewSenseService();
export type { ScheduleShift, Assignment, ScheduleResponse };