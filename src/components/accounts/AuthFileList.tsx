import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authFilesApi } from '@/services/api';
import { useNotificationStore, useAuthStore } from '@/stores';
import type { AuthFileItem, AuthFileType } from '@/types';
import { formatFileSize } from '@/utils/format';
import styles from './Accounts.module.scss';

interface AuthFileListProps {
  filterType?: AuthFileType | 'all';
}

export function AuthFileList({ filterType = 'all' }: AuthFileListProps) {
  const { t } = useTranslation();
  const { showNotification } = useNotificationStore();
  const connectionStatus = useAuthStore((state) => state.connectionStatus);
  const [files, setFiles] = useState<AuthFileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = useCallback(async () => {
    if (connectionStatus !== 'connected') return;
    setLoading(true);
    try {
      const data = await authFilesApi.list();
      setFiles(data?.files || []);
    } catch {
      showNotification(t('notification.refresh_failed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [connectionStatus, t, showNotification]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleToggle = async (item: AuthFileItem, disabled: boolean) => {
    try {
      await authFilesApi.updateStatus(item.name, disabled);
      setFiles((prev) =>
        prev.map((f) => (f.name === item.name ? { ...f, disabled } : f))
      );
      showNotification(
        t('auth_files.status_update_success', {
          status: disabled ? t('auth_files.status_disabled') : t('auth_files.status_enabled'),
        }),
        'success'
      );
    } catch {
      showNotification(t('auth_files.status_update_failed'), 'error');
    }
  };

  if (loading) {
    return (
      <Card title={t('accounts.auth_files_title', { defaultValue: '认证文件' })}>
        <div className={styles.loadingCenter}>
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  // Get type badge class name
  const getTypeBadgeClass = (type?: string) => {
    if (!type) return styles.unknown;
    const typeKey = type.replace('-', '');
    return styles[typeKey] || styles.unknown;
  };

  // Filter files by type
  const filteredFiles = filterType === 'all'
    ? files
    : files.filter(f => f.type === filterType);

  return (
    <Card
      title={t('accounts.auth_files_title', { defaultValue: '认证文件' })}
      extra={<button className={styles.refreshBtn} onClick={loadFiles}>{t('common.refresh')}</button>}
    >
      <div className={styles.listContainer}>
        {filteredFiles.length === 0 ? (
          <div className={styles.emptyText}>
            {files.length === 0
              ? t('auth_files.empty_title')
              : t('auth_files.search_empty_title', { defaultValue: '没有匹配的配置文件' })}
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div key={file.name} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>
                  {file.name}
                  {file.type && (
                    <span className={`${styles.typeBadge} ${getTypeBadgeClass(file.type)}`}>
                      {file.type}
                    </span>
                  )}
                  {file.runtimeOnly && (
                    <span className={styles.runtimeBadge}>
                      {t('accounts.auth_file.runtime_only', { defaultValue: '运行时' })}
                    </span>
                  )}
                </div>
                <div className={styles.itemMeta}>
                  {file.provider && <span>{t('accounts.auth_file.provider', { defaultValue: '提供商' })}: {file.provider}</span>}
                  {file.size && <span> • {formatFileSize(file.size)}</span>}
                </div>
                {(file.authIndex !== undefined && file.authIndex !== null) && (
                  <div className={styles.itemDetails}>
                    <div className={styles.itemDetailRow}>
                      <strong>{t('accounts.auth_file.auth_index', { defaultValue: '认证索引' })}:</strong>
                      <span>{file.authIndex}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.itemAction}>
                <ToggleSwitch
                  checked={!file.disabled}
                  onChange={(checked) => handleToggle(file, !checked)}
                  disabled={connectionStatus !== 'connected'}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
