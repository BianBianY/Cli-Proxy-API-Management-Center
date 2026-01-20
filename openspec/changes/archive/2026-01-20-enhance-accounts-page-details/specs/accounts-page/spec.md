# accounts-page Specification (Delta)

## MODIFIED Requirements

### Requirement: 账户页面访问
系统 SHALL 提供一个专用的账户管理页面，可从主导航访问，并在页面顶部显示统计概览信息。

#### Scenario: 用户导航到账户页面
- **WHEN** 用户点击侧边栏中的"账户"链接
- **THEN** 系统导航到 `/accounts` 路由
- **AND THEN** 显示账户页面，包含概览统计区和两个管理卡片

#### Scenario: 用户查看概览统计区
- **GIVEN** 用户已连接到后端服务
- **WHEN** 用户打开账户页面
- **THEN** 显示四个统计卡片：认证文件总数、服务商总数、已启用数量、已停用数量
- **AND THEN** 统计数据基于当前加载的认证文件和服务商配置实时计算

### Requirement: 认证文件管理
系统 SHALL 列出所有已加载的认证文件，并显示详细的元信息（包括提供商、认证索引、运行时状态），允许用户切换其激活状态。

#### Scenario: 用户查看认证文件列表
- **GIVEN** 已加载多个认证文件
- **WHEN** 用户查看账户页面
- **THEN** 显示认证文件列表，每个文件包含以下信息：
  - 文件名（带类型颜色徽章）
  - 类型和大小
  - 提供商名称（provider）
  - 认证索引（authIndex）
  - 运行时状态徽章（如果 runtimeOnly 为 true）
  - 启用/停用开关

#### Scenario: 用户切换认证文件状态
- **GIVEN** 某个认证文件当前处于活跃状态
- **WHEN** 用户点击该文件的切换开关
- **THEN** 文件状态变为不活跃
- **AND THEN** 系统更新配置以反映此更改
- **AND THEN** 概览统计区的启用/停用数量同步更新

### Requirement: API 服务商管理
系统 SHALL 列出所有已配置的 API 服务商，并显示详细的配置信息（包括前缀、代理 URL、模型别名数量、排除模型、自定义头），允许用户切换其激活状态。

#### Scenario: 用户查看服务商列表
- **GIVEN** 已配置多个 API 服务商
- **WHEN** 用户查看账户页面
- **THEN** 显示服务商列表（按 Gemini、Claude、Codex 分组），每个配置包含以下信息：
  - API Key 前 8 位
  - Base URL
  - 前缀（prefix）
  - 代理 URL（proxyUrl，仅 Claude/Codex）
  - 模型别名数量（models.length）
  - 排除模型数量（excludedModels.length）
  - 自定义头数量（headers）
  - 停用标记（如果 excludedModels 包含 'all' 或 '*'）
  - 启用/停用开关

#### Scenario: 用户切换服务商状态
- **GIVEN** 某个服务商当前处于活跃状态
- **WHEN** 用户点击该服务商的切换开关
- **THEN** 服务商状态变为不活跃（通过添加 'all' 到 excludedModels）
- **AND THEN** 系统更新配置以反映此更改
- **AND THEN** 概览统计区的启用/停用数量同步更新

## ADDED Requirements

### Requirement: 统计数据实时刷新
系统 SHALL 在用户操作（启用/停用）后自动更新概览统计区的数字，无需手动刷新页面。

#### Scenario: 用户停用认证文件后统计更新
- **GIVEN** 概览统计区显示"已启用: 10"
- **WHEN** 用户停用一个认证文件
- **THEN** 概览统计区更新为"已启用: 9"和"已停用: +1"

#### Scenario: 用户停用服务商后统计更新
- **GIVEN** 概览统计区显示"已启用: 10"
- **WHEN** 用户停用一个服务商配置
- **THEN** 概览统计区更新为"已启用: 9"和"已停用: +1"

### Requirement: 认证文件类型筛选
系统 SHALL 在认证文件列表上方提供类型筛选标签，允许用户按文件类型快速筛选认证文件。

#### Scenario: 用户查看所有文件类型
- **GIVEN** 认证文件包含多种类型（gemini-cli、antigravity、codex 等）
- **WHEN** 用户打开账户页面
- **THEN** 显示类型筛选标签栏，包含"全部"和各个已存在的文件类型标签

#### Scenario: 用户按类型筛选
- **GIVEN** 当前显示所有认证文件
- **WHEN** 用户点击"gemini-cli"类型标签
- **THEN** 认证文件列表仅显示类型为 gemini-cli 的文件
- **AND THEN** "gemini-cli"标签高亮显示为激活状态

#### Scenario: 用户切换回全部文件
- **GIVEN** 当前筛选显示 gemini-cli 文件
- **WHEN** 用户点击"全部"标签
- **THEN** 认证文件列表显示所有文件
- **AND THEN** "全部"标签高亮显示为激活状态

### Requirement: 响应式布局适配
系统 SHALL 在不同屏幕尺寸下自动调整页面布局，确保信息可读性。

#### Scenario: 桌面端显示
- **GIVEN** 浏览器宽度 > 900px
- **WHEN** 用户打开账户页面
- **THEN** 概览统计区显示为 4 列网格
- **AND THEN** 认证文件和服务商卡片并排显示

#### Scenario: 移动端显示
- **GIVEN** 浏览器宽度 ≤ 900px
- **WHEN** 用户打开账户页面
- **THEN** 概览统计区显示为 2 列网格
- **AND THEN** 认证文件和服务商卡片垂直堆叠显示
