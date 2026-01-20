import { useTranslation } from 'react-i18next';
import { IconFileText, IconBot, IconCheck, IconX } from '@/components/ui/icons';
import styles from './Accounts.module.scss';

interface StatsGridProps {
  totalAuthFiles: number;
  totalProviders: number;
  totalEnabled: number;
  totalDisabled: number;
  loading?: boolean;
}

export function AccountsStatsGrid({
  totalAuthFiles,
  totalProviders,
  totalEnabled,
  totalDisabled,
  loading = false
}: StatsGridProps) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('accounts.stats.total_auth_files', { defaultValue: '认证文件总数' }),
      value: totalAuthFiles,
      icon: <IconFileText size={24} />
    },
    {
      label: t('accounts.stats.total_providers', { defaultValue: '服务商配置' }),
      value: totalProviders,
      icon: <IconBot size={24} />
    },
    {
      label: t('accounts.stats.enabled', { defaultValue: '已启用' }),
      value: totalEnabled,
      icon: <IconCheck size={24} />
    },
    {
      label: t('accounts.stats.disabled', { defaultValue: '已停用' }),
      value: totalDisabled,
      icon: <IconX size={24} />
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statIcon}>{stat.icon}</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {loading ? '...' : stat.value}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
