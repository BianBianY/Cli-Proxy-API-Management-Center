# 实施任务清单

## 1. 准备阶段
- [ ] 1.1 阅读现有 Accounts 页面代码
- [ ] 1.2 确认 `AuthFileItem` 和 `ProviderKeyConfig` 类型定义
- [ ] 1.3 确认 `TYPE_COLORS` 常量位置和内容

## 2. 数据层实现
- [ ] 2.1 创建 `src/components/accounts/hooks/useAccountsData.ts` hook
- [ ] 2.2 实现统计数据计算逻辑（总数、启用/停用）
- [ ] 2.3 添加 refresh 方法统一刷新数据

## 3. 概览统计区实现
- [ ] 3.1 创建 `src/components/accounts/AccountsStatsGrid.tsx` 组件
- [ ] 3.2 实现四个统计卡片（认证文件总数、服务商总数、已启用、已停用）
- [ ] 3.3 添加响应式布局（桌面 4 列，移动端 2 列）
- [ ] 3.4 添加 hover 效果和图标

## 4. 认证文件卡片增强（用户确认的字段）
- [ ] 4.1 添加提供商 (provider) 字段展示
- [ ] 4.2 添加认证索引 (authIndex) 字段展示
- [ ] 4.3 添加运行时状态徽章 (runtimeOnly)
- [ ] 4.4 添加类型颜色徽章（复用 `TYPE_COLORS`）
- [ ] 4.5 调整卡片布局为两行显示

## 5. 服务商配置卡片增强
- [ ] 5.1 在 `ProviderList.tsx` 中添加前缀 (prefix) 字段展示
- [ ] 5.2 添加代理 URL (proxyUrl) 字段展示
- [ ] 5.3 添加模型别名数量 (models.length) 统计
- [ ] 5.4 添加排除模型数量 (excludedModels.length) 统计
- [ ] 5.5 添加自定义头数量 (headers) 统计
- [ ] 5.6 添加停用标记（当 excludedModels 包含 'all' 或 '*'）

## 6. 样式实现
- [ ] 6.1 在 `Accounts.module.scss` 中添加 `.statsGrid` 样式
- [ ] 6.2 添加 `.statCard` 样式（带 hover 效果）
- [ ] 6.3 扩展 `.listItem` 为 `.fileCardEnhanced` 和 `.providerCardEnhanced`
- [ ] 6.4 添加元信息网格样式 `.cardMeta`
- [ ] 6.5 添加徽章样式 `.badge`, `.badgeRuntime`, `.badgeDisabled`
- [ ] 6.6 验证深色/浅色主题下的视觉效果

## 7. 国际化
- [ ] 7.1 在 `zh-CN.json` 中添加 `accounts.stats.*` 翻译键
- [ ] 7.2 在 `zh-CN.json` 中添加 `accounts.auth_file.*` 翻译键
- [ ] 7.3 在 `zh-CN.json` 中添加 `accounts.provider.*` 翻译键
- [ ] 7.4 在 `en.json` 中添加对应的英文翻译
- [ ] 7.5 验证翻译在两种语言下的显示

## 8. 集成与测试
- [ ] 8.1 更新 `src/pages/Accounts/index.tsx`，集成 `AccountsStatsGrid` 组件
- [ ] 8.2 更新 `src/components/accounts/index.ts` 导出新组件
- [ ] 8.3 测试页面加载和数据刷新功能
- [ ] 8.4 测试启用/停用开关功能
- [ ] 8.5 测试响应式布局（移动端和桌面端）
- [ ] 8.6 测试深色/浅色主题切换

## 9. 类型筛选标签实现（P0 优先级 - 用户确认需要）
- [ ] 9.1 创建 `TypeFilterTags.tsx` 组件
- [ ] 9.2 实现类型筛选逻辑（按 AuthFileType 过滤）
- [ ] 9.3 集成到 `AuthFileList` 组件
- [ ] 9.4 添加筛选标签样式

## 10. 文档与验收
- [ ] 10.1 更新 `CLAUDE.md` 如果有架构变化
- [ ] 10.2 验证所有任务完成
- [ ] 10.3 提交代码前执行 `npm run lint`
- [ ] 10.4 执行 `npm run build` 确保构建成功
