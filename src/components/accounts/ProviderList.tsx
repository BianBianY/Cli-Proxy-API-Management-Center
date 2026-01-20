import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { providersApi } from '@/services/api';
import { useNotificationStore, useAuthStore, useConfigStore } from '@/stores';
import styles from './Accounts.module.scss';
import { withDisableAllModelsRule, withoutDisableAllModelsRule } from '../providers/utils';

export function ProviderList() {
  const { t } = useTranslation();
  const { showNotification } = useNotificationStore();
  const connectionStatus = useAuthStore((state) => state.connectionStatus);
  const { config, fetchConfig, updateConfigValue, clearCache } = useConfigStore();

  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (connectionStatus !== 'connected') return;
    setLoading(true);
    try {
      await fetchConfig(undefined, true);
    } catch {
      showNotification(t('notification.refresh_failed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [connectionStatus, fetchConfig, t, showNotification]);

  useEffect(() => {
    if (!config) {
      loadData();
    }
  }, [config, loadData]);

  const handleToggle = async (type: string, index: number, enabled: boolean) => {
    try {
      if (type === 'gemini') {
        const current = config?.geminiApiKeys?.[index];
        if (!current) return;
        const nextExcluded = enabled
          ? withoutDisableAllModelsRule(current.excludedModels)
          : withDisableAllModelsRule(current.excludedModels);
        const nextList = config!.geminiApiKeys!.map((item, idx) =>
          idx === index ? { ...item, excludedModels: nextExcluded } : item
        );
        await providersApi.saveGeminiKeys(nextList);
        updateConfigValue('gemini-api-key', nextList);
        clearCache('gemini-api-key');
      } else if (type === 'claude' || type === 'codex') {
        const source = type === 'claude' ? config?.claudeApiKeys : config?.codexApiKeys;
        const current = source?.[index];
        if (!current) return;
        const nextExcluded = enabled
          ? withoutDisableAllModelsRule(current.excludedModels)
          : withDisableAllModelsRule(current.excludedModels);
        const nextList = source!.map((item, idx) =>
          idx === index ? { ...item, excludedModels: nextExcluded } : item
        );
        if (type === 'claude') {
          await providersApi.saveClaudeConfigs(nextList);
          updateConfigValue('claude-api-key', nextList);
          clearCache('claude-api-key');
        } else {
          await providersApi.saveCodexConfigs(nextList);
          updateConfigValue('codex-api-key', nextList);
          clearCache('codex-api-key');
        }
      }
      showNotification(t('notification.config_enabled'), 'success');
    } catch {
      showNotification(t('notification.update_failed'), 'error');
    }
  };

  const isEnabled = (excludedModels?: string[]) => {
    if (!excludedModels) return true;
    return !excludedModels.includes('all') && !excludedModels.includes('*');
  };

  if (loading && !config) {
    return (
      <Card title={t('accounts.providers_title', { defaultValue: 'API 服务商' })}>
        <div className={styles.loadingCenter}>
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  const sections = [
    { title: 'Gemini', type: 'gemini', data: config?.geminiApiKeys || [] },
    { title: 'Claude', type: 'claude', data: config?.claudeApiKeys || [] },
    { title: 'Codex', type: 'codex', data: config?.codexApiKeys || [] },
  ];

  // Render provider meta information
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProviderMeta = (item: any, type: string) => {
    const metaItems = [];

    if (item.prefix) {
      metaItems.push(
        <span key="prefix">
          {t('accounts.provider.prefix', { defaultValue: '前缀' })}: {item.prefix}
        </span>
      );
    }

    if (item.proxyUrl && (type === 'claude' || type === 'codex')) {
      metaItems.push(
        <span key="proxy">
          {t('accounts.provider.proxy_url', { defaultValue: '代理' })}: {item.proxyUrl}
        </span>
      );
    }

    if (item.models && item.models.length > 0) {
      metaItems.push(
        <span key="models">
          {t('accounts.provider.models_count', { defaultValue: '模型别名' })}: {item.models.length}
        </span>
      );
    }

    if (item.excludedModels && item.excludedModels.length > 0) {
      metaItems.push(
        <span key="excluded">
          {t('accounts.provider.excluded_count', { defaultValue: '排除模型' })}: {item.excludedModels.length}
        </span>
      );
    }

    if (item.headers && Object.keys(item.headers).length > 0) {
      metaItems.push(
        <span key="headers">
          {t('accounts.provider.headers_count', { defaultValue: '自定义头' })}: {Object.keys(item.headers).length}
        </span>
      );
    }

    return metaItems;
  };

  return (
    <Card
      title={t('accounts.providers_title', { defaultValue: 'API 服务商' })}
      extra={<button className={styles.refreshBtn} onClick={loadData}>{t('common.refresh')}</button>}
    >
      <div className={styles.listContainer}>
        {sections.every(s => s.data.length === 0) ? (
          <div className={styles.emptyText}>{t('ai_providers.openai_empty_title')}</div>
        ) : (
          sections.map(section => (
            section.data.length > 0 && (
              <div key={section.type} className={styles.sectionGroup}>
                <div className={styles.sectionTitle}>{section.title}</div>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {section.data.map((item: any, idx: number) => (
                  <div key={idx} className={styles.listItem}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>
                        {item.apiKey?.substring(0, 8)}...
                        {!isEnabled(item.excludedModels) && (
                          <span className={styles.runtimeBadge}>
                            {t('ai_providers.config_disabled_badge', { defaultValue: '已停用' })}
                          </span>
                        )}
                      </div>
                      <div className={styles.itemMeta}>
                        {item.baseUrl && <span>{item.baseUrl}</span>}
                      </div>
                      {renderProviderMeta(item, section.type).length > 0 && (
                        <div className={styles.providerMeta}>
                          {renderProviderMeta(item, section.type).map((meta, i) => (
                            <span key={i}>{meta}{i < renderProviderMeta(item, section.type).length - 1 ? ' • ' : ''}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.itemAction}>
                      <ToggleSwitch
                        checked={isEnabled(item.excludedModels)}
                        onChange={(checked) => handleToggle(section.type, idx, checked)}
                        disabled={connectionStatus !== 'connected'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          ))
        )}
      </div>
    </Card>
  );
}
