import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authFilesApi } from '@/services/api';
import { useNotificationStore, useAuthStore } from '@/stores';
import type { AuthFileItem } from '@/types';
import { formatFileSize } from '@/utils/format';
import styles from './Accounts.module.scss';

export function AuthFileList() {
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
    } catch (err: any) {
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
    } catch (err: any) {
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

  return (
    <Card
      title={t('accounts.auth_files_title', { defaultValue: '认证文件' })}
      extra={<button className={styles.refreshBtn} onClick={loadFiles}>{t('common.refresh')}</button>}
    >
      <div className={styles.listContainer}>
        {files.length === 0 ? (
          <div className={styles.emptyText}>{t('auth_files.empty_title')}</div>
        ) : (
          files.map((file) => (
            <div key={file.name} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{file.name}</div>
                <div className={styles.itemMeta}>
                  <span>{file.type || 'unknown'}</span>
                  {file.size && <span> • {formatFileSize(file.size)}</span>}
                </div>
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
