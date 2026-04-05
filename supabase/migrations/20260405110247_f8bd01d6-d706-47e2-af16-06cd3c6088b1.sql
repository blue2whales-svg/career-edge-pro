
CREATE OR REPLACE FUNCTION public.get_jobs_page_data()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
  counts_obj jsonb;
  jobs_arr jsonb;
BEGIN
  SELECT jsonb_build_object(
    'kenya', COALESCE(SUM(CASE WHEN market = 'Kenya' THEN 1 ELSE 0 END), 0),
    'gulf', COALESCE(SUM(CASE WHEN market IN ('UAE', 'Qatar', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman') THEN 1 ELSE 0 END), 0),
    'cruise', COALESCE(SUM(CASE WHEN market = 'Cruise' THEN 1 ELSE 0 END), 0),
    'remote', COALESCE(SUM(CASE WHEN market = 'Remote' THEN 1 ELSE 0 END), 0),
    'visa', COALESCE(SUM(CASE WHEN visa_sponsorship = true THEN 1 ELSE 0 END), 0),
    'healthcare', COALESCE(SUM(CASE WHEN category = 'Healthcare Jobs' OR industry = 'Healthcare' THEN 1 ELSE 0 END), 0),
    'uk', COALESCE(SUM(CASE WHEN market = 'UK' THEN 1 ELSE 0 END), 0),
    'australia', COALESCE(SUM(CASE WHEN market = 'Australia' THEN 1 ELSE 0 END), 0),
    'germany', COALESCE(SUM(CASE WHEN market = 'Germany' THEN 1 ELSE 0 END), 0),
    'canada', COALESCE(SUM(CASE WHEN market = 'Canada' THEN 1 ELSE 0 END), 0),
    'europe', COALESCE(SUM(CASE WHEN market IN ('Europe', 'Germany', 'UK') THEN 1 ELSE 0 END), 0),
    'international', COALESCE(SUM(CASE WHEN market = 'International' THEN 1 ELSE 0 END), 0),
    'total', COUNT(*)
  ) INTO counts_obj
  FROM cached_jobs
  WHERE is_active = true;

  SELECT COALESCE(jsonb_agg(row_to_json(j)), '[]'::jsonb)
  INTO jobs_arr
  FROM (
    SELECT title, company, location, salary, type, industry, market, posted_at,
           hot, tag, source, source_label, apply_url, description, country, category,
           visa_sponsorship, hot_score, verified, featured, is_active, discovered_at
    FROM cached_jobs
    WHERE is_active = true
    ORDER BY posted_at DESC NULLS LAST, hot_score DESC
    LIMIT 500
  ) j;

  result := jsonb_build_object('counts', counts_obj, 'jobs', jobs_arr);
  RETURN result;
END;
$function$;
