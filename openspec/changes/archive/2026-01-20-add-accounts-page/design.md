# Design: 账户页面

## UI Layout
账户页面将分为两个主要部分：

### 1. 认证文件 (Auth Files)
- **显示**: 加载的认证文件列表（例如 `auth.json`, `user-1.json`）。
- **信息**: 文件名，包含的账户/Token 数量（如果可用）。
- **控制**: 启用/禁用特定认证文件的切换开关。
- **操作**: 重新加载/刷新文件列表的选项。

### 2. API 服务商 (API Providers)
- **显示**: 已配置的 API 服务商列表（例如 OpenAI, Claude, Gemini）。
- **信息**: 服务商名称，状态（活跃/不活跃），配置的模型（摘要）。
- **控制**: 启用/禁用整个服务商的切换开关。

## State Management
- **Auth Files**: 详细数据通常驻留在 `useQuotaStore` 中或通过 `/v1/quota` 端点获取。
    - *假设*: 我们假设后端 API 支持“禁用”特定文件，或者我们将在 UI 中实现“软禁用”逻辑。

## Routing
- 在 `src/router/MainRoutes.tsx` 中添加 `/accounts`。
- 在侧边栏导航 (`src/components/layout/MainLayout.tsx`) 中添加“账户”。

## Components
- `src/pages/Accounts/index.tsx`: 主页面容器。
- `src/components/accounts/AuthFileList.tsx`: 用于列出认证文件的组件。
- `src/components/accounts/ProviderList.tsx`: 用于列出服务商的组件。