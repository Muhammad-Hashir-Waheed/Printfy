-- Applied after Prisma db push/seed. Prisma connects as postgres and bypasses RLS.
-- Policies only affect the Supabase Data API (anon / authenticated).
-- Safe to run on vanilla Postgres: skips grants/policies when those roles are missing.

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('spatial_ref_sys', '_prisma_migrations')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    EXECUTE 'GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role';
    EXECUTE 'GRANT SELECT ON TABLE "Product", "Brand", "Category", "Variant", "Banner", "Blog" TO anon, authenticated';
    EXECUTE 'GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role';
    EXECUTE 'GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role';

    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Product') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Product"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Product" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Brand') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Brand"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Brand" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Category') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Category"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Category" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Variant') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Variant"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Variant" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Banner') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Banner"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Banner" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'Blog') THEN
      EXECUTE 'DROP POLICY IF EXISTS catalog_public_read ON "Blog"';
      EXECUTE 'CREATE POLICY catalog_public_read ON "Blog" FOR SELECT TO anon, authenticated USING (true)';
    END IF;
  END IF;
END $$;
