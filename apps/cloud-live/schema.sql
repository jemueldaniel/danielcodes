-- Isolated guest-only Workform sandbox; no existing production tables are modified.
CREATE TABLE IF NOT EXISTS guest_sessions (
  token_hash TEXT PRIMARY KEY,
  workspace_id TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS guest_sessions_expiry ON guest_sessions(expires_at);
CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  input_text TEXT NOT NULL,
  steps_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  last_op_key TEXT NOT NULL,
  last_digest TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(workspace_id) REFERENCES guest_sessions(workspace_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS workflow_workspace ON workflows(workspace_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  workflow_id TEXT NOT NULL,
  workflow_revision INTEGER NOT NULL,
  op_key TEXT NOT NULL,
  input_digest TEXT NOT NULL,
  result_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(workspace_id,op_key),
  FOREIGN KEY(workspace_id) REFERENCES guest_sessions(workspace_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS runs_workspace ON runs(workspace_id,created_at DESC);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  source_run_id TEXT,
  op_key TEXT NOT NULL,
  content_digest TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(workspace_id,op_key),
  FOREIGN KEY(workspace_id) REFERENCES guest_sessions(workspace_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS document_workspace ON documents(workspace_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  op_key TEXT NOT NULL,
  input_digest TEXT NOT NULL,
  result_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(workspace_id,op_key),
  FOREIGN KEY(workspace_id) REFERENCES guest_sessions(workspace_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS eval_workspace ON evaluations(workspace_id,created_at DESC);