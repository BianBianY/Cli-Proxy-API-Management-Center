import { useState, useEffect, useCallback } from 'react';
import { authFilesApi } from '@/services/api';
import { useConfigStore, useAuthStore } from '@/stores';
import type { AuthFileItem, AuthFileType } from '@/types';

interface AccountsStats {
  totalAuthFiles: number;
  totalProviders: number;
  totalEnabled: number;
  totalDisabled: number;
}

interface AccountsData {
  files: AuthFileItem[];
  stats: AccountsStats;
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing accounts data (auth files and providers)
 */
export function useAccountsData(filterType?: AuthFileType | 'all'): AccountsData {
  const connectionStatus = useAuthStore((state) => state.connectionStatus);
  const { config, fetchConfig } = useConfigStore();

  const [files, setFiles] = useState<AuthFileItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from server
  const loadData = useCallback(async () => {
    if (connectionStatus !== 'connected') {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch auth files and config in parallel
      const [filesData] = await Promise.all([
        authFilesApi.list(),
        !config ? fetchConfig(undefined, false) : Promise.resolve()
      ]);

      setFiles(filesData?.files || []);
    } catch (err) {
      console.error('Failed to load accounts data:', err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [connectionStatus, config, fetchConfig]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh function
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Filter files by type
  const filteredFiles = filterType && filterType !== 'all'
    ? files.filter(f => f.type === filterType)
    : files;

  // Calculate statistics
  const stats: AccountsStats = {
    totalAuthFiles: filteredFiles.length,
    totalProviders: 0,
    totalEnabled: 0,
    totalDisabled: 0
  };

  // Count provider configurations
  if (config) {
    stats.totalProviders =
      (config.geminiApiKeys?.length || 0) +
      (config.claudeApiKeys?.length || 0) +
      (config.codexApiKeys?.length || 0);
  }

  // Count enabled/disabled items
  filteredFiles.forEach(file => {
    if (file.disabled) {
      stats.totalDisabled++;
    } else {
      stats.totalEnabled++;
    }
  });

  // Count provider enabled/disabled status
  if (config) {
    const isEnabled = (excludedModels?: string[]) => {
      if (!excludedModels) return true;
      return !excludedModels.includes('all') && !excludedModels.includes('*');
    };

    config.geminiApiKeys?.forEach(item => {
      if (isEnabled(item.excludedModels)) {
        stats.totalEnabled++;
      } else {
        stats.totalDisabled++;
      }
    });

    config.claudeApiKeys?.forEach(item => {
      if (isEnabled(item.excludedModels)) {
        stats.totalEnabled++;
      } else {
        stats.totalDisabled++;
      }
    });

    config.codexApiKeys?.forEach(item => {
      if (isEnabled(item.excludedModels)) {
        stats.totalEnabled++;
      } else {
        stats.totalDisabled++;
      }
    });
  }

  return {
    files: filteredFiles,
    stats,
    loading,
    refresh
  };
}
