# Project Context

## Purpose

This is a **single-file React WebUI** for managing and troubleshooting the [CLI Proxy API](https://github.com/router-for-me/CLIProxyAPI) via its Management API (`/v0/management`). The application provides a web-based interface to:

- Configure server settings (debug, proxy, retry, quota, logging)
- Manage API keys and AI provider credentials (OpenAI, Claude, Gemini, Vertex, etc.)
- Upload and manage authentication files (JSON credentials)
- Initiate OAuth flows for supported providers
- Monitor usage statistics with charts and cost estimation
- Edit YAML configuration files with syntax highlighting
- Tail logs with real-time updates and search
- Query available models from the proxy

**Key Goal**: Bundle into a single HTML file that ships with the CLI Proxy API binary (accessible via `/management.html`).

## Tech Stack

### Frontend
- **React 19** with TypeScript (ES2020 target)
- **Vite** as build tool with single-file output via `vite-plugin-singlefile`
- **React Router v7** (HashRouter for `file://` protocol compatibility)
- **Zustand** for state management
- **Axios** for HTTP client with interceptors
- **Chart.js** (via react-chartjs-2) for usage visualization
- **i18next** (react-i18next) for internationalization (English + Simplified Chinese)
- **CodeMirror** (@uiw/react-codemirror) for YAML editor
- **SCSS** with CSS modules for styling

### Build & Tooling
- **Node.js 20.19.4** (via `.tool-versions`)
- **TypeScript 5.9.3** with strict mode
- **ESLint 9** with TypeScript plugin
- **Prettier 3.7.4** for code formatting
- **GSAP 3** for splash screen animations

## Project Conventions

### Code Style

**File Naming:**
- React components: **PascalCase** (`UserSettings.tsx`, `LoginPage.tsx`)
- Utilities/non-components: **camelCase** (`apiClient.ts`, `useDebounce.ts`)
- CSS/SCSS modules: **kebab-case** (`page-transition.scss`, `splash-screen.scss`)

**Formatting (Prettier):**
- 2 spaces indentation
- Single quotes
- Semicolons required
- Trailing commas (ES5 style)
- Max 100 characters per line
- Arrow function parens always

**Import Order:**
1. React imports first
2. Third-party libraries
3. Absolute imports from `@/*` (via path alias)
4. Relative imports
5. Type imports (if separated)

**Type Safety:**
- Avoid `any` where possible (ESLint warns)
- Define explicit interfaces for API responses
- Use `interface` for object types, `type` for unions/intersections
- All function parameters and return types should be typed

### Architecture Patterns

**State Management:**
- **Zustand stores** for global state (one store per domain)
  - `useAuthStore` - Authentication and session
  - `useConfigStore` - Server config with request deduplication and caching
  - `useThemeStore` - Dark/light theme preference
  - `useLanguageStore` - i18n language selection
  - `useNotificationStore` - Toast notifications
  - `useQuotaStore` - Auth files/credentials
  - `useModelsStore` - Available models cache
- Avoid prop drilling; use stores for cross-component communication
- Local component state with `useState` for UI-only concerns

**API Layer Architecture:**
- Centralized `apiClient` singleton (`services/api/client.ts`)
- Feature-based API modules (`config.ts`, `apiKeys.ts`, `providers.ts`, etc.)
- Request/response interceptors in client:
  - Auto-inject `Authorization: Bearer` header
  - Normalize API base URL (strip `/v0/management` if present)
  - Handle 401 responses → dispatch `unauthorized` event
  - Parse version headers → dispatch `server-version-update` event

**Component Organization:**
- **Feature-driven folders** under `src/components/`
- Each feature exports barrel file (`index.ts`)
- Co-locate feature-specific hooks in `hooks/` subfolder
- Shared UI primitives in `components/ui/`
- Page components in `src/pages/`

**Request Deduplication:**
- `useConfigStore` merges concurrent config requests into single in-flight request
- Cache with TTL to prevent redundant API calls
- Request tokens to invalidate stale requests on session changes

**Security:**
- Management keys stored in `localStorage` with lightweight obfuscation (`enc::v1::...`)
- Session restoration on app load via `useAuthStore.restoreSession()`
- Global event handling for 401 unauthorized responses

### Testing Strategy

**Current State:**
- No unit tests configured
- Manual testing against live CLI Proxy API backend
- Frontend validation happens in browser

**Future Considerations:**
- If tests are added, prefer Jest + React Testing Library
- Focus on critical paths: auth flow, API client, state stores
- E2E tests should use actual backend (minimum v6.5.0)

### Git Workflow

**Branching:**
- `main` - production-ready code
- Feature branches from `main`

**Commit Conventions:**
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `<type>: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat: add OAuth device flow UI`, `fix: handle 401 in logs page`

**Release Process:**
- Tag `vX.Y.Z` triggers GitHub Actions workflow (`.github/workflows/release.yml`)
- Workflow builds `dist/index.html` and publishes as `management.html` artifact
- Version injected at build time from tag/env/package.json

## Domain Context

### CLI Proxy API Integration

This UI is a **client** of the CLI Proxy API Management API. Key concepts:

- **Management Key**: Not the same as proxy API keys. Used for authentication to `/v0/management` endpoints.
- **API Keys**: Keys configured for client requests to the proxy endpoints (managed in UI).
- **Auth Files**: JSON credential files uploaded for various AI providers (Gemini, Vertex, etc.).
- **OAuth Flows**: Device code flows and browser-based OAuth for supported providers.
- **Model Aliases**: Custom model name mappings configured per provider.
- **Quota System**: Backend quota/routing logic (fallback models when quotas exceeded).

### Backend Compatibility

- **Minimum version**: 6.3.0
- **Recommended version**: 6.5.0+
- Some features require newer backend (model lists per auth file, OAuth excluded models)
- UI gracefully degrades when features are unsupported

### i18n Strategy

- English (`en`) and Simplified Chinese (`zh-CN`)
- Language selection in footer
- Preference stored in localStorage
- Add new keys to **both** locale files (`src/i18n/locales/`)

## Important Constraints

### Single-File Output

**Critical Constraint**: All assets (JS, CSS, images) must inline into one HTML file.

- Enforced by `vite-plugin-singlefile`
- No external asset loading
- Build configuration: `assetsInlineLimit: 100000000` (100MB limit)
- This enables bundling with Go binary and `file://` protocol access

### Browser Compatibility

- Target: ES2015 (for broad support)
- Hash-based routing (not browser history API)
- No server-side rendering
- CORS considerations for "OpenAI Discovery" browser-side tests

### No Server-Side Logic

- Pure client-side application
- All data fetched from backend Management API
- No bundled backend server
- Cannot proxy requests or modify headers (except via backend config)

### Backend Dependency

- UI is **non-functional** without running CLI Proxy API backend
- Requires backend to be at minimum version 6.3.0
- Remote management requires backend config: `allow-remote-management: true`

## External Dependencies

### Backend API

**CLI Proxy API Management API** (`/v0/management/*`)
- Base URL normalized to `http(s)://host:port/v0/management`
- Authentication via `Authorization: Bearer <MANAGEMENT_KEY>`
- Key endpoints:
  - `GET /config` - Server configuration
  - `POST /config` - Update config values
  - `GET /config.yaml` - Raw YAML download
  - `POST /config.yaml` - Save YAML changes
  - `GET /api-keys`, `POST /api-keys`, `DELETE /api-keys/:id`
  - Provider configs: `/gemini-api-key`, `/claude-api-key`, `/vertex-api-key`, `/openai-compatibility`, etc.
  - Auth files: `/auth-files` (upload, list, delete, models)
  - OAuth: `/oauth/start`, `/oauth/status`, `/oauth/submit-redirect`, `/iflow-cookie`
  - Usage: `/usage` (requests, tokens, per-model breakdown)
  - Logs: `/logs/tail`, `/logs/request-errors`
  - Models: `/models` (proxy endpoint)

### Browser APIs

- `localStorage` - Credential storage
- `window.dispatchEvent` / `window.addEventListener` - Event bus for auth and version updates
- `fetch` / `XMLHttpRequest` (via Axios)

### No External Services

- No telemetry or analytics
- No CDN dependencies (all bundled)
- No third-party API calls from frontend
