
-- Drop the problematic unique index that blocks upserts
DROP INDEX IF EXISTS cached_jobs_title_company_location_idx;

-- Drop redundant partial index (we already have cached_jobs_external_id_source_key)
DROP INDEX IF EXISTS idx_cached_jobs_external_source;
