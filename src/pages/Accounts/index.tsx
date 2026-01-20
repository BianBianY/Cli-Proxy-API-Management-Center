import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthFileList } from '@/components/accounts/AuthFileList';
import { ProviderList } from '@/components/accounts/ProviderList';
import { AccountsStatsGrid } from '@/components/accounts/AccountsStatsGrid';
import { TypeFilterTags } from '@/components/accounts/TypeFilterTags';
import { useAccountsData } from '@/components/accounts/hooks/useAccountsData';
import type { AuthFileType } from '@/types';
import styles from '@/components/accounts/Accounts.module.scss';

export function AccountsPage() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<AuthFileType | 'all'>('all');

  const { stats, loading } = useAccountsData(selectedType);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('nav.accounts', { defaultValue: '账户管理' })}</h1>
        <p className={styles.description}>
          {t('accounts.description', { defaultValue: '在此处集中管理您的认证文件和 API 提供商。' })}
        </p>
      </div>

      {/* Statistics Grid */}
      <AccountsStatsGrid
        totalAuthFiles={stats.totalAuthFiles}
        totalProviders={stats.totalProviders}
        totalEnabled={stats.totalEnabled}
        totalDisabled={stats.totalDisabled}
        loading={loading}
      />

      {/* Type Filter Tags */}
      <TypeFilterTags
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <div className={styles.content}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <AuthFileList filterType={selectedType} />
          <ProviderList />
        </div>
      </div>
    </div>
  );
}
