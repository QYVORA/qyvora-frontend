import axios from 'axios';

const API_BASE_URL = '/api';

export interface ScanResponse {
  success: boolean;
  data: {
    scanId: string;
    target: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    progress: number;
    riskScore?: number;
    message?: string;
    error?: string | null;
  };
}

export interface ScanResult {
  type: string;
  value: string;
  isAlive: boolean;
  resolvedIp?: string;
  metadata?: any;
}

export interface VulnerabilityResult {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  affectedAsset: string;
  evidence?: string;
  remediation?: string;
}

export interface ScanFullResultsResponse {
  success: boolean;
  data: {
    scanId: string;
    target: string;
    riskScore: number;
    completedAt: string;
    summary: {
      totalAssets: number;
      liveAssets: number;
      totalVulnerabilities: number;
      severityCounts: Record<string, number>;
    };
    assets: ScanResult[];
    vulnerabilities: VulnerabilityResult[];
  };
}

const scanApi = {
  startScan: async (target: string): Promise<ScanResponse> => {
    const response = await axios.post(`${API_BASE_URL}/scan`, { target });
    return response.data;
  },

  getScanStatus: async (scanId: string): Promise<ScanResponse> => {
    const response = await axios.get(`${API_BASE_URL}/scan/${scanId}`);
    return response.data;
  },

  getScanResults: async (scanId: string): Promise<ScanFullResultsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/scan/${scanId}/results`);
    return response.data;
  },
};

export default scanApi;
