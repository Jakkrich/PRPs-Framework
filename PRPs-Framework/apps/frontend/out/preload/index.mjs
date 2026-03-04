import { ipcRenderer, contextBridge } from "electron";
const IPC_CHANNELS = {
  // Project operations
  PROJECT_ADD: "project:add",
  PROJECT_REMOVE: "project:remove",
  PROJECT_LIST: "project:list",
  PROJECT_UPDATE_SETTINGS: "project:updateSettings",
  PROJECT_INITIALIZE: "project:initialize",
  PROJECT_CHECK_VERSION: "project:checkVersion",
  // Tab state operations (persisted in main process)
  TAB_STATE_GET: "tabState:get",
  TAB_STATE_SAVE: "tabState:save",
  // Kanban preferences (per-project column collapse state)
  KANBAN_PREFS_GET: "kanbanPrefs:get",
  KANBAN_PREFS_SAVE: "kanbanPrefs:save",
  // Task operations
  TASK_LIST: "task:list",
  TASK_CREATE: "task:create",
  TASK_DELETE: "task:delete",
  TASK_UPDATE: "task:update",
  TASK_START: "task:start",
  TASK_STOP: "task:stop",
  TASK_REVIEW: "task:review",
  TASK_UPDATE_STATUS: "task:updateStatus",
  TASK_RECOVER_STUCK: "task:recoverStuck",
  TASK_CHECK_RUNNING: "task:checkRunning",
  TASK_RESUME_PAUSED: "task:resumePaused",
  // Resume a rate-limited or auth-paused task
  TASK_LOAD_IMAGE_THUMBNAIL: "task:loadImageThumbnail",
  TASK_CHECK_WORKTREE_CHANGES: "task:checkWorktreeChanges",
  // Workspace management (for human review)
  // Per-spec architecture: Each spec has its own worktree at .worktrees/{spec-name}/
  TASK_WORKTREE_STATUS: "task:worktreeStatus",
  TASK_WORKTREE_DIFF: "task:worktreeDiff",
  TASK_WORKTREE_MERGE: "task:worktreeMerge",
  TASK_WORKTREE_MERGE_PREVIEW: "task:worktreeMergePreview",
  // Preview merge conflicts before merging
  TASK_WORKTREE_DISCARD: "task:worktreeDiscard",
  TASK_WORKTREE_DISCARD_ORPHAN: "task:worktreeDiscardOrphan",
  // Delete orphaned worktree by spec name (no task association)
  TASK_WORKTREE_CREATE_PR: "task:worktreeCreatePR",
  TASK_WORKTREE_OPEN_IN_IDE: "task:worktreeOpenInIDE",
  TASK_WORKTREE_OPEN_IN_TERMINAL: "task:worktreeOpenInTerminal",
  TASK_WORKTREE_DETECT_TOOLS: "task:worktreeDetectTools",
  // Detect installed IDEs/terminals
  TASK_LIST_WORKTREES: "task:listWorktrees",
  TASK_ARCHIVE: "task:archive",
  TASK_UNARCHIVE: "task:unarchive",
  TASK_CLEAR_STAGED_STATE: "task:clearStagedState",
  // Task events (main -> renderer)
  TASK_PROGRESS: "task:progress",
  TASK_ERROR: "task:error",
  TASK_LOG: "task:log",
  TASK_STATUS_CHANGE: "task:statusChange",
  TASK_EXECUTION_PROGRESS: "task:executionProgress",
  // Task phase logs (persistent, collapsible logs by phase)
  TASK_LOGS_GET: "task:logsGet",
  // Load logs from spec dir
  TASK_LOGS_WATCH: "task:logsWatch",
  // Start watching for log changes
  TASK_LOGS_UNWATCH: "task:logsUnwatch",
  // Stop watching for log changes
  TASK_LOGS_CHANGED: "task:logsChanged",
  // Event: logs changed (main -> renderer)
  TASK_LOGS_STREAM: "task:logsStream",
  // Event: streaming log chunk (main -> renderer)
  TASK_MERGE_PROGRESS: "task:mergeProgress",
  // Event: merge progress update (main -> renderer)
  // Terminal operations
  TERMINAL_CREATE: "terminal:create",
  TERMINAL_DESTROY: "terminal:destroy",
  TERMINAL_INPUT: "terminal:input",
  TERMINAL_RESIZE: "terminal:resize",
  TERMINAL_INVOKE_CLAUDE: "terminal:invokeClaude",
  TERMINAL_GENERATE_NAME: "terminal:generateName",
  TERMINAL_SET_TITLE: "terminal:setTitle",
  // Renderer -> Main: user renamed terminal
  TERMINAL_SET_WORKTREE_CONFIG: "terminal:setWorktreeConfig",
  // Renderer -> Main: worktree association changed
  // Terminal session management
  TERMINAL_GET_SESSIONS: "terminal:getSessions",
  TERMINAL_RESTORE_SESSION: "terminal:restoreSession",
  TERMINAL_CLEAR_SESSIONS: "terminal:clearSessions",
  TERMINAL_RESUME_CLAUDE: "terminal:resumeClaude",
  TERMINAL_ACTIVATE_DEFERRED_RESUME: "terminal:activateDeferredResume",
  // Trigger deferred Claude resume when terminal becomes active
  TERMINAL_GET_SESSION_DATES: "terminal:getSessionDates",
  TERMINAL_GET_SESSIONS_FOR_DATE: "terminal:getSessionsForDate",
  TERMINAL_RESTORE_FROM_DATE: "terminal:restoreFromDate",
  TERMINAL_CHECK_PTY_ALIVE: "terminal:checkPtyAlive",
  TERMINAL_UPDATE_DISPLAY_ORDERS: "terminal:updateDisplayOrders",
  // Persist terminal display order after drag-drop reorder
  // Terminal worktree operations (isolated development in worktrees)
  TERMINAL_WORKTREE_CREATE: "terminal:worktreeCreate",
  TERMINAL_WORKTREE_REMOVE: "terminal:worktreeRemove",
  TERMINAL_WORKTREE_LIST: "terminal:worktreeList",
  TERMINAL_WORKTREE_LIST_OTHER: "terminal:worktreeListOther",
  // Terminal events (main -> renderer)
  TERMINAL_OUTPUT: "terminal:output",
  TERMINAL_EXIT: "terminal:exit",
  TERMINAL_TITLE_CHANGE: "terminal:titleChange",
  TERMINAL_WORKTREE_CONFIG_CHANGE: "terminal:worktreeConfigChange",
  // Worktree config restored/changed (for sync on recovery)
  TERMINAL_CLAUDE_SESSION: "terminal:claudeSession",
  // Claude session ID captured
  TERMINAL_PENDING_RESUME: "terminal:pendingResume",
  // Terminal has pending Claude resume (for deferred activation)
  TERMINAL_RATE_LIMIT: "terminal:rateLimit",
  // Claude Code rate limit detected
  TERMINAL_OAUTH_TOKEN: "terminal:oauthToken",
  // OAuth token captured from setup-token output
  TERMINAL_AUTH_CREATED: "terminal:authCreated",
  // Auth terminal created for OAuth flow
  TERMINAL_OAUTH_CODE_NEEDED: "terminal:oauthCodeNeeded",
  // Request user to paste OAuth code from browser
  TERMINAL_OAUTH_CODE_SUBMIT: "terminal:oauthCodeSubmit",
  // User submitted OAuth code to send to terminal
  TERMINAL_CLAUDE_BUSY: "terminal:claudeBusy",
  // Claude Code busy state (for visual indicator)
  TERMINAL_CLAUDE_EXIT: "terminal:claudeExit",
  // Claude Code exited (returned to shell)
  TERMINAL_ONBOARDING_COMPLETE: "terminal:onboardingComplete",
  // Claude onboarding complete (ready for input after login)
  TERMINAL_PROFILE_CHANGED: "terminal:profileChanged",
  // Profile changed, terminals need refresh (main -> renderer)
  // Claude profile management (multi-account support)
  CLAUDE_PROFILES_GET: "claude:profilesGet",
  CLAUDE_PROFILE_SAVE: "claude:profileSave",
  CLAUDE_PROFILE_DELETE: "claude:profileDelete",
  CLAUDE_PROFILE_RENAME: "claude:profileRename",
  CLAUDE_PROFILE_SET_ACTIVE: "claude:profileSetActive",
  CLAUDE_PROFILE_SWITCH: "claude:profileSwitch",
  CLAUDE_PROFILE_INITIALIZE: "claude:profileInitialize",
  CLAUDE_PROFILE_SET_TOKEN: "claude:profileSetToken",
  // Set OAuth token for a profile
  CLAUDE_PROFILE_AUTHENTICATE: "claude:profileAuthenticate",
  // Open visible terminal for OAuth login
  CLAUDE_PROFILE_VERIFY_AUTH: "claude:profileVerifyAuth",
  // Check if profile has been authenticated
  CLAUDE_PROFILE_AUTO_SWITCH_SETTINGS: "claude:autoSwitchSettings",
  CLAUDE_PROFILE_UPDATE_AUTO_SWITCH: "claude:updateAutoSwitch",
  CLAUDE_PROFILE_FETCH_USAGE: "claude:fetchUsage",
  CLAUDE_PROFILE_GET_BEST_PROFILE: "claude:getBestProfile",
  // Account priority order (unified OAuth + API profile ordering)
  ACCOUNT_PRIORITY_GET: "account:priorityGet",
  ACCOUNT_PRIORITY_SET: "account:prioritySet",
  // SDK/CLI rate limit event (for non-terminal Claude invocations)
  CLAUDE_SDK_RATE_LIMIT: "claude:sdkRateLimit",
  // Auth failure event (401 errors requiring re-authentication)
  CLAUDE_AUTH_FAILURE: "claude:authFailure",
  // Retry a rate-limited operation with a different profile
  CLAUDE_RETRY_WITH_PROFILE: "claude:retryWithProfile",
  // Usage monitoring (proactive account switching)
  USAGE_UPDATED: "claude:usageUpdated",
  // Event: usage data updated (main -> renderer)
  USAGE_REQUEST: "claude:usageRequest",
  // Request current usage snapshot
  ALL_PROFILES_USAGE_REQUEST: "claude:allProfilesUsageRequest",
  // Request all profiles usage immediately
  ALL_PROFILES_USAGE_UPDATED: "claude:allProfilesUsageUpdated",
  // Event: all profiles usage data (main -> renderer)
  PROACTIVE_SWAP_NOTIFICATION: "claude:proactiveSwapNotification",
  // Event: proactive swap occurred
  // Settings
  SETTINGS_GET: "settings:get",
  SETTINGS_SAVE: "settings:save",
  SETTINGS_GET_CLI_TOOLS_INFO: "settings:getCliToolsInfo",
  SETTINGS_CLAUDE_CODE_GET_ONBOARDING_STATUS: "settings:claudeCode:getOnboardingStatus",
  // Check hasCompletedOnboarding from ~/.claude.json
  // API Profile management (custom Anthropic-compatible endpoints)
  PROFILES_GET: "profiles:get",
  PROFILES_SAVE: "profiles:save",
  PROFILES_UPDATE: "profiles:update",
  PROFILES_DELETE: "profiles:delete",
  PROFILES_SET_ACTIVE: "profiles:setActive",
  PROFILES_TEST_CONNECTION: "profiles:test-connection",
  PROFILES_TEST_CONNECTION_CANCEL: "profiles:test-connection-cancel",
  PROFILES_DISCOVER_MODELS: "profiles:discover-models",
  PROFILES_DISCOVER_MODELS_CANCEL: "profiles:discover-models-cancel",
  // Dialogs
  DIALOG_SELECT_DIRECTORY: "dialog:selectDirectory",
  DIALOG_CREATE_PROJECT_FOLDER: "dialog:createProjectFolder",
  DIALOG_GET_DEFAULT_PROJECT_LOCATION: "dialog:getDefaultProjectLocation",
  // App info
  APP_VERSION: "app:version",
  // Shell operations
  SHELL_OPEN_EXTERNAL: "shell:openExternal",
  SHELL_OPEN_TERMINAL: "shell:openTerminal",
  // Roadmap operations
  ROADMAP_GET: "roadmap:get",
  ROADMAP_GET_STATUS: "roadmap:getStatus",
  ROADMAP_SAVE: "roadmap:save",
  ROADMAP_GENERATE: "roadmap:generate",
  ROADMAP_GENERATE_WITH_COMPETITOR: "roadmap:generateWithCompetitor",
  ROADMAP_REFRESH: "roadmap:refresh",
  ROADMAP_STOP: "roadmap:stop",
  ROADMAP_UPDATE_FEATURE: "roadmap:updateFeature",
  ROADMAP_CONVERT_TO_SPEC: "roadmap:convertToSpec",
  // Roadmap events (main -> renderer)
  ROADMAP_PROGRESS: "roadmap:progress",
  ROADMAP_COMPLETE: "roadmap:complete",
  ROADMAP_ERROR: "roadmap:error",
  ROADMAP_STOPPED: "roadmap:stopped",
  // Roadmap progress persistence (per-project state)
  ROADMAP_PROGRESS_SAVE: "roadmap:progressSave",
  ROADMAP_PROGRESS_LOAD: "roadmap:progressLoad",
  ROADMAP_PROGRESS_CLEAR: "roadmap:progressClear",
  // Context operations
  CONTEXT_GET: "context:get",
  CONTEXT_REFRESH_INDEX: "context:refreshIndex",
  CONTEXT_MEMORY_STATUS: "context:memoryStatus",
  CONTEXT_SEARCH_MEMORIES: "context:searchMemories",
  CONTEXT_GET_MEMORIES: "context:getMemories",
  // Environment configuration
  ENV_GET: "env:get",
  ENV_UPDATE: "env:update",
  ENV_CHECK_CLAUDE_AUTH: "env:checkClaudeAuth",
  ENV_INVOKE_CLAUDE_SETUP: "env:invokeClaudeSetup",
  // Ideation operations
  IDEATION_GET: "ideation:get",
  IDEATION_GENERATE: "ideation:generate",
  IDEATION_REFRESH: "ideation:refresh",
  IDEATION_STOP: "ideation:stop",
  IDEATION_UPDATE_IDEA: "ideation:updateIdea",
  IDEATION_CONVERT_TO_TASK: "ideation:convertToTask",
  IDEATION_DISMISS: "ideation:dismiss",
  IDEATION_DISMISS_ALL: "ideation:dismissAll",
  IDEATION_ARCHIVE: "ideation:archive",
  IDEATION_DELETE: "ideation:delete",
  IDEATION_DELETE_MULTIPLE: "ideation:deleteMultiple",
  // Ideation events (main -> renderer)
  IDEATION_PROGRESS: "ideation:progress",
  IDEATION_LOG: "ideation:log",
  IDEATION_COMPLETE: "ideation:complete",
  IDEATION_ERROR: "ideation:error",
  IDEATION_STOPPED: "ideation:stopped",
  IDEATION_TYPE_COMPLETE: "ideation:typeComplete",
  IDEATION_TYPE_FAILED: "ideation:typeFailed",
  // Linear integration
  LINEAR_GET_TEAMS: "linear:getTeams",
  LINEAR_GET_PROJECTS: "linear:getProjects",
  LINEAR_GET_ISSUES: "linear:getIssues",
  LINEAR_IMPORT_ISSUES: "linear:importIssues",
  LINEAR_CHECK_CONNECTION: "linear:checkConnection",
  // GitHub integration
  GITHUB_GET_REPOSITORIES: "github:getRepositories",
  GITHUB_GET_ISSUES: "github:getIssues",
  GITHUB_GET_ISSUE: "github:getIssue",
  GITHUB_GET_ISSUE_COMMENTS: "github:getIssueComments",
  GITHUB_CHECK_CONNECTION: "github:checkConnection",
  GITHUB_INVESTIGATE_ISSUE: "github:investigateIssue",
  GITHUB_IMPORT_ISSUES: "github:importIssues",
  GITHUB_CREATE_RELEASE: "github:createRelease",
  // GitHub OAuth (gh CLI authentication)
  GITHUB_CHECK_CLI: "github:checkCli",
  GITHUB_CHECK_AUTH: "github:checkAuth",
  GITHUB_START_AUTH: "github:startAuth",
  GITHUB_GET_TOKEN: "github:getToken",
  GITHUB_GET_USER: "github:getUser",
  GITHUB_LIST_USER_REPOS: "github:listUserRepos",
  GITHUB_DETECT_REPO: "github:detectRepo",
  GITHUB_GET_BRANCHES: "github:getBranches",
  GITHUB_CREATE_REPO: "github:createRepo",
  GITHUB_ADD_REMOTE: "github:addRemote",
  GITHUB_LIST_ORGS: "github:listOrgs",
  // GitHub OAuth events (main -> renderer) - for streaming device code during auth
  GITHUB_AUTH_DEVICE_CODE: "github:authDeviceCode",
  GITHUB_AUTH_CHANGED: "github:authChanged",
  // Event: GitHub auth state changed (account swap)
  // GitHub events (main -> renderer)
  GITHUB_INVESTIGATION_PROGRESS: "github:investigationProgress",
  GITHUB_INVESTIGATION_COMPLETE: "github:investigationComplete",
  GITHUB_INVESTIGATION_ERROR: "github:investigationError",
  // GitLab integration
  GITLAB_GET_PROJECTS: "gitlab:getProjects",
  GITLAB_GET_ISSUES: "gitlab:getIssues",
  GITLAB_GET_ISSUE: "gitlab:getIssue",
  GITLAB_GET_ISSUE_NOTES: "gitlab:getIssueNotes",
  GITLAB_CHECK_CONNECTION: "gitlab:checkConnection",
  GITLAB_INVESTIGATE_ISSUE: "gitlab:investigateIssue",
  GITLAB_IMPORT_ISSUES: "gitlab:importIssues",
  GITLAB_CREATE_RELEASE: "gitlab:createRelease",
  // GitLab Merge Requests (equivalent to GitHub PRs)
  GITLAB_GET_MERGE_REQUESTS: "gitlab:getMergeRequests",
  GITLAB_GET_MERGE_REQUEST: "gitlab:getMergeRequest",
  GITLAB_CREATE_MERGE_REQUEST: "gitlab:createMergeRequest",
  GITLAB_UPDATE_MERGE_REQUEST: "gitlab:updateMergeRequest",
  // GitLab OAuth (glab CLI authentication)
  GITLAB_CHECK_CLI: "gitlab:checkCli",
  GITLAB_INSTALL_CLI: "gitlab:installCli",
  GITLAB_CHECK_AUTH: "gitlab:checkAuth",
  GITLAB_START_AUTH: "gitlab:startAuth",
  GITLAB_GET_TOKEN: "gitlab:getToken",
  GITLAB_GET_USER: "gitlab:getUser",
  GITLAB_LIST_USER_PROJECTS: "gitlab:listUserProjects",
  GITLAB_DETECT_PROJECT: "gitlab:detectProject",
  GITLAB_GET_BRANCHES: "gitlab:getBranches",
  GITLAB_CREATE_PROJECT: "gitlab:createProject",
  GITLAB_ADD_REMOTE: "gitlab:addRemote",
  GITLAB_LIST_GROUPS: "gitlab:listGroups",
  // GitLab events (main -> renderer)
  GITLAB_INVESTIGATION_PROGRESS: "gitlab:investigationProgress",
  GITLAB_INVESTIGATION_COMPLETE: "gitlab:investigationComplete",
  GITLAB_INVESTIGATION_ERROR: "gitlab:investigationError",
  // GitLab MR Review operations
  GITLAB_MR_GET_DIFF: "gitlab:mr:getDiff",
  GITLAB_MR_REVIEW: "gitlab:mr:review",
  GITLAB_MR_REVIEW_CANCEL: "gitlab:mr:reviewCancel",
  GITLAB_MR_GET_REVIEW: "gitlab:mr:getReview",
  GITLAB_MR_FOLLOWUP_REVIEW: "gitlab:mr:followupReview",
  GITLAB_MR_POST_REVIEW: "gitlab:mr:postReview",
  GITLAB_MR_POST_NOTE: "gitlab:mr:postNote",
  GITLAB_MR_MERGE: "gitlab:mr:merge",
  GITLAB_MR_ASSIGN: "gitlab:mr:assign",
  GITLAB_MR_APPROVE: "gitlab:mr:approve",
  GITLAB_MR_CHECK_NEW_COMMITS: "gitlab:mr:checkNewCommits",
  // GitLab MR Review events (main -> renderer)
  GITLAB_MR_REVIEW_PROGRESS: "gitlab:mr:reviewProgress",
  GITLAB_MR_REVIEW_COMPLETE: "gitlab:mr:reviewComplete",
  GITLAB_MR_REVIEW_ERROR: "gitlab:mr:reviewError",
  // GitLab Auto-Fix operations
  GITLAB_AUTOFIX_START: "gitlab:autofix:start",
  GITLAB_AUTOFIX_STOP: "gitlab:autofix:stop",
  GITLAB_AUTOFIX_GET_QUEUE: "gitlab:autofix:getQueue",
  GITLAB_AUTOFIX_CHECK_LABELS: "gitlab:autofix:checkLabels",
  GITLAB_AUTOFIX_CHECK_NEW: "gitlab:autofix:checkNew",
  GITLAB_AUTOFIX_GET_CONFIG: "gitlab:autofix:getConfig",
  GITLAB_AUTOFIX_SAVE_CONFIG: "gitlab:autofix:saveConfig",
  GITLAB_AUTOFIX_BATCH: "gitlab:autofix:batch",
  GITLAB_AUTOFIX_GET_BATCHES: "gitlab:autofix:getBatches",
  // GitLab Auto-Fix events (main -> renderer)
  GITLAB_AUTOFIX_PROGRESS: "gitlab:autofix:progress",
  GITLAB_AUTOFIX_COMPLETE: "gitlab:autofix:complete",
  GITLAB_AUTOFIX_ERROR: "gitlab:autofix:error",
  GITLAB_AUTOFIX_BATCH_PROGRESS: "gitlab:autofix:batchProgress",
  GITLAB_AUTOFIX_BATCH_COMPLETE: "gitlab:autofix:batchComplete",
  GITLAB_AUTOFIX_BATCH_ERROR: "gitlab:autofix:batchError",
  // GitLab Issue Analysis Preview (proactive batch workflow)
  GITLAB_AUTOFIX_ANALYZE_PREVIEW: "gitlab:autofix:analyzePreview",
  GITLAB_AUTOFIX_ANALYZE_PREVIEW_PROGRESS: "gitlab:autofix:analyzePreviewProgress",
  GITLAB_AUTOFIX_ANALYZE_PREVIEW_COMPLETE: "gitlab:autofix:analyzePreviewComplete",
  GITLAB_AUTOFIX_ANALYZE_PREVIEW_ERROR: "gitlab:autofix:analyzePreviewError",
  GITLAB_AUTOFIX_APPROVE_BATCHES: "gitlab:autofix:approveBatches",
  // GitLab Issue Triage operations
  GITLAB_TRIAGE_RUN: "gitlab:triage:run",
  GITLAB_TRIAGE_GET_RESULTS: "gitlab:triage:getResults",
  GITLAB_TRIAGE_APPLY_LABELS: "gitlab:triage:applyLabels",
  GITLAB_TRIAGE_GET_CONFIG: "gitlab:triage:getConfig",
  GITLAB_TRIAGE_SAVE_CONFIG: "gitlab:triage:saveConfig",
  // GitLab Issue Triage events (main -> renderer)
  GITLAB_TRIAGE_PROGRESS: "gitlab:triage:progress",
  GITLAB_TRIAGE_COMPLETE: "gitlab:triage:complete",
  GITLAB_TRIAGE_ERROR: "gitlab:triage:error",
  // GitHub Auto-Fix operations
  GITHUB_AUTOFIX_START: "github:autofix:start",
  GITHUB_AUTOFIX_STOP: "github:autofix:stop",
  GITHUB_AUTOFIX_GET_QUEUE: "github:autofix:getQueue",
  GITHUB_AUTOFIX_CHECK_LABELS: "github:autofix:checkLabels",
  GITHUB_AUTOFIX_CHECK_NEW: "github:autofix:checkNew",
  GITHUB_AUTOFIX_GET_CONFIG: "github:autofix:getConfig",
  GITHUB_AUTOFIX_SAVE_CONFIG: "github:autofix:saveConfig",
  GITHUB_AUTOFIX_BATCH: "github:autofix:batch",
  GITHUB_AUTOFIX_GET_BATCHES: "github:autofix:getBatches",
  // GitHub Auto-Fix events (main -> renderer)
  GITHUB_AUTOFIX_PROGRESS: "github:autofix:progress",
  GITHUB_AUTOFIX_COMPLETE: "github:autofix:complete",
  GITHUB_AUTOFIX_ERROR: "github:autofix:error",
  GITHUB_AUTOFIX_BATCH_PROGRESS: "github:autofix:batchProgress",
  GITHUB_AUTOFIX_BATCH_COMPLETE: "github:autofix:batchComplete",
  GITHUB_AUTOFIX_BATCH_ERROR: "github:autofix:batchError",
  // GitHub Issue Analysis Preview (proactive batch workflow)
  GITHUB_AUTOFIX_ANALYZE_PREVIEW: "github:autofix:analyzePreview",
  GITHUB_AUTOFIX_ANALYZE_PREVIEW_PROGRESS: "github:autofix:analyzePreviewProgress",
  GITHUB_AUTOFIX_ANALYZE_PREVIEW_COMPLETE: "github:autofix:analyzePreviewComplete",
  GITHUB_AUTOFIX_ANALYZE_PREVIEW_ERROR: "github:autofix:analyzePreviewError",
  GITHUB_AUTOFIX_APPROVE_BATCHES: "github:autofix:approveBatches",
  // GitHub PR Review operations
  GITHUB_PR_LIST: "github:pr:list",
  GITHUB_PR_LIST_MORE: "github:pr:listMore",
  // Load more PRs (pagination)
  GITHUB_PR_GET: "github:pr:get",
  GITHUB_PR_GET_DIFF: "github:pr:getDiff",
  GITHUB_PR_REVIEW: "github:pr:review",
  GITHUB_PR_REVIEW_CANCEL: "github:pr:reviewCancel",
  GITHUB_PR_GET_REVIEW: "github:pr:getReview",
  GITHUB_PR_GET_REVIEWS_BATCH: "github:pr:getReviewsBatch",
  // Batch load reviews for multiple PRs
  GITHUB_PR_POST_REVIEW: "github:pr:postReview",
  GITHUB_PR_DELETE_REVIEW: "github:pr:deleteReview",
  GITHUB_PR_MERGE: "github:pr:merge",
  GITHUB_PR_ASSIGN: "github:pr:assign",
  GITHUB_PR_POST_COMMENT: "github:pr:postComment",
  GITHUB_PR_FIX: "github:pr:fix",
  GITHUB_PR_FOLLOWUP_REVIEW: "github:pr:followupReview",
  GITHUB_PR_CHECK_NEW_COMMITS: "github:pr:checkNewCommits",
  GITHUB_PR_CHECK_MERGE_READINESS: "github:pr:checkMergeReadiness",
  GITHUB_PR_MARK_REVIEW_POSTED: "github:pr:markReviewPosted",
  GITHUB_PR_UPDATE_BRANCH: "github:pr:updateBranch",
  // GitHub PR Review events (main -> renderer)
  GITHUB_PR_REVIEW_PROGRESS: "github:pr:reviewProgress",
  GITHUB_PR_REVIEW_COMPLETE: "github:pr:reviewComplete",
  GITHUB_PR_REVIEW_ERROR: "github:pr:reviewError",
  GITHUB_PR_LOGS_UPDATED: "github:pr:logsUpdated",
  // GitHub PR Logs (for viewing AI review logs)
  GITHUB_PR_GET_LOGS: "github:pr:getLogs",
  // GitHub PR Status Polling (production system checks)
  GITHUB_PR_STATUS_POLL_START: "github:pr:statusPollStart",
  // Start polling PR status
  GITHUB_PR_STATUS_POLL_STOP: "github:pr:statusPollStop",
  // Stop polling PR status
  GITHUB_PR_STATUS_UPDATE: "github:pr:statusUpdate",
  // Event: PR status updated (main -> renderer)
  // GitHub PR Memory operations (saves review insights to memory layer)
  GITHUB_PR_MEMORY_GET: "github:pr:memory:get",
  // Get PR review memories
  GITHUB_PR_MEMORY_SEARCH: "github:pr:memory:search",
  // Search PR review memories
  // GitHub Workflow Approval (for fork PRs)
  GITHUB_WORKFLOWS_AWAITING_APPROVAL: "github:workflows:awaitingApproval",
  GITHUB_WORKFLOW_APPROVE: "github:workflow:approve",
  // GitHub Issue Triage operations
  GITHUB_TRIAGE_RUN: "github:triage:run",
  GITHUB_TRIAGE_GET_RESULTS: "github:triage:getResults",
  GITHUB_TRIAGE_APPLY_LABELS: "github:triage:applyLabels",
  GITHUB_TRIAGE_GET_CONFIG: "github:triage:getConfig",
  GITHUB_TRIAGE_SAVE_CONFIG: "github:triage:saveConfig",
  // GitHub Issue Triage events (main -> renderer)
  GITHUB_TRIAGE_PROGRESS: "github:triage:progress",
  GITHUB_TRIAGE_COMPLETE: "github:triage:complete",
  GITHUB_TRIAGE_ERROR: "github:triage:error",
  // Memory Infrastructure status (LadybugDB - no Docker required)
  MEMORY_STATUS: "memory:status",
  MEMORY_LIST_DATABASES: "memory:listDatabases",
  MEMORY_TEST_CONNECTION: "memory:testConnection",
  // Graphiti validation
  GRAPHITI_VALIDATE_LLM: "graphiti:validateLlm",
  GRAPHITI_TEST_CONNECTION: "graphiti:testConnection",
  // Ollama model detection and management
  OLLAMA_CHECK_STATUS: "ollama:checkStatus",
  OLLAMA_CHECK_INSTALLED: "ollama:checkInstalled",
  OLLAMA_INSTALL: "ollama:install",
  OLLAMA_LIST_MODELS: "ollama:listModels",
  OLLAMA_LIST_EMBEDDING_MODELS: "ollama:listEmbeddingModels",
  OLLAMA_PULL_MODEL: "ollama:pullModel",
  OLLAMA_PULL_PROGRESS: "ollama:pullProgress",
  // Auto Claude source environment configuration
  AUTOBUILD_SOURCE_ENV_GET: "autobuild:source:env:get",
  AUTOBUILD_SOURCE_ENV_UPDATE: "autobuild:source:env:update",
  AUTOBUILD_SOURCE_ENV_CHECK_TOKEN: "autobuild:source:env:checkToken",
  // Changelog operations
  CHANGELOG_GET_DONE_TASKS: "changelog:getDoneTasks",
  CHANGELOG_LOAD_TASK_SPECS: "changelog:loadTaskSpecs",
  CHANGELOG_GENERATE: "changelog:generate",
  CHANGELOG_SAVE: "changelog:save",
  CHANGELOG_READ_EXISTING: "changelog:readExisting",
  CHANGELOG_SUGGEST_VERSION: "changelog:suggestVersion",
  CHANGELOG_SUGGEST_VERSION_FROM_COMMITS: "changelog:suggestVersionFromCommits",
  // Changelog git operations (for git-based changelog generation)
  CHANGELOG_GET_BRANCHES: "changelog:getBranches",
  CHANGELOG_GET_TAGS: "changelog:getTags",
  CHANGELOG_GET_COMMITS_PREVIEW: "changelog:getCommitsPreview",
  CHANGELOG_SAVE_IMAGE: "changelog:saveImage",
  CHANGELOG_READ_LOCAL_IMAGE: "changelog:readLocalImage",
  // Changelog events (main -> renderer)
  CHANGELOG_GENERATION_PROGRESS: "changelog:generationProgress",
  CHANGELOG_GENERATION_COMPLETE: "changelog:generationComplete",
  CHANGELOG_GENERATION_ERROR: "changelog:generationError",
  // Insights operations
  INSIGHTS_GET_SESSION: "insights:getSession",
  INSIGHTS_SEND_MESSAGE: "insights:sendMessage",
  INSIGHTS_CLEAR_SESSION: "insights:clearSession",
  INSIGHTS_CREATE_TASK: "insights:createTask",
  INSIGHTS_LIST_SESSIONS: "insights:listSessions",
  INSIGHTS_NEW_SESSION: "insights:newSession",
  INSIGHTS_SWITCH_SESSION: "insights:switchSession",
  INSIGHTS_DELETE_SESSION: "insights:deleteSession",
  INSIGHTS_RENAME_SESSION: "insights:renameSession",
  INSIGHTS_UPDATE_MODEL_CONFIG: "insights:updateModelConfig",
  // Insights events (main -> renderer)
  INSIGHTS_STREAM_CHUNK: "insights:streamChunk",
  INSIGHTS_STATUS: "insights:status",
  INSIGHTS_ERROR: "insights:error",
  INSIGHTS_SESSION_UPDATED: "insights:sessionUpdated",
  // Event: session updated (main -> renderer)
  // File explorer operations
  FILE_EXPLORER_LIST: "fileExplorer:list",
  FILE_EXPLORER_READ: "fileExplorer:read",
  // Git operations
  GIT_GET_BRANCHES: "git:getBranches",
  GIT_GET_BRANCHES_WITH_INFO: "git:getBranchesWithInfo",
  GIT_GET_CURRENT_BRANCH: "git:getCurrentBranch",
  GIT_DETECT_MAIN_BRANCH: "git:detectMainBranch",
  GIT_CHECK_STATUS: "git:checkStatus",
  GIT_INITIALIZE: "git:initialize",
  // App auto-update operations
  APP_UPDATE_CHECK: "app-update:check",
  APP_UPDATE_DOWNLOAD: "app-update:download",
  APP_UPDATE_DOWNLOAD_STABLE: "app-update:download-stable",
  // Download stable version (for downgrade from beta)
  APP_UPDATE_INSTALL: "app-update:install",
  APP_UPDATE_GET_VERSION: "app-update:get-version",
  APP_UPDATE_GET_DOWNLOADED: "app-update:get-downloaded",
  // Get downloaded update info (for showing Install button on Settings open)
  // App auto-update events (main -> renderer)
  APP_UPDATE_AVAILABLE: "app-update:available",
  APP_UPDATE_DOWNLOADED: "app-update:downloaded",
  APP_UPDATE_PROGRESS: "app-update:progress",
  APP_UPDATE_ERROR: "app-update:error",
  APP_UPDATE_STABLE_DOWNGRADE: "app-update:stable-downgrade",
  // Stable version available for downgrade from beta
  APP_UPDATE_READONLY_VOLUME: "app-update:readonly-volume",
  // App running from read-only volume (DMG), needs to be moved
  // Release operations
  RELEASE_SUGGEST_VERSION: "release:suggestVersion",
  RELEASE_CREATE: "release:create",
  RELEASE_PREFLIGHT: "release:preflight",
  RELEASE_GET_VERSIONS: "release:getVersions",
  // Release events (main -> renderer)
  RELEASE_PROGRESS: "release:progress",
  // Debug operations
  DEBUG_GET_INFO: "debug:getInfo",
  DEBUG_OPEN_LOGS_FOLDER: "debug:openLogsFolder",
  DEBUG_COPY_DEBUG_INFO: "debug:copyDebugInfo",
  DEBUG_GET_RECENT_ERRORS: "debug:getRecentErrors",
  DEBUG_LIST_LOG_FILES: "debug:listLogFiles",
  DEBUG_SIMULATE_RATE_LIMIT: "debug:simulateRateLimit",
  // Simulate rate limit for testing auto-swap
  // Claude Code CLI operations
  CLAUDE_CODE_CHECK_VERSION: "claudeCode:checkVersion",
  CLAUDE_CODE_INSTALL: "claudeCode:install",
  CLAUDE_CODE_GET_VERSIONS: "claudeCode:getVersions",
  CLAUDE_CODE_INSTALL_VERSION: "claudeCode:installVersion",
  CLAUDE_CODE_GET_INSTALLATIONS: "claudeCode:getInstallations",
  CLAUDE_CODE_SET_ACTIVE_PATH: "claudeCode:setActivePath",
  // MCP Server health checks
  MCP_CHECK_HEALTH: "mcp:checkHealth",
  // Quick connectivity check
  MCP_TEST_CONNECTION: "mcp:testConnection",
  // Full MCP protocol test
  // Sentry error reporting
  SENTRY_STATE_CHANGED: "sentry:state-changed",
  // Notify main process when setting changes
  GET_SENTRY_DSN: "sentry:get-dsn",
  // Get DSN from main process (env var)
  GET_SENTRY_CONFIG: "sentry:get-config",
  // Get full Sentry config (DSN + sample rates)
  // Spell check
  SPELLCHECK_SET_LANGUAGES: "spellcheck:setLanguages",
  // Set spell check language (syncs with i18n)
  // Screenshot capture
  SCREENSHOT_GET_SOURCES: "screenshot:getSources",
  // Get available screens/windows
  SCREENSHOT_CAPTURE: "screenshot:capture",
  // Capture screenshot from source
  // Queue routing (rate limit recovery)
  QUEUE_GET_RUNNING_TASKS_BY_PROFILE: "queue:getRunningTasksByProfile",
  QUEUE_GET_BEST_PROFILE_FOR_TASK: "queue:getBestProfileForTask",
  QUEUE_GET_BEST_UNIFIED_ACCOUNT: "queue:getBestUnifiedAccount",
  // Unified OAuth + API account selection
  QUEUE_ASSIGN_PROFILE_TO_TASK: "queue:assignProfileToTask",
  QUEUE_UPDATE_TASK_SESSION: "queue:updateTaskSession",
  QUEUE_GET_TASK_SESSION: "queue:getTaskSession",
  // Queue routing events (main -> renderer)
  QUEUE_PROFILE_SWAPPED: "queue:profileSwapped",
  // Task switched to different profile
  QUEUE_SESSION_CAPTURED: "queue:sessionCaptured",
  // Session ID captured from running task
  QUEUE_BLOCKED_NO_PROFILES: "queue:blockedNoProfiles"
  // All profiles unavailable
};
const createProjectAPI = () => ({
  // Project Management
  addProject: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_ADD, projectPath),
  removeProject: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_REMOVE, projectId),
  getProjects: () => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_LIST),
  updateProjectSettings: (projectId, settings) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_UPDATE_SETTINGS, projectId, settings),
  initializeProject: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_INITIALIZE, projectId),
  checkProjectVersion: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CHECK_VERSION, projectId),
  // Tab State (persisted in main process for reliability)
  getTabState: () => ipcRenderer.invoke(IPC_CHANNELS.TAB_STATE_GET),
  saveTabState: (tabState) => ipcRenderer.invoke(IPC_CHANNELS.TAB_STATE_SAVE, tabState),
  // Kanban Preferences (persisted in main process per project)
  getKanbanPreferences: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.KANBAN_PREFS_GET, projectId),
  saveKanbanPreferences: (projectId, preferences) => ipcRenderer.invoke(IPC_CHANNELS.KANBAN_PREFS_SAVE, projectId, preferences),
  // Context Operations
  getProjectContext: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.CONTEXT_GET, projectId),
  refreshProjectIndex: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.CONTEXT_REFRESH_INDEX, projectId),
  getMemoryStatus: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.CONTEXT_MEMORY_STATUS, projectId),
  searchMemories: (projectId, query) => ipcRenderer.invoke(IPC_CHANNELS.CONTEXT_SEARCH_MEMORIES, projectId, query),
  getRecentMemories: (projectId, limit) => ipcRenderer.invoke(IPC_CHANNELS.CONTEXT_GET_MEMORIES, projectId, limit),
  // Environment Configuration
  getProjectEnv: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.ENV_GET, projectId),
  updateProjectEnv: (projectId, config) => ipcRenderer.invoke(IPC_CHANNELS.ENV_UPDATE, projectId, config),
  checkClaudeAuth: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.ENV_CHECK_CLAUDE_AUTH, projectId),
  invokeClaudeSetup: (projectId) => ipcRenderer.invoke(IPC_CHANNELS.ENV_INVOKE_CLAUDE_SETUP, projectId),
  // Dialog Operations
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SELECT_DIRECTORY),
  createProjectFolder: (location, name, initGit) => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_CREATE_PROJECT_FOLDER, location, name, initGit),
  getDefaultProjectLocation: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_GET_DEFAULT_PROJECT_LOCATION),
  // Memory Infrastructure Operations (LadybugDB - no Docker required)
  getMemoryInfrastructureStatus: (dbPath) => ipcRenderer.invoke(IPC_CHANNELS.MEMORY_STATUS, dbPath),
  listMemoryDatabases: (dbPath) => ipcRenderer.invoke(IPC_CHANNELS.MEMORY_LIST_DATABASES, dbPath),
  testMemoryConnection: (dbPath, database) => ipcRenderer.invoke(IPC_CHANNELS.MEMORY_TEST_CONNECTION, dbPath, database),
  // Graphiti Validation Operations
  validateLLMApiKey: (provider, apiKey) => ipcRenderer.invoke(IPC_CHANNELS.GRAPHITI_VALIDATE_LLM, provider, apiKey),
  testGraphitiConnection: (config) => ipcRenderer.invoke(IPC_CHANNELS.GRAPHITI_TEST_CONNECTION, config),
  // Ollama Model Management
  scanOllamaModels: (baseUrl) => ipcRenderer.invoke("scan-ollama-models", baseUrl),
  downloadOllamaModel: (baseUrl, modelName) => ipcRenderer.invoke("download-ollama-model", baseUrl, modelName),
  onDownloadProgress: (callback) => {
    const listener = (_, data) => callback(data);
    ipcRenderer.on(IPC_CHANNELS.OLLAMA_PULL_PROGRESS, listener);
    return () => ipcRenderer.off(IPC_CHANNELS.OLLAMA_PULL_PROGRESS, listener);
  },
  // Git Operations
  getGitBranches: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_GET_BRANCHES, projectPath),
  getGitBranchesWithInfo: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_GET_BRANCHES_WITH_INFO, projectPath),
  getCurrentGitBranch: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_GET_CURRENT_BRANCH, projectPath),
  detectMainBranch: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_DETECT_MAIN_BRANCH, projectPath),
  checkGitStatus: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_CHECK_STATUS, projectPath),
  initializeGit: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.GIT_INITIALIZE, projectPath),
  // Ollama Model Detection
  checkOllamaStatus: (baseUrl) => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_CHECK_STATUS, baseUrl),
  checkOllamaInstalled: () => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_CHECK_INSTALLED),
  installOllama: () => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_INSTALL),
  listOllamaModels: (baseUrl) => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_LIST_MODELS, baseUrl),
  listOllamaEmbeddingModels: (baseUrl) => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_LIST_EMBEDDING_MODELS, baseUrl),
  pullOllamaModel: (modelName, baseUrl) => ipcRenderer.invoke(IPC_CHANNELS.OLLAMA_PULL_MODEL, modelName, baseUrl)
});
ipcRenderer.setMaxListeners(50);
const createTerminalAPI = () => ({
  // Terminal Operations
  createTerminal: (options) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_CREATE, options),
  destroyTerminal: (id) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_DESTROY, id),
  sendTerminalInput: (id, data) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_INPUT, id, data),
  resizeTerminal: (id, cols, rows) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_RESIZE, id, cols, rows),
  invokeClaudeInTerminal: (id, cwd) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_INVOKE_CLAUDE, id, cwd),
  generateTerminalName: (command, cwd) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_GENERATE_NAME, command, cwd),
  setTerminalTitle: (id, title) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_SET_TITLE, id, title),
  setTerminalWorktreeConfig: (id, config) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_SET_WORKTREE_CONFIG, id, config),
  // Terminal Session Management
  getTerminalSessions: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_GET_SESSIONS, projectPath),
  restoreTerminalSession: (session, cols, rows) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_RESTORE_SESSION, session, cols, rows),
  clearTerminalSessions: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_CLEAR_SESSIONS, projectPath),
  resumeClaudeInTerminal: (id, sessionId) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_RESUME_CLAUDE, id, sessionId),
  activateDeferredClaudeResume: (id) => ipcRenderer.send(IPC_CHANNELS.TERMINAL_ACTIVATE_DEFERRED_RESUME, id),
  getTerminalSessionDates: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_GET_SESSION_DATES, projectPath),
  getTerminalSessionsForDate: (date, projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_GET_SESSIONS_FOR_DATE, date, projectPath),
  restoreTerminalSessionsFromDate: (date, projectPath, cols, rows) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_RESTORE_FROM_DATE, date, projectPath, cols, rows),
  checkTerminalPtyAlive: (terminalId) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_CHECK_PTY_ALIVE, terminalId),
  updateTerminalDisplayOrders: (projectPath, orders) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_UPDATE_DISPLAY_ORDERS, projectPath, orders),
  // Terminal Worktree Operations (isolated development)
  createTerminalWorktree: (request) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_WORKTREE_CREATE, request),
  listTerminalWorktrees: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_WORKTREE_LIST, projectPath),
  removeTerminalWorktree: (projectPath, name, deleteBranch = false) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_WORKTREE_REMOVE, projectPath, name, deleteBranch),
  listOtherWorktrees: (projectPath) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_WORKTREE_LIST_OTHER, projectPath),
  // Terminal Event Listeners
  onTerminalOutput: (callback) => {
    const handler = (_event, id, data) => {
      callback(id, data);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_OUTPUT, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_OUTPUT, handler);
    };
  },
  onTerminalExit: (callback) => {
    const handler = (_event, id, exitCode) => {
      callback(id, exitCode);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_EXIT, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_EXIT, handler);
    };
  },
  onTerminalTitleChange: (callback) => {
    const handler = (_event, id, title) => {
      callback(id, title);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_TITLE_CHANGE, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_TITLE_CHANGE, handler);
    };
  },
  onTerminalWorktreeConfigChange: (callback) => {
    const handler = (_event, id, config) => {
      callback(id, config);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_WORKTREE_CONFIG_CHANGE, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_WORKTREE_CONFIG_CHANGE, handler);
    };
  },
  onTerminalClaudeSession: (callback) => {
    const handler = (_event, id, sessionId) => {
      callback(id, sessionId);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_CLAUDE_SESSION, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_CLAUDE_SESSION, handler);
    };
  },
  onTerminalRateLimit: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_RATE_LIMIT, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_RATE_LIMIT, handler);
    };
  },
  onTerminalOAuthToken: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_OAUTH_TOKEN, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_OAUTH_TOKEN, handler);
    };
  },
  onTerminalAuthCreated: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_AUTH_CREATED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_AUTH_CREATED, handler);
    };
  },
  onTerminalOAuthCodeNeeded: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_OAUTH_CODE_NEEDED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_OAUTH_CODE_NEEDED, handler);
    };
  },
  submitOAuthCode: (terminalId, code) => ipcRenderer.invoke(IPC_CHANNELS.TERMINAL_OAUTH_CODE_SUBMIT, terminalId, code),
  onTerminalClaudeBusy: (callback) => {
    const handler = (_event, id, isBusy) => {
      callback(id, isBusy);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_CLAUDE_BUSY, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_CLAUDE_BUSY, handler);
    };
  },
  onTerminalClaudeExit: (callback) => {
    const handler = (_event, id) => {
      callback(id);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_CLAUDE_EXIT, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_CLAUDE_EXIT, handler);
    };
  },
  onTerminalOnboardingComplete: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_ONBOARDING_COMPLETE, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_ONBOARDING_COMPLETE, handler);
    };
  },
  onTerminalPendingResume: (callback) => {
    const handler = (_event, id, sessionId) => {
      callback(id, sessionId);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_PENDING_RESUME, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_PENDING_RESUME, handler);
    };
  },
  onTerminalProfileChanged: (callback) => {
    const handler = (_event, data) => {
      callback(data);
    };
    ipcRenderer.on(IPC_CHANNELS.TERMINAL_PROFILE_CHANGED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TERMINAL_PROFILE_CHANGED, handler);
    };
  },
  // Claude Profile Management
  getClaudeProfiles: () => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILES_GET),
  saveClaudeProfile: (profile) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_SAVE, profile),
  deleteClaudeProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_DELETE, profileId),
  renameClaudeProfile: (profileId, newName) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_RENAME, profileId, newName),
  setActiveClaudeProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_SET_ACTIVE, profileId),
  switchClaudeProfile: (terminalId, profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_SWITCH, terminalId, profileId),
  initializeClaudeProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_INITIALIZE, profileId),
  setClaudeProfileToken: (profileId, token, email) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_SET_TOKEN, profileId, token, email),
  authenticateClaudeProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_AUTHENTICATE, profileId),
  verifyClaudeProfileAuth: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_VERIFY_AUTH, profileId),
  getAutoSwitchSettings: () => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_AUTO_SWITCH_SETTINGS),
  updateAutoSwitchSettings: (settings) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_UPDATE_AUTO_SWITCH, settings),
  getAccountPriorityOrder: () => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_PRIORITY_GET),
  setAccountPriorityOrder: (order) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNT_PRIORITY_SET, order),
  fetchClaudeUsage: (terminalId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_FETCH_USAGE, terminalId),
  getBestAvailableProfile: (excludeProfileId) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_PROFILE_GET_BEST_PROFILE, excludeProfileId),
  onSDKRateLimit: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.CLAUDE_SDK_RATE_LIMIT, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.CLAUDE_SDK_RATE_LIMIT, handler);
    };
  },
  onAuthFailure: (callback) => {
    const handler = (_event, info) => {
      callback(info);
    };
    ipcRenderer.on(IPC_CHANNELS.CLAUDE_AUTH_FAILURE, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.CLAUDE_AUTH_FAILURE, handler);
    };
  },
  retryWithProfile: (request) => ipcRenderer.invoke(IPC_CHANNELS.CLAUDE_RETRY_WITH_PROFILE, request),
  // Usage Monitoring (Proactive Account Switching)
  requestUsageUpdate: () => ipcRenderer.invoke(IPC_CHANNELS.USAGE_REQUEST),
  requestAllProfilesUsage: (forceRefresh) => ipcRenderer.invoke(IPC_CHANNELS.ALL_PROFILES_USAGE_REQUEST, forceRefresh ?? false),
  onUsageUpdated: (callback) => {
    const handler = (_event, usage) => {
      callback(usage);
    };
    ipcRenderer.on(IPC_CHANNELS.USAGE_UPDATED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.USAGE_UPDATED, handler);
    };
  },
  onAllProfilesUsageUpdated: (callback) => {
    const handler = (_event, allProfilesUsage) => {
      callback(allProfilesUsage);
    };
    ipcRenderer.on(IPC_CHANNELS.ALL_PROFILES_USAGE_UPDATED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.ALL_PROFILES_USAGE_UPDATED, handler);
    };
  },
  onProactiveSwapNotification: (callback) => {
    const handler = (_event, notification) => {
      callback(notification);
    };
    ipcRenderer.on(IPC_CHANNELS.PROACTIVE_SWAP_NOTIFICATION, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.PROACTIVE_SWAP_NOTIFICATION, handler);
    };
  }
});
const createTaskAPI = () => ({
  // Task Operations
  getTasks: (projectId, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LIST, projectId, options),
  createTask: (projectId, title, description, metadata) => ipcRenderer.invoke(IPC_CHANNELS.TASK_CREATE, projectId, title, description, metadata),
  deleteTask: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_DELETE, taskId),
  updateTask: (taskId, updates) => ipcRenderer.invoke(IPC_CHANNELS.TASK_UPDATE, taskId, updates),
  startTask: (taskId, options) => ipcRenderer.send(IPC_CHANNELS.TASK_START, taskId, options),
  stopTask: (taskId) => ipcRenderer.send(IPC_CHANNELS.TASK_STOP, taskId),
  submitReview: (taskId, approved, feedback, images) => ipcRenderer.invoke(IPC_CHANNELS.TASK_REVIEW, taskId, approved, feedback, images),
  updateTaskStatus: (taskId, status, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_UPDATE_STATUS, taskId, status, options),
  recoverStuckTask: (taskId, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_RECOVER_STUCK, taskId, options),
  checkTaskRunning: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_CHECK_RUNNING, taskId),
  resumePausedTask: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_RESUME_PAUSED, taskId),
  // Worktree Change Detection
  checkWorktreeChanges: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_CHECK_WORKTREE_CHANGES, taskId),
  // Image Operations
  loadImageThumbnail: (projectPath, specId, imagePath) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LOAD_IMAGE_THUMBNAIL, projectPath, specId, imagePath),
  // Workspace Management
  getWorktreeStatus: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_STATUS, taskId),
  getWorktreeDiff: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_DIFF, taskId),
  mergeWorktree: (taskId, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_MERGE, taskId, options),
  mergeWorktreePreview: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_MERGE_PREVIEW, taskId),
  discardWorktree: (taskId, skipStatusChange) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_DISCARD, taskId, skipStatusChange),
  discardOrphanedWorktree: (projectId, specName) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_DISCARD_ORPHAN, projectId, specName),
  clearStagedState: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_CLEAR_STAGED_STATE, taskId),
  listWorktrees: (projectId, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LIST_WORKTREES, projectId, options),
  worktreeOpenInIDE: (worktreePath, ide, customPath) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_OPEN_IN_IDE, worktreePath, ide, customPath),
  worktreeOpenInTerminal: (worktreePath, terminal, customPath) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_OPEN_IN_TERMINAL, worktreePath, terminal, customPath),
  worktreeDetectTools: () => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_DETECT_TOOLS),
  archiveTasks: (projectId, taskIds, version) => ipcRenderer.invoke(IPC_CHANNELS.TASK_ARCHIVE, projectId, taskIds, version),
  unarchiveTasks: (projectId, taskIds) => ipcRenderer.invoke(IPC_CHANNELS.TASK_UNARCHIVE, projectId, taskIds),
  createWorktreePR: (taskId, options) => ipcRenderer.invoke(IPC_CHANNELS.TASK_WORKTREE_CREATE_PR, taskId, options),
  // Task Event Listeners
  onTaskProgress: (callback) => {
    const handler = (_event, taskId, plan, projectId) => {
      callback(taskId, plan, projectId);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_PROGRESS, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_PROGRESS, handler);
    };
  },
  onTaskError: (callback) => {
    const handler = (_event, taskId, error, projectId) => {
      callback(taskId, error, projectId);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_ERROR, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_ERROR, handler);
    };
  },
  onTaskLog: (callback) => {
    const handler = (_event, taskId, log, projectId) => {
      callback(taskId, log, projectId);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_LOG, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_LOG, handler);
    };
  },
  onTaskStatusChange: (callback) => {
    const handler = (_event, taskId, status, projectId, reviewReason) => {
      callback(taskId, status, projectId, reviewReason);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_STATUS_CHANGE, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_STATUS_CHANGE, handler);
    };
  },
  onTaskExecutionProgress: (callback) => {
    const handler = (_event, taskId, progress, projectId) => {
      callback(taskId, progress, projectId);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_EXECUTION_PROGRESS, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_EXECUTION_PROGRESS, handler);
    };
  },
  // Task Phase Logs
  getTaskLogs: (projectId, specId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LOGS_GET, projectId, specId),
  watchTaskLogs: (projectId, specId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LOGS_WATCH, projectId, specId),
  unwatchTaskLogs: (specId) => ipcRenderer.invoke(IPC_CHANNELS.TASK_LOGS_UNWATCH, specId),
  onTaskLogsChanged: (callback) => {
    const handler = (_event, specId, logs) => {
      callback(specId, logs);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_LOGS_CHANGED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_LOGS_CHANGED, handler);
    };
  },
  onTaskLogsStream: (callback) => {
    const handler = (_event, specId, chunk) => {
      callback(specId, chunk);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_LOGS_STREAM, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_LOGS_STREAM, handler);
    };
  },
  // Merge Progress Events
  onMergeProgress: (callback) => {
    const handler = (_event, taskId, progress) => {
      callback(taskId, progress);
    };
    ipcRenderer.on(IPC_CHANNELS.TASK_MERGE_PROGRESS, handler);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.TASK_MERGE_PROGRESS, handler);
    };
  }
});
const createSettingsAPI = () => ({
  // App Settings
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET),
  saveSettings: (settings) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE, settings),
  // CLI Tools Detection
  getCliToolsInfo: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_CLI_TOOLS_INFO),
  // Claude Code onboarding status
  getClaudeCodeOnboardingStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_CLAUDE_CODE_GET_ONBOARDING_STATUS),
  // App Info
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP_VERSION),
  // Auto-Build Source Environment
  getSourceEnv: () => ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_GET),
  updateSourceEnv: (config) => ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_UPDATE, config),
  checkSourceToken: () => ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_CHECK_TOKEN),
  // Sentry error reporting - notify main process when setting changes
  notifySentryStateChanged: (enabled) => ipcRenderer.send(IPC_CHANNELS.SENTRY_STATE_CHANGED, enabled),
  // Get Sentry DSN from main process (loaded from environment variable)
  getSentryDsn: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SENTRY_DSN),
  // Get full Sentry config from main process (DSN + sample rates)
  getSentryConfig: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SENTRY_CONFIG),
  // Spell check - sync spell checker language with app language
  setSpellCheckLanguages: (language) => ipcRenderer.invoke(IPC_CHANNELS.SPELLCHECK_SET_LANGUAGES, language)
});
const createFileAPI = () => ({
  // File Explorer Operations
  listDirectory: (dirPath) => ipcRenderer.invoke(IPC_CHANNELS.FILE_EXPLORER_LIST, dirPath),
  readFile: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.FILE_EXPLORER_READ, filePath)
});
function createIpcListener(channel, callback) {
  const handler = (_event, ...args) => {
    callback(...args);
  };
  ipcRenderer.on(channel, handler);
  return () => {
    ipcRenderer.removeListener(channel, handler);
  };
}
function invokeIpc(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args);
}
function sendIpc(channel, ...args) {
  ipcRenderer.send(channel, ...args);
}
const createRoadmapAPI = () => ({
  // Operations
  getRoadmap: (projectId) => invokeIpc(IPC_CHANNELS.ROADMAP_GET, projectId),
  getRoadmapStatus: (projectId) => invokeIpc(IPC_CHANNELS.ROADMAP_GET_STATUS, projectId),
  saveRoadmap: (projectId, roadmap) => invokeIpc(IPC_CHANNELS.ROADMAP_SAVE, projectId, roadmap),
  generateRoadmap: (projectId, enableCompetitorAnalysis, refreshCompetitorAnalysis) => sendIpc(IPC_CHANNELS.ROADMAP_GENERATE, projectId, enableCompetitorAnalysis, refreshCompetitorAnalysis),
  refreshRoadmap: (projectId, enableCompetitorAnalysis, refreshCompetitorAnalysis) => sendIpc(IPC_CHANNELS.ROADMAP_REFRESH, projectId, enableCompetitorAnalysis, refreshCompetitorAnalysis),
  stopRoadmap: (projectId) => invokeIpc(IPC_CHANNELS.ROADMAP_STOP, projectId),
  updateFeatureStatus: (projectId, featureId, status) => invokeIpc(IPC_CHANNELS.ROADMAP_UPDATE_FEATURE, projectId, featureId, status),
  convertFeatureToSpec: (projectId, featureId) => invokeIpc(IPC_CHANNELS.ROADMAP_CONVERT_TO_SPEC, projectId, featureId),
  // Progress persistence
  saveRoadmapProgress: (projectId, progress) => invokeIpc(IPC_CHANNELS.ROADMAP_PROGRESS_SAVE, projectId, progress),
  loadRoadmapProgress: (projectId) => invokeIpc(IPC_CHANNELS.ROADMAP_PROGRESS_LOAD, projectId),
  clearRoadmapProgress: (projectId) => invokeIpc(IPC_CHANNELS.ROADMAP_PROGRESS_CLEAR, projectId),
  // Event Listeners
  onRoadmapProgress: (callback) => createIpcListener(IPC_CHANNELS.ROADMAP_PROGRESS, callback),
  onRoadmapComplete: (callback) => createIpcListener(IPC_CHANNELS.ROADMAP_COMPLETE, callback),
  onRoadmapError: (callback) => createIpcListener(IPC_CHANNELS.ROADMAP_ERROR, callback),
  onRoadmapStopped: (callback) => createIpcListener(IPC_CHANNELS.ROADMAP_STOPPED, callback)
});
const createIdeationAPI = () => ({
  // Operations
  getIdeation: (projectId) => invokeIpc(IPC_CHANNELS.IDEATION_GET, projectId),
  generateIdeation: (projectId, config) => sendIpc(IPC_CHANNELS.IDEATION_GENERATE, projectId, config),
  refreshIdeation: (projectId, config) => sendIpc(IPC_CHANNELS.IDEATION_REFRESH, projectId, config),
  stopIdeation: (projectId) => invokeIpc(IPC_CHANNELS.IDEATION_STOP, projectId),
  updateIdeaStatus: (projectId, ideaId, status) => invokeIpc(IPC_CHANNELS.IDEATION_UPDATE_IDEA, projectId, ideaId, status),
  convertIdeaToTask: (projectId, ideaId) => invokeIpc(IPC_CHANNELS.IDEATION_CONVERT_TO_TASK, projectId, ideaId),
  dismissIdea: (projectId, ideaId) => invokeIpc(IPC_CHANNELS.IDEATION_DISMISS, projectId, ideaId),
  dismissAllIdeas: (projectId) => invokeIpc(IPC_CHANNELS.IDEATION_DISMISS_ALL, projectId),
  archiveIdea: (projectId, ideaId) => invokeIpc(IPC_CHANNELS.IDEATION_ARCHIVE, projectId, ideaId),
  deleteIdea: (projectId, ideaId) => invokeIpc(IPC_CHANNELS.IDEATION_DELETE, projectId, ideaId),
  deleteMultipleIdeas: (projectId, ideaIds) => invokeIpc(IPC_CHANNELS.IDEATION_DELETE_MULTIPLE, projectId, ideaIds),
  // Event Listeners
  onIdeationProgress: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_PROGRESS, callback),
  onIdeationLog: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_LOG, callback),
  onIdeationComplete: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_COMPLETE, callback),
  onIdeationError: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_ERROR, callback),
  onIdeationStopped: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_STOPPED, callback),
  onIdeationTypeComplete: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_TYPE_COMPLETE, callback),
  onIdeationTypeFailed: (callback) => createIpcListener(IPC_CHANNELS.IDEATION_TYPE_FAILED, callback)
});
const createInsightsAPI = () => ({
  // Operations
  getInsightsSession: (projectId) => invokeIpc(IPC_CHANNELS.INSIGHTS_GET_SESSION, projectId),
  sendInsightsMessage: (projectId, message, modelConfig) => sendIpc(IPC_CHANNELS.INSIGHTS_SEND_MESSAGE, projectId, message, modelConfig),
  clearInsightsSession: (projectId) => invokeIpc(IPC_CHANNELS.INSIGHTS_CLEAR_SESSION, projectId),
  createTaskFromInsights: (projectId, title, description, metadata) => invokeIpc(IPC_CHANNELS.INSIGHTS_CREATE_TASK, projectId, title, description, metadata),
  listInsightsSessions: (projectId) => invokeIpc(IPC_CHANNELS.INSIGHTS_LIST_SESSIONS, projectId),
  newInsightsSession: (projectId) => invokeIpc(IPC_CHANNELS.INSIGHTS_NEW_SESSION, projectId),
  switchInsightsSession: (projectId, sessionId) => invokeIpc(IPC_CHANNELS.INSIGHTS_SWITCH_SESSION, projectId, sessionId),
  deleteInsightsSession: (projectId, sessionId) => invokeIpc(IPC_CHANNELS.INSIGHTS_DELETE_SESSION, projectId, sessionId),
  renameInsightsSession: (projectId, sessionId, newTitle) => invokeIpc(IPC_CHANNELS.INSIGHTS_RENAME_SESSION, projectId, sessionId, newTitle),
  updateInsightsModelConfig: (projectId, sessionId, modelConfig) => invokeIpc(IPC_CHANNELS.INSIGHTS_UPDATE_MODEL_CONFIG, projectId, sessionId, modelConfig),
  // Event Listeners
  onInsightsStreamChunk: (callback) => createIpcListener(IPC_CHANNELS.INSIGHTS_STREAM_CHUNK, callback),
  onInsightsStatus: (callback) => createIpcListener(IPC_CHANNELS.INSIGHTS_STATUS, callback),
  onInsightsError: (callback) => createIpcListener(IPC_CHANNELS.INSIGHTS_ERROR, callback),
  onInsightsSessionUpdated: (callback) => createIpcListener(IPC_CHANNELS.INSIGHTS_SESSION_UPDATED, callback)
});
const createChangelogAPI = () => ({
  // Operations
  getChangelogDoneTasks: (projectId, tasks) => invokeIpc(IPC_CHANNELS.CHANGELOG_GET_DONE_TASKS, projectId, tasks),
  loadTaskSpecs: (projectId, taskIds) => invokeIpc(IPC_CHANNELS.CHANGELOG_LOAD_TASK_SPECS, projectId, taskIds),
  generateChangelog: (request) => invokeIpc(IPC_CHANNELS.CHANGELOG_GENERATE, request),
  saveChangelog: (request) => invokeIpc(IPC_CHANNELS.CHANGELOG_SAVE, request),
  readExistingChangelog: (projectId) => invokeIpc(IPC_CHANNELS.CHANGELOG_READ_EXISTING, projectId),
  suggestChangelogVersion: (projectId, taskIds) => invokeIpc(IPC_CHANNELS.CHANGELOG_SUGGEST_VERSION, projectId, taskIds),
  suggestChangelogVersionFromCommits: (projectId, commits) => invokeIpc(IPC_CHANNELS.CHANGELOG_SUGGEST_VERSION_FROM_COMMITS, projectId, commits),
  getChangelogBranches: (projectId) => invokeIpc(IPC_CHANNELS.CHANGELOG_GET_BRANCHES, projectId),
  getChangelogTags: (projectId) => invokeIpc(IPC_CHANNELS.CHANGELOG_GET_TAGS, projectId),
  getChangelogCommitsPreview: (projectId, options, mode) => invokeIpc(IPC_CHANNELS.CHANGELOG_GET_COMMITS_PREVIEW, projectId, options, mode),
  saveChangelogImage: (projectId, imageData, filename) => invokeIpc(IPC_CHANNELS.CHANGELOG_SAVE_IMAGE, projectId, imageData, filename),
  readLocalImage: (projectPath, relativePath) => invokeIpc(IPC_CHANNELS.CHANGELOG_READ_LOCAL_IMAGE, projectPath, relativePath),
  // Event Listeners
  onChangelogGenerationProgress: (callback) => createIpcListener(IPC_CHANNELS.CHANGELOG_GENERATION_PROGRESS, callback),
  onChangelogGenerationComplete: (callback) => createIpcListener(IPC_CHANNELS.CHANGELOG_GENERATION_COMPLETE, callback),
  onChangelogGenerationError: (callback) => createIpcListener(IPC_CHANNELS.CHANGELOG_GENERATION_ERROR, callback)
});
const createLinearAPI = () => ({
  getLinearTeams: (projectId) => invokeIpc(IPC_CHANNELS.LINEAR_GET_TEAMS, projectId),
  getLinearProjects: (projectId, teamId) => invokeIpc(IPC_CHANNELS.LINEAR_GET_PROJECTS, projectId, teamId),
  getLinearIssues: (projectId, teamId, linearProjectId) => invokeIpc(IPC_CHANNELS.LINEAR_GET_ISSUES, projectId, teamId, linearProjectId),
  importLinearIssues: (projectId, issueIds) => invokeIpc(IPC_CHANNELS.LINEAR_IMPORT_ISSUES, projectId, issueIds),
  checkLinearConnection: (projectId) => invokeIpc(IPC_CHANNELS.LINEAR_CHECK_CONNECTION, projectId)
});
const createGitHubAPI = () => ({
  // Operations
  getGitHubRepositories: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_GET_REPOSITORIES, projectId),
  getGitHubIssues: (projectId, state, page, fetchAll) => invokeIpc(IPC_CHANNELS.GITHUB_GET_ISSUES, projectId, state, page, fetchAll),
  getGitHubIssue: (projectId, issueNumber) => invokeIpc(IPC_CHANNELS.GITHUB_GET_ISSUE, projectId, issueNumber),
  getIssueComments: (projectId, issueNumber) => invokeIpc(IPC_CHANNELS.GITHUB_GET_ISSUE_COMMENTS, projectId, issueNumber),
  checkGitHubConnection: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_CHECK_CONNECTION, projectId),
  investigateGitHubIssue: (projectId, issueNumber, selectedCommentIds) => sendIpc(IPC_CHANNELS.GITHUB_INVESTIGATE_ISSUE, projectId, issueNumber, selectedCommentIds),
  importGitHubIssues: (projectId, issueNumbers) => invokeIpc(IPC_CHANNELS.GITHUB_IMPORT_ISSUES, projectId, issueNumbers),
  createGitHubRelease: (projectId, version, releaseNotes, options) => invokeIpc(IPC_CHANNELS.GITHUB_CREATE_RELEASE, projectId, version, releaseNotes, options),
  suggestReleaseVersion: (projectId) => invokeIpc(IPC_CHANNELS.RELEASE_SUGGEST_VERSION, projectId),
  // OAuth operations (gh CLI)
  checkGitHubCli: () => invokeIpc(IPC_CHANNELS.GITHUB_CHECK_CLI),
  checkGitHubAuth: () => invokeIpc(IPC_CHANNELS.GITHUB_CHECK_AUTH),
  startGitHubAuth: () => invokeIpc(IPC_CHANNELS.GITHUB_START_AUTH),
  getGitHubToken: () => invokeIpc(IPC_CHANNELS.GITHUB_GET_TOKEN),
  getGitHubUser: () => invokeIpc(IPC_CHANNELS.GITHUB_GET_USER),
  listGitHubUserRepos: () => invokeIpc(IPC_CHANNELS.GITHUB_LIST_USER_REPOS),
  // OAuth event listener - receives device code immediately when extracted (during auth process)
  onGitHubAuthDeviceCode: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTH_DEVICE_CODE, callback),
  // OAuth event listener - notifies when GitHub account changes (via gh auth login)
  onGitHubAuthChanged: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTH_CHANGED, callback),
  // Repository detection and management
  detectGitHubRepo: (projectPath) => invokeIpc(IPC_CHANNELS.GITHUB_DETECT_REPO, projectPath),
  getGitHubBranches: (repo, token) => invokeIpc(IPC_CHANNELS.GITHUB_GET_BRANCHES, repo, token),
  createGitHubRepo: (repoName, options) => invokeIpc(IPC_CHANNELS.GITHUB_CREATE_REPO, repoName, options),
  addGitRemote: (projectPath, repoFullName) => invokeIpc(IPC_CHANNELS.GITHUB_ADD_REMOTE, projectPath, repoFullName),
  listGitHubOrgs: () => invokeIpc(IPC_CHANNELS.GITHUB_LIST_ORGS),
  // Event Listeners
  onGitHubInvestigationProgress: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_INVESTIGATION_PROGRESS, callback),
  onGitHubInvestigationComplete: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_INVESTIGATION_COMPLETE, callback),
  onGitHubInvestigationError: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_INVESTIGATION_ERROR, callback),
  // Auto-fix operations
  getAutoFixConfig: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_GET_CONFIG, projectId),
  saveAutoFixConfig: (projectId, config) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_SAVE_CONFIG, projectId, config),
  getAutoFixQueue: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_GET_QUEUE, projectId),
  checkAutoFixLabels: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_CHECK_LABELS, projectId),
  checkNewIssues: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_CHECK_NEW, projectId),
  startAutoFix: (projectId, issueNumber) => sendIpc(IPC_CHANNELS.GITHUB_AUTOFIX_START, projectId, issueNumber),
  // Batch auto-fix operations
  batchAutoFix: (projectId, issueNumbers) => sendIpc(IPC_CHANNELS.GITHUB_AUTOFIX_BATCH, projectId, issueNumbers),
  getBatches: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_GET_BATCHES, projectId),
  // Auto-fix event listeners
  onAutoFixProgress: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_PROGRESS, callback),
  onAutoFixComplete: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_COMPLETE, callback),
  onAutoFixError: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_ERROR, callback),
  // Batch auto-fix event listeners
  onBatchProgress: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_BATCH_PROGRESS, callback),
  onBatchComplete: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_BATCH_COMPLETE, callback),
  onBatchError: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_BATCH_ERROR, callback),
  // Analyze & Group Issues (proactive batch workflow)
  analyzeIssuesPreview: (projectId, issueNumbers, maxIssues) => sendIpc(IPC_CHANNELS.GITHUB_AUTOFIX_ANALYZE_PREVIEW, projectId, issueNumbers, maxIssues),
  approveBatches: (projectId, approvedBatches) => invokeIpc(IPC_CHANNELS.GITHUB_AUTOFIX_APPROVE_BATCHES, projectId, approvedBatches),
  // Analyze preview event listeners
  onAnalyzePreviewProgress: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_ANALYZE_PREVIEW_PROGRESS, callback),
  onAnalyzePreviewComplete: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_ANALYZE_PREVIEW_COMPLETE, callback),
  onAnalyzePreviewError: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_AUTOFIX_ANALYZE_PREVIEW_ERROR, callback),
  // PR operations
  // Fetches up to 100 open PRs at once (GitHub GraphQL limit)
  listPRs: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_PR_LIST, projectId),
  // Load more PRs using cursor-based pagination
  listMorePRs: (projectId, cursor) => invokeIpc(IPC_CHANNELS.GITHUB_PR_LIST_MORE, projectId, cursor),
  getPR: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_GET, projectId, prNumber),
  runPRReview: (projectId, prNumber) => sendIpc(IPC_CHANNELS.GITHUB_PR_REVIEW, projectId, prNumber),
  cancelPRReview: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_REVIEW_CANCEL, projectId, prNumber),
  postPRReview: (projectId, prNumber, selectedFindingIds, options) => invokeIpc(IPC_CHANNELS.GITHUB_PR_POST_REVIEW, projectId, prNumber, selectedFindingIds, options),
  deletePRReview: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_DELETE_REVIEW, projectId, prNumber),
  postPRComment: (projectId, prNumber, body) => invokeIpc(IPC_CHANNELS.GITHUB_PR_POST_COMMENT, projectId, prNumber, body),
  mergePR: (projectId, prNumber, mergeMethod = "squash") => invokeIpc(IPC_CHANNELS.GITHUB_PR_MERGE, projectId, prNumber, mergeMethod),
  assignPR: (projectId, prNumber, username) => invokeIpc(IPC_CHANNELS.GITHUB_PR_ASSIGN, projectId, prNumber, username),
  markReviewPosted: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_MARK_REVIEW_POSTED, projectId, prNumber),
  getPRReview: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_GET_REVIEW, projectId, prNumber),
  getPRReviewsBatch: (projectId, prNumbers) => invokeIpc(IPC_CHANNELS.GITHUB_PR_GET_REVIEWS_BATCH, projectId, prNumbers),
  // Follow-up review operations
  checkNewCommits: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_CHECK_NEW_COMMITS, projectId, prNumber),
  checkMergeReadiness: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_CHECK_MERGE_READINESS, projectId, prNumber),
  updatePRBranch: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_UPDATE_BRANCH, projectId, prNumber),
  runFollowupReview: (projectId, prNumber) => sendIpc(IPC_CHANNELS.GITHUB_PR_FOLLOWUP_REVIEW, projectId, prNumber),
  // PR logs
  getPRLogs: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_PR_GET_LOGS, projectId, prNumber),
  // Workflow approval (for fork PRs)
  getWorkflowsAwaitingApproval: (projectId, prNumber) => invokeIpc(IPC_CHANNELS.GITHUB_WORKFLOWS_AWAITING_APPROVAL, projectId, prNumber),
  approveWorkflow: (projectId, runId) => invokeIpc(IPC_CHANNELS.GITHUB_WORKFLOW_APPROVE, projectId, runId),
  // PR event listeners
  onPRReviewProgress: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_PR_REVIEW_PROGRESS, callback),
  onPRReviewComplete: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_PR_REVIEW_COMPLETE, callback),
  onPRReviewError: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_PR_REVIEW_ERROR, callback),
  onPRLogsUpdated: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_PR_LOGS_UPDATED, callback),
  // PR status polling operations
  startStatusPolling: (projectId, prNumbers) => invokeIpc(IPC_CHANNELS.GITHUB_PR_STATUS_POLL_START, { projectId, prNumbers }),
  stopStatusPolling: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_PR_STATUS_POLL_STOP, { projectId }),
  getPollingMetadata: (projectId) => invokeIpc(IPC_CHANNELS.GITHUB_PR_STATUS_UPDATE, projectId),
  // PR status polling event listener
  onPRStatusUpdate: (callback) => createIpcListener(IPC_CHANNELS.GITHUB_PR_STATUS_UPDATE, callback)
});
const createGitLabAPI = () => ({
  // Project operations
  getGitLabProjects: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_GET_PROJECTS, projectId),
  checkGitLabConnection: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_CHECK_CONNECTION, projectId),
  // Issue operations
  getGitLabIssues: (projectId, state) => invokeIpc(IPC_CHANNELS.GITLAB_GET_ISSUES, projectId, state),
  getGitLabIssue: (projectId, issueIid) => invokeIpc(IPC_CHANNELS.GITLAB_GET_ISSUE, projectId, issueIid),
  getGitLabIssueNotes: (projectId, issueIid) => invokeIpc(IPC_CHANNELS.GITLAB_GET_ISSUE_NOTES, projectId, issueIid),
  investigateGitLabIssue: (projectId, issueIid, selectedNoteIds) => sendIpc(IPC_CHANNELS.GITLAB_INVESTIGATE_ISSUE, projectId, issueIid, selectedNoteIds),
  importGitLabIssues: (projectId, issueIids) => invokeIpc(IPC_CHANNELS.GITLAB_IMPORT_ISSUES, projectId, issueIids),
  // Merge Request operations
  getGitLabMergeRequests: (projectId, state) => invokeIpc(IPC_CHANNELS.GITLAB_GET_MERGE_REQUESTS, projectId, state),
  getGitLabMergeRequest: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_GET_MERGE_REQUEST, projectId, mrIid),
  createGitLabMergeRequest: (projectId, options) => invokeIpc(IPC_CHANNELS.GITLAB_CREATE_MERGE_REQUEST, projectId, options),
  updateGitLabMergeRequest: (projectId, mrIid, updates) => invokeIpc(IPC_CHANNELS.GITLAB_UPDATE_MERGE_REQUEST, projectId, mrIid, updates),
  // MR Review operations (AI-powered)
  getGitLabMRDiff: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_MR_GET_DIFF, projectId, mrIid),
  getGitLabMRReview: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_MR_GET_REVIEW, projectId, mrIid),
  runGitLabMRReview: (projectId, mrIid) => sendIpc(IPC_CHANNELS.GITLAB_MR_REVIEW, projectId, mrIid),
  runGitLabMRFollowupReview: (projectId, mrIid) => sendIpc(IPC_CHANNELS.GITLAB_MR_FOLLOWUP_REVIEW, projectId, mrIid),
  postGitLabMRReview: (projectId, mrIid, selectedFindingIds) => invokeIpc(IPC_CHANNELS.GITLAB_MR_POST_REVIEW, projectId, mrIid, selectedFindingIds),
  postGitLabMRNote: (projectId, mrIid, body) => invokeIpc(IPC_CHANNELS.GITLAB_MR_POST_NOTE, projectId, mrIid, body),
  mergeGitLabMR: (projectId, mrIid, mergeMethod) => invokeIpc(IPC_CHANNELS.GITLAB_MR_MERGE, projectId, mrIid, mergeMethod),
  assignGitLabMR: (projectId, mrIid, userIds) => invokeIpc(IPC_CHANNELS.GITLAB_MR_ASSIGN, projectId, mrIid, userIds),
  approveGitLabMR: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_MR_APPROVE, projectId, mrIid),
  cancelGitLabMRReview: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_MR_REVIEW_CANCEL, projectId, mrIid),
  checkGitLabMRNewCommits: (projectId, mrIid) => invokeIpc(IPC_CHANNELS.GITLAB_MR_CHECK_NEW_COMMITS, projectId, mrIid),
  // MR Review Event Listeners
  onGitLabMRReviewProgress: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_MR_REVIEW_PROGRESS, callback),
  onGitLabMRReviewComplete: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_MR_REVIEW_COMPLETE, callback),
  onGitLabMRReviewError: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_MR_REVIEW_ERROR, callback),
  // GitLab Auto-Fix operations
  getGitLabAutoFixConfig: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_GET_CONFIG, projectId),
  saveGitLabAutoFixConfig: (projectId, config) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_SAVE_CONFIG, projectId, config),
  getGitLabAutoFixQueue: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_GET_QUEUE, projectId),
  checkGitLabAutoFixLabels: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_CHECK_LABELS, projectId),
  checkNewGitLabAutoFixIssues: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_CHECK_NEW, projectId),
  startGitLabAutoFix: (projectId, issueIid) => sendIpc(IPC_CHANNELS.GITLAB_AUTOFIX_START, projectId, issueIid),
  getGitLabAutoFixBatches: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_GET_BATCHES, projectId),
  analyzeGitLabAutoFixPreview: (projectId, issueIids, maxIssues) => sendIpc(IPC_CHANNELS.GITLAB_AUTOFIX_ANALYZE_PREVIEW, projectId, issueIids, maxIssues),
  approveGitLabAutoFixBatches: (projectId, batches) => invokeIpc(IPC_CHANNELS.GITLAB_AUTOFIX_APPROVE_BATCHES, projectId, batches),
  // GitLab Auto-Fix Event Listeners
  onGitLabAutoFixProgress: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_PROGRESS, callback),
  onGitLabAutoFixComplete: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_COMPLETE, callback),
  onGitLabAutoFixError: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_ERROR, callback),
  onGitLabAutoFixAnalyzePreviewProgress: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_ANALYZE_PREVIEW_PROGRESS, callback),
  onGitLabAutoFixAnalyzePreviewComplete: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_ANALYZE_PREVIEW_COMPLETE, callback),
  onGitLabAutoFixAnalyzePreviewError: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_AUTOFIX_ANALYZE_PREVIEW_ERROR, callback),
  // GitLab Triage operations
  getGitLabTriageConfig: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_TRIAGE_GET_CONFIG, projectId),
  saveGitLabTriageConfig: (projectId, config) => invokeIpc(IPC_CHANNELS.GITLAB_TRIAGE_SAVE_CONFIG, projectId, config),
  getGitLabTriageResults: (projectId) => invokeIpc(IPC_CHANNELS.GITLAB_TRIAGE_GET_RESULTS, projectId),
  runGitLabTriage: (projectId, issueIids) => sendIpc(IPC_CHANNELS.GITLAB_TRIAGE_RUN, projectId, issueIids),
  applyGitLabTriageLabels: (projectId, issueIid, labelsToAdd, labelsToRemove) => invokeIpc(IPC_CHANNELS.GITLAB_TRIAGE_APPLY_LABELS, projectId, issueIid, labelsToAdd, labelsToRemove),
  // GitLab Triage Event Listeners
  onGitLabTriageProgress: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_TRIAGE_PROGRESS, callback),
  onGitLabTriageComplete: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_TRIAGE_COMPLETE, callback),
  onGitLabTriageError: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_TRIAGE_ERROR, callback),
  // Release operations
  createGitLabRelease: (projectId, tagName, releaseNotes, options) => invokeIpc(IPC_CHANNELS.GITLAB_CREATE_RELEASE, projectId, tagName, releaseNotes, options),
  // OAuth operations (glab CLI)
  checkGitLabCli: () => invokeIpc(IPC_CHANNELS.GITLAB_CHECK_CLI),
  installGitLabCli: () => invokeIpc(IPC_CHANNELS.GITLAB_INSTALL_CLI),
  checkGitLabAuth: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_CHECK_AUTH, instanceUrl),
  startGitLabAuth: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_START_AUTH, instanceUrl),
  getGitLabToken: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_GET_TOKEN, instanceUrl),
  getGitLabUser: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_GET_USER, instanceUrl),
  listGitLabUserProjects: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_LIST_USER_PROJECTS, instanceUrl),
  // Project detection and management
  detectGitLabProject: (projectPath) => invokeIpc(IPC_CHANNELS.GITLAB_DETECT_PROJECT, projectPath),
  getGitLabBranches: (project, instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_GET_BRANCHES, project, instanceUrl),
  createGitLabProject: (projectName, options) => invokeIpc(IPC_CHANNELS.GITLAB_CREATE_PROJECT, projectName, options),
  addGitLabRemote: (projectPath, projectFullPath, instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_ADD_REMOTE, projectPath, projectFullPath, instanceUrl),
  listGitLabGroups: (instanceUrl) => invokeIpc(IPC_CHANNELS.GITLAB_LIST_GROUPS, instanceUrl),
  // Event Listeners
  onGitLabInvestigationProgress: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_INVESTIGATION_PROGRESS, callback),
  onGitLabInvestigationComplete: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_INVESTIGATION_COMPLETE, callback),
  onGitLabInvestigationError: (callback) => createIpcListener(IPC_CHANNELS.GITLAB_INVESTIGATION_ERROR, callback)
});
const createShellAPI = () => ({
  openExternal: (url) => invokeIpc(IPC_CHANNELS.SHELL_OPEN_EXTERNAL, url),
  openTerminal: (dirPath) => invokeIpc(IPC_CHANNELS.SHELL_OPEN_TERMINAL, dirPath)
});
const createAgentAPI = () => {
  const roadmapAPI = createRoadmapAPI();
  const ideationAPI = createIdeationAPI();
  const insightsAPI = createInsightsAPI();
  const changelogAPI = createChangelogAPI();
  const linearAPI = createLinearAPI();
  const githubAPI = createGitHubAPI();
  const gitlabAPI = createGitLabAPI();
  const shellAPI = createShellAPI();
  return {
    // Roadmap API
    ...roadmapAPI,
    // Ideation API
    ...ideationAPI,
    // Insights API
    ...insightsAPI,
    // Changelog API
    ...changelogAPI,
    // Linear Integration API
    ...linearAPI,
    // GitHub Integration API
    ...githubAPI,
    // GitLab Integration API
    ...gitlabAPI,
    // Shell Operations API
    ...shellAPI
  };
};
const createAppUpdateAPI = () => ({
  // Operations
  checkAppUpdate: () => invokeIpc(IPC_CHANNELS.APP_UPDATE_CHECK),
  downloadAppUpdate: () => invokeIpc(IPC_CHANNELS.APP_UPDATE_DOWNLOAD),
  downloadStableUpdate: () => invokeIpc(IPC_CHANNELS.APP_UPDATE_DOWNLOAD_STABLE),
  installAppUpdate: () => {
    invokeIpc(IPC_CHANNELS.APP_UPDATE_INSTALL).catch(
      (err) => console.error("[app-update] Install failed:", err)
    );
  },
  getAppVersion: () => invokeIpc(IPC_CHANNELS.APP_UPDATE_GET_VERSION),
  getDownloadedAppUpdate: () => invokeIpc(IPC_CHANNELS.APP_UPDATE_GET_DOWNLOADED),
  // Event Listeners
  onAppUpdateAvailable: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_AVAILABLE, callback),
  onAppUpdateDownloaded: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_DOWNLOADED, callback),
  onAppUpdateProgress: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_PROGRESS, callback),
  onAppUpdateStableDowngrade: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_STABLE_DOWNGRADE, callback),
  onAppUpdateReadOnlyVolume: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_READONLY_VOLUME, callback),
  onAppUpdateError: (callback) => createIpcListener(IPC_CHANNELS.APP_UPDATE_ERROR, callback)
});
const createDebugAPI = () => ({
  getDebugInfo: () => invokeIpc(IPC_CHANNELS.DEBUG_GET_INFO),
  openLogsFolder: () => invokeIpc(IPC_CHANNELS.DEBUG_OPEN_LOGS_FOLDER),
  copyDebugInfo: () => invokeIpc(IPC_CHANNELS.DEBUG_COPY_DEBUG_INFO),
  getRecentErrors: (maxCount) => invokeIpc(IPC_CHANNELS.DEBUG_GET_RECENT_ERRORS, maxCount),
  listLogFiles: () => invokeIpc(IPC_CHANNELS.DEBUG_LIST_LOG_FILES)
});
const createClaudeCodeAPI = () => ({
  checkClaudeCodeVersion: () => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_CHECK_VERSION),
  installClaudeCode: () => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_INSTALL),
  getClaudeCodeVersions: () => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_GET_VERSIONS),
  installClaudeCodeVersion: (version) => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_INSTALL_VERSION, version),
  getClaudeCodeInstallations: () => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_GET_INSTALLATIONS),
  setClaudeCodeActivePath: (cliPath) => invokeIpc(IPC_CHANNELS.CLAUDE_CODE_SET_ACTIVE_PATH, cliPath)
});
function createMcpAPI() {
  return {
    checkMcpHealth: (server) => ipcRenderer.invoke(IPC_CHANNELS.MCP_CHECK_HEALTH, server),
    testMcpConnection: (server) => ipcRenderer.invoke(IPC_CHANNELS.MCP_TEST_CONNECTION, server)
  };
}
let testConnectionRequestId = 0;
let discoverModelsRequestId = 0;
const createProfileAPI = () => ({
  // Get all profiles
  getAPIProfiles: () => ipcRenderer.invoke(IPC_CHANNELS.PROFILES_GET),
  // Save/create a profile
  saveAPIProfile: (profile) => ipcRenderer.invoke(IPC_CHANNELS.PROFILES_SAVE, profile),
  // Update an existing profile
  updateAPIProfile: (profile) => ipcRenderer.invoke(IPC_CHANNELS.PROFILES_UPDATE, profile),
  // Delete a profile
  deleteAPIProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.PROFILES_DELETE, profileId),
  // Set active profile (null to switch to OAuth)
  setActiveAPIProfile: (profileId) => ipcRenderer.invoke(IPC_CHANNELS.PROFILES_SET_ACTIVE, profileId),
  // Test API profile connection
  testConnection: (baseUrl, apiKey, signal) => {
    const requestId = ++testConnectionRequestId;
    if (signal?.aborted) {
      return Promise.reject(new DOMException("The operation was aborted.", "AbortError"));
    }
    if (signal && typeof signal.addEventListener === "function") {
      try {
        signal.addEventListener("abort", () => {
          ipcRenderer.send(IPC_CHANNELS.PROFILES_TEST_CONNECTION_CANCEL, requestId);
        }, { once: true });
      } catch (err) {
        console.error("[preload/profile-api] Error adding abort listener:", err);
      }
    } else if (signal) {
      console.warn("[preload/profile-api] signal provided but addEventListener not available - signal may have been serialized");
    }
    return ipcRenderer.invoke(IPC_CHANNELS.PROFILES_TEST_CONNECTION, baseUrl, apiKey, requestId);
  },
  // Discover available models from API
  discoverModels: (baseUrl, apiKey, signal) => {
    console.log("[preload/profile-api] discoverModels START");
    console.log("[preload/profile-api] baseUrl, apiKey:", baseUrl, apiKey?.slice(-4));
    const requestId = ++discoverModelsRequestId;
    console.log("[preload/profile-api] Request ID:", requestId);
    if (signal?.aborted) {
      console.log("[preload/profile-api] Already aborted, rejecting");
      return Promise.reject(new DOMException("The operation was aborted.", "AbortError"));
    }
    if (signal && typeof signal.addEventListener === "function") {
      console.log("[preload/profile-api] Setting up abort listener...");
      try {
        signal.addEventListener("abort", () => {
          console.log("[preload/profile-api] Abort signal received for request:", requestId);
          ipcRenderer.send(IPC_CHANNELS.PROFILES_DISCOVER_MODELS_CANCEL, requestId);
        }, { once: true });
        console.log("[preload/profile-api] Abort listener added successfully");
      } catch (err) {
        console.error("[preload/profile-api] Error adding abort listener:", err);
      }
    } else if (signal) {
      console.warn("[preload/profile-api] signal provided but addEventListener not available - signal may have been serialized");
    }
    const channel = "profiles:discover-models";
    console.log("[preload/profile-api] About to invoke IPC channel:", channel);
    const promise = ipcRenderer.invoke(channel, baseUrl, apiKey, requestId);
    console.log("[preload/profile-api] IPC invoke called, promise returned");
    return promise;
  }
});
const createScreenshotAPI = () => ({
  getSources: () => ipcRenderer.invoke(IPC_CHANNELS.SCREENSHOT_GET_SOURCES),
  capture: (options) => ipcRenderer.invoke(IPC_CHANNELS.SCREENSHOT_CAPTURE, options)
});
const createQueueAPI = () => ({
  // Queue Routing Operations
  getRunningTasksByProfile: () => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_GET_RUNNING_TASKS_BY_PROFILE),
  getBestProfileForTask: (options) => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_GET_BEST_PROFILE_FOR_TASK, options),
  getBestUnifiedAccount: (options) => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_GET_BEST_UNIFIED_ACCOUNT, options),
  assignProfileToTask: (taskId, profileId, profileName, reason) => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_ASSIGN_PROFILE_TO_TASK, taskId, profileId, profileName, reason),
  updateTaskSession: (taskId, sessionId) => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_UPDATE_TASK_SESSION, taskId, sessionId),
  getTaskSession: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.QUEUE_GET_TASK_SESSION, taskId),
  // Queue Routing Event Listeners
  onQueueProfileSwapped: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on(IPC_CHANNELS.QUEUE_PROFILE_SWAPPED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.QUEUE_PROFILE_SWAPPED, handler);
  },
  onQueueSessionCaptured: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on(IPC_CHANNELS.QUEUE_SESSION_CAPTURED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.QUEUE_SESSION_CAPTURED, handler);
  },
  onQueueBlockedNoProfiles: (callback) => {
    const handler = (_event, info) => callback(info);
    ipcRenderer.on(IPC_CHANNELS.QUEUE_BLOCKED_NO_PROFILES, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.QUEUE_BLOCKED_NO_PROFILES, handler);
  }
});
const createElectronAPI = () => ({
  ...createProjectAPI(),
  ...createTerminalAPI(),
  ...createTaskAPI(),
  ...createSettingsAPI(),
  ...createFileAPI(),
  ...createAgentAPI(),
  // Includes: Roadmap, Ideation, Insights, Changelog, Linear, GitHub, GitLab, Shell
  ...createAppUpdateAPI(),
  ...createDebugAPI(),
  ...createClaudeCodeAPI(),
  ...createMcpAPI(),
  ...createProfileAPI(),
  ...createScreenshotAPI(),
  github: createGitHubAPI(),
  queue: createQueueAPI()
  // Queue routing for rate limit recovery
});
const electronAPI = createElectronAPI();
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
contextBridge.exposeInMainWorld("DEBUG", process.env.DEBUG === "true");
contextBridge.exposeInMainWorld("platform", {
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux",
  isUnix: process.platform !== "win32"
});
