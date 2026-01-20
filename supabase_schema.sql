-- ORDO FINAL REPAIR SCRIPT
-- This script fixes the RLS recursion (infinite loop) that causes 500 errors.
-- It is safe to run multiple times.

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Helper Functions (Security Definer to break recursion)
-- These functions bypass RLS to check ownership/membership safely.

CREATE OR REPLACE FUNCTION public.is_project_owner(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_project_member(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tables

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#06b6d4',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Project Members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- Todos
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'todo',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist (for manual repair)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='color') THEN
        ALTER TABLE public.projects ADD COLUMN color TEXT DEFAULT '#06b6d4';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='todos' AND column_name='project_id') THEN
        ALTER TABLE public.todos ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='todos' AND column_name='assignee_id') THEN
        ALTER TABLE public.todos ADD COLUMN assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Broken Recursion)

-- Projects: owner or member
DROP POLICY IF EXISTS "Owners can manage their projects" ON public.projects;
CREATE POLICY "Owners can manage their projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view projects" ON public.projects;
CREATE POLICY "Members can view projects" ON public.projects
    FOR SELECT USING (public.is_project_member(id));

-- Project Members: owner or the user themselves
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
CREATE POLICY "Project owners can manage members" ON public.project_members
    FOR ALL USING (public.is_project_owner(project_id));

DROP POLICY IF EXISTS "Members can see project members" ON public.project_members;
CREATE POLICY "Members can see project members" ON public.project_members
    FOR SELECT USING (public.is_project_member(project_id) OR user_id = auth.uid());

-- Profiles: viewable by all, editable by self
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Todos: owner, assignee, or project member
DROP POLICY IF EXISTS "Owners and assignees can manage todos" ON public.todos;
CREATE POLICY "Owners and assignees can manage todos" ON public.todos
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.uid() = assignee_id OR
        (project_id IS NOT NULL AND public.is_project_member(project_id))
    );

-- 5. Trigger for New User Profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Grant Permissions (Broaden for PostgREST cache)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;

-- Force Schema Refresh
NOTIFY pgrst, 'reload schema';
