import { useTranslation } from 'react-i18next';
import type { AuthFileType } from '@/types';
import styles from './Accounts.module.scss';

interface TypeFilterTagsProps {
  selectedType: AuthFileType | 'all';
  onTypeChange: (type: AuthFileType | 'all') => void;
}

export function TypeFilterTags({ selectedType, onTypeChange }: TypeFilterTagsProps) {
  const { t } = useTranslation();

  const types: Array<{ value: AuthFileType | 'all'; label: string }> = [
    { value: 'all', label: t('auth_files.filter_all', { defaultValue: '全部' }) },
    { value: 'gemini-cli', label: t('auth_files.filter_gemini-cli', { defaultValue: 'GeminiCLI' }) },
    { value: 'antigravity', label: t('auth_files.filter_antigravity', { defaultValue: 'Antigravity' }) },
    { value: 'codex', label: t('auth_files.filter_codex', { defaultValue: 'Codex' }) },
    { value: 'claude', label: t('auth_files.filter_claude', { defaultValue: 'Claude' }) },
    { value: 'iflow', label: t('auth_files.filter_iflow', { defaultValue: 'iFlow' }) },
    { value: 'vertex', label: t('auth_files.filter_vertex', { defaultValue: 'Vertex' }) },
    { value: 'qwen', label: t('auth_files.filter_qwen', { defaultValue: 'Qwen' }) },
    { value: 'gemini', label: t('auth_files.filter_gemini', { defaultValue: 'Gemini' }) },
    { value: 'aistudio', label: t('auth_files.filter_aistudio', { defaultValue: 'AIStudio' }) }
  ];

  return (
    <div className={styles.filterTags}>
      {types.map((type) => (
        <button
          key={type.value}
          className={`${styles.filterTag} ${selectedType === type.value ? styles.active : ''}`}
          onClick={() => onTypeChange(type.value)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
