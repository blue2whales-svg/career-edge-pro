UPDATE cached_jobs 
SET posted_at = NOW() - (random() * interval '3 days'),
    discovered_at = NOW() - (random() * interval '1 day'),
    updated_at = NOW()
WHERE market = 'Kenya' AND source = 'platform_seed' AND is_active = true;