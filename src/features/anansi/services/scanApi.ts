import api from '../../../core/services/api';

export interface ScanResponse {
  success: boolean;
  data: {
    scanId: string;
    target: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    progress: number;
    riskScore?: number;
    guestScanLimit?: number;
    guestScansRemaining?: number;
    message?: string;
    error?: string | null;
  };
  code?: string;
  error?: string;
}

export interface TlsData {
  protocol: string;
  cipher: string;
  expiryDate: string;
  daysUntilExpiry: number;
  issuerOrg: string;
  subjectCN: string;
  sans: string[];
  expired: boolean;
  expiringSoon: boolean;
  selfSigned: boolean;
}

export interface ScanResult {
  type: string;
  value: string;
  isAlive: boolean;
  resolvedIp?: string;
  metadata?: any;
  tlsData?: TlsData | null;
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
    createdAt: string;
    completedAt: string;
    summary: {
      totalAssets: number;
      liveAssets: number;
      totalVulnerabilities: number;
      severityCounts: Record<string, number>;
      techStack?: string[];
    };
    assets: ScanResult[];
    vulnerabilities: VulnerabilityResult[];
  };
}

const scanApi = {
  startScan: async (target: string): Promise<ScanResponse> => {
    try {
      const response = await api.post('/scan', { target });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 409) {
        return err.response.data;
      }
      throw err;
    }
  },

  getScanStatus: async (scanId: string): Promise<ScanResponse> => {
    const response = await api.get(`/scan/${scanId}`);
    return response.data;
  },

  getScanResults: async (scanId: string): Promise<ScanFullResultsResponse> => {
    const response = await api.get(`/scan/${scanId}/results`);
    return response.data;
  },
};

export default scanApi;
