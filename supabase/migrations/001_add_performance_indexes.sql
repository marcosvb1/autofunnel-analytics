-- Performance indexes for frequently queried columns
-- Created: 2026-03-29

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Integrations table indexes
CREATE INDEX IF NOT EXISTS idx_integrations_project_id ON integrations(project_id);
CREATE INDEX IF NOT EXISTS idx_integrations_type ON integrations(type);
CREATE INDEX IF NOT EXISTS idx_integrations_project_type ON integrations(project_id, type);

-- Funnel maps table indexes
CREATE INDEX IF NOT EXISTS idx_funnel_maps_project_id ON funnel_maps(project_id);
CREATE INDEX IF NOT EXISTS idx_funnel_maps_created_at ON funnel_maps(created_at DESC);

-- Sync logs table indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_project_id ON sync_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integration_type ON sync_logs(integration_type);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_project_type ON sync_logs(project_id, integration_type);

-- Campaign attribution table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_campaign_attributions_project_id ON campaign_attributions(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_campaign_attributions_date ON campaign_attributions(date) WHERE date IS NOT NULL;
