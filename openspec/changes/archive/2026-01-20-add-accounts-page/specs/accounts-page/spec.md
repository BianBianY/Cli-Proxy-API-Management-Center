## ADDED Requirements

### Requirement: 账户页面访问
系统 SHALL 提供一个专用的账户管理页面，可从主导航访问。

#### Scenario: 用户导航到账户页面
- **WHEN** 用户点击侧边栏中的“账户”链接
- **THEN** 系统导航到 `/accounts` 路由
- **AND THEN** 显示账户页面

### Requirement: 认证文件管理
系统 SHALL 列出所有已加载的认证文件，并允许用户切换其激活状态。

#### Scenario: 用户查看认证文件列表
- **GIVEN** 已加载多个认证文件
- **WHEN** 用户查看账户页面
- **THEN** 显示认证文件列表及其当前状态（活跃/不活跃）

#### Scenario: 用户切换认证文件状态
- **GIVEN** 某个认证文件当前处于活跃状态
- **WHEN** 用户点击该文件的切换开关
- **THEN** 文件状态变为不活跃
- **AND THEN** 系统更新配置以反映此更改

### Requirement: API 服务商管理
系统 SHALL 列出所有已配置的 API 服务商，并允许用户切换其激活状态。

#### Scenario: 用户查看服务商列表
- **GIVEN** 已配置多个 API 服务商
- **WHEN** 用户查看账户页面
- **THEN** 显示服务商列表及其当前状态

#### Scenario: 用户切换服务商状态
- **GIVEN** 某个服务商当前处于活跃状态
- **WHEN** 用户点击该服务商的切换开关
- **THEN** 服务商状态变为不活跃
- **AND THEN** 系统更新配置以反映此更改