# Change: 增加账户页面

## Why
目前，管理认证文件（Quota）和 API 服务商需要在不同的设置部分中进行导航，或者缺乏统一的视图。用户需要一个集中的位置来查看、启用和禁用他们的认证资源，以便更好地管理访问权限和成本。

## What Changes
- 添加一个新的 `Accounts`（账户）页面，可通过主导航访问。
- 显示已加载的认证文件列表及其状态。
- 显示已配置的 API 服务商列表及其状态。
- 允许切换（启用/禁用）认证文件和服务商。
- 添加新的路由 `/accounts`。

## Impact
- **Specs**: 增加 `accounts-page` 能力。
- **Code**: 增加 `src/pages/Accounts/`，更新 `MainRoutes.tsx` 和 `MainLayout.tsx`。