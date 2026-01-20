# Change: 增强 Accounts 页面细节展示

## Why

当前 Accounts 页面展示的信息较为简单，只显示了认证文件和 API 服务商的基本信息（文件名、API Key 前缀、启用状态）。用户反馈页面"显示太单薄"，缺少更多有价值的细节信息，导致用户需要切换到其他页面（如 Auth Files、AI Providers）才能查看完整的配置信息。

增强 Accounts 页面能够：
1. 提升信息密度，减少页面跳转次数
2. 提供账户管理的全局概览视图
3. 快速识别异常状态（停用、运行时、代理配置等）
4. 与项目中其他页面（Dashboard、AuthFilesPage）的展示风格保持一致

## What Changes

- 添加页面顶部的**概览统计区**（Stats Overview），显示认证文件总数、服务商总数、启用/停用数量
- 增强**认证文件卡片**，添加提供商、修改时间、认证索引、运行时状态等元信息
- 增强**服务商配置卡片**，添加前缀、代理 URL、模型别名数量、排除模型数量、自定义头数量等配置信息
- 添加类型颜色徽章（复用现有的 `TYPE_COLORS`）
- （可选）添加**类型筛选标签**，支持按认证文件类型快速筛选

**非破坏性更改**：所有改动都是在现有组件基础上增强，不影响现有功能。

## Impact

- **Affected specs**: `accounts-page`（修改现有需求）
- **Affected code**:
  - `src/pages/Accounts/index.tsx` - 添加统计区组件
  - `src/components/accounts/AuthFileList.tsx` - 增强卡片展示
  - `src/components/accounts/ProviderList.tsx` - 增强卡片展示
  - `src/components/accounts/Accounts.module.scss` - 扩展样式
  - `src/i18n/locales/zh-CN.json`, `src/i18n/locales/en.json` - 添加翻译键

**无破坏性影响**：
- 不修改 API 调用接口
- 不修改数据类型定义
- 不影响其他页面功能
- 向后兼容（如果后端版本低于 6.5.0，部分字段可能为空但不会报错）
