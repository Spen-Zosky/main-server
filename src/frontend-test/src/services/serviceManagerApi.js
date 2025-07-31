// Service Manager API Client
// Handles all file system operations for the Service Manager

import axios from 'axios';

// Use direct connection with improved CORS support
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10s to 30s
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Directory paths configuration
export const DIRECTORY_PATHS = {
  // Development & Source
  'src': '/home/ubuntu/main-server/src/',
  'tests': '/home/ubuntu/main-server/tests/',
  'scripts': '/home/ubuntu/main-server/scripts/',
  'docs': '/home/ubuntu/main-server/docs/',
  
  // Backups & Archives
  'backups': '/home/ubuntu/main-server/backups/',
  'development-snapshots': '/home/ubuntu/main-server/development-snapshots/',
  'rollback-history': '/home/ubuntu/main-server/rollback-history/',
  'stage-snapshots': '/home/ubuntu/main-server/STAGE_SNAPSHOTS/',
  
  // Logs & Monitoring  
  'development-logs': '/home/ubuntu/main-server/development-logs/',
  'logs': '/home/ubuntu/main-server/logs/',
  
  // Configuration
  'config': '/home/ubuntu/main-server/config/',
  'legacy-files': '/home/ubuntu/main-server/legacy-files/',
  
  // Session & Engagement
  'engagement': '/home/ubuntu/main-server/.engagement/',
  'session': '/home/ubuntu/main-server/src/session/',
  
  // Utilities
  'utils': '/home/ubuntu/main-server/src/utils/',
  'services': '/home/ubuntu/main-server/src/services/',
  'models': '/home/ubuntu/main-server/src/models/',
  'controllers': '/home/ubuntu/main-server/src/controllers/',
  'routes': '/home/ubuntu/main-server/src/routes/',
  'middleware': '/home/ubuntu/main-server/src/middleware/'
};

// Retry utility function
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// File system operations
export const serviceManagerApi = {
  // Get directory contents
  async getDirectoryContents(directoryType) {
    try {
      const response = await retryRequest(
        () => apiClient.get(`/service-manager/directories/${directoryType}`),
        3, // Max 3 retries
        500 // Start with 500ms delay
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting directory contents:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        details: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          timeout: error.code === 'ECONNABORTED',
          network: error.code === 'ERR_NETWORK'
        }
      };
    }
  },

  // Get file metadata
  async getFileMetadata(directoryType, fileName) {
    try {
      const response = await apiClient.get(`/service-manager/files/${directoryType}/${encodeURIComponent(fileName)}/metadata`);
      return response.data;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Download file
  async downloadFile(directoryType, fileName) {
    try {
      // Create download link
      const downloadUrl = `${API_BASE_URL}/service-manager/files/download?type=${encodeURIComponent(directoryType)}&filename=${encodeURIComponent(fileName)}`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete file
  async deleteFile(directoryType, fileName) {
    try {
      const response = await apiClient.delete('/service-manager/files/delete', {
        data: { 
          type: directoryType,
          filename: fileName
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Search files
  async searchFiles(directoryType, query) {
    try {
      const response = await apiClient.get(`/service-manager/search/${directoryType}?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching files:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Preview file content
  async previewFile(directoryType, fileName) {
    try {
      const response = await apiClient.get(`/service-manager/files/${directoryType}/${encodeURIComponent(fileName)}/preview`);
      return response.data;
    } catch (error) {
      console.error('Error previewing file:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Bulk operations
  async bulkDelete(directoryType, fileNames) {
    try {
      const files = fileNames.map(filename => ({
        type: directoryType,
        filename: filename
      }));
      
      const response = await apiClient.delete('/service-manager/files/bulk-delete', {
        data: { files }
      });
      return response.data;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  async bulkDownload(directoryType, fileNames) {
    try {
      // Create a zip archive and download it
      const downloadUrl = `${API_BASE_URL}/service-manager/files/bulk-download`;
      
      const response = await fetch(downloadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: fileNames.map(filename => ({
            type: directoryType,
            filename: filename
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create bulk download');
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${directoryType}_files_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error in bulk download:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Helper functions for file system operations
async function scanDirectoryContents(directoryPath) {
  // This will be replaced with actual file system scanning
  // For now, return data based on dummy.txt analysis
  
  const directoryName = directoryPath.split('/').slice(-2, -1)[0];
  
  switch (directoryName) {
    case 'backups':
      return [
        {
          id: 'backup_2025-07-21_01-20-15',
          name: 'backup_2025-07-21_01-20-15.tar.gz',
          size: 371387,
          sizeFormatted: '371,387 bytes (362KB)',
          type: 'archive',
          timestamp: '2025-07-21T01:20:15.000Z',
          status: 'baseline',
          description: 'Initial project setup backup - baseline configuration',
          metadata: {
            phase: 'Baseline Setup',
            content: 'Core project structure, dependencies, initial frontend setup',
            compressionRatio: 'High',
            includes: ['src/', 'package*.json', 'CLAUDE.md'],
            excludes: ['node_modules', '.git', 'dist']
          }
        },
        {
          id: 'backup_20250721_13_11_30',
          name: 'backup_20250721_13_11_30.tar.gz',
          size: 397769,
          sizeFormatted: '397,769 bytes (388KB)',
          type: 'archive',
          timestamp: '2025-07-21T13:11:30.000Z',
          status: 'stable',
          description: 'Context persistence system development backup',
          metadata: {
            phase: 'Context System Dev',
            content: 'Enhanced project with context management utilities',
            compressionRatio: 'High',
            includes: ['src/', 'package*.json', 'CLAUDE.md', '.engagement/'],
            excludes: ['node_modules', '.git', 'dist']
          }
        },
        {
          id: 'chat_log_2025-07-21_01-20-15',
          name: 'chat_log_2025-07-21_01-20-15.txt',
          size: 12543,
          sizeFormatted: '12,543 bytes (~34 lines)',
          type: 'chat-log',
          timestamp: '2025-07-21T01:20:15.000Z',
          status: 'completed',
          description: 'Initial project setup session transcript',
          metadata: {
            phase: 'Baseline Setup',
            content: 'Baseline implementation, frontend development, enterprise GUI',
            lines: 34,
            topics: ['Project Setup', 'Frontend Development', 'Enterprise GUI']
          }
        },
        {
          id: 'backup_20250722_19_53_56',
          name: 'backup_20250722_19_53_56.tar.gz',
          size: 80066066,
          sizeFormatted: '80,066,066 bytes (76.3MB)',
          type: 'archive',
          timestamp: '2025-07-22T19:53:56.000Z',
          status: 'latest',
          description: 'Latest session backup with Storybook cleanup',
          metadata: {
            phase: 'Tabula Rasa Complete',
            content: 'Clean landing page baseline after Storybook removal',
            compressionRatio: 'High',
            includes: ['src/', 'package*.json', 'CLAUDE.md', '*.md'],
            excludes: ['node_modules', '.git', 'dist', '*.log', 'backup_*']
          }
        }
      ];
      
    case 'development-logs':
      return []; // Empty as per dummy.txt
      
    case 'development-snapshots':
      return [
        {
          id: 'minimal_content_01',
          name: 'config_snapshot.json',
          size: 8192,
          sizeFormatted: '8,192 bytes (8KB)',
          type: 'config',
          timestamp: '2025-07-21T12:00:00.000Z',
          status: 'active',
          description: 'Configuration snapshot with minimal content',
          metadata: {
            phase: 'Development',
            content: 'Configuration files and small assets',
            format: 'JSON',
            configType: 'Application Configuration'
          }
        }
      ];
      
    case 'rollback-history':
      return []; // Empty as per dummy.txt
      
    case 'STAGE_SNAPSHOTS':
      return []; // Empty as per dummy.txt
      
    default:
      return [];
  }
}

async function extractFileMetadata(filePath, fileName) {
  // Extract detailed metadata for a specific file
  // This would normally involve file system operations
  
  const fileExtension = fileName.split('.').pop();
  const fileStats = {
    path: filePath,
    name: fileName,
    extension: fileExtension,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    accessed: new Date().toISOString()
  };

  // Add specific metadata based on file type
  if (fileExtension === 'gz' && fileName.includes('tar')) {
    return {
      ...fileStats,
      archiveType: 'tar.gz',
      compression: 'gzip',
      canExtract: true,
      estimatedFiles: '50-100 files',
      compressionRatio: '85%'
    };
  } else if (fileExtension === 'txt' && fileName.includes('chat_log')) {
    return {
      ...fileStats,
      logType: 'chat-session',
      encoding: 'UTF-8',
      estimatedLines: '30-50 lines',
      topics: ['Development', 'Problem Solving', 'Implementation']
    };
  } else {
    return fileStats;
  }
}

function calculateTotalSize(files) {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}

// Test function for debugging (available in console)
window.testServiceManager = async (directoryType = 'backups') => {
  try {
    const result = await serviceManagerApi.getDirectoryContents(directoryType);
    console.log('Service Manager test result:', result);
    return result;
  } catch (error) {
    console.error('Service Manager test failed:', error);
    return error;
  }
};

// Network diagnostic function
window.diagnoseNetwork = async () => {
  const tests = [
    { name: 'Backend Health', url: 'http://localhost:3001/health' },
    { name: 'CORS Preflight', url: 'http://localhost:3001/api/v1/directories/backups', options: { method: 'OPTIONS' } },
    { name: 'Direct API Call', url: 'http://localhost:3001/api/v1/directories/backups' },
    { name: 'Proxy API Call', url: '/api/v1/directories/backups' },
  ];
  
  console.log('🔍 Starting network diagnostics...');
  
  for (const test of tests) {
    try {
      console.log(`🧪 ${test.name}...`);
      const response = await fetch(test.url, { 
        ...test.options,
        mode: 'cors',
        timeout: 10000
      });
      console.log(`✅ ${test.name}: HTTP ${response.status}`);
    } catch (error) {
      console.error(`❌ ${test.name}: ${error.message}`);
    }
  }
};

export default serviceManagerApi;