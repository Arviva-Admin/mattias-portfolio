import { supabase } from '../lib/supabase';
import { Project } from '../data/projects';

const PROJECTS_TABLE = 'projects';

export interface SupabaseProjectRow {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  screenshot_url?: string | null;
  live_url: string;
  github_url: string;
  tech_stack?: string[] | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

const toProject = (row: SupabaseProjectRow): Project => ({
  id: row.id,
  name: row.name,
  description: row.description,
  logoUrl: row.logo_url,
  screenshotUrl: row.screenshot_url ?? null,
  liveUrl: row.live_url,
  githubUrl: row.github_url,
});

const toRow = (project: Omit<Project, 'id'>): Partial<SupabaseProjectRow> => ({
  name: project.name,
  description: project.description,
  logo_url: project.logoUrl ?? null,
  screenshot_url: project.screenshotUrl ?? null,
  live_url: project.liveUrl,
  github_url: project.githubUrl,
});

// Lägg till ett nytt projekt
export const addProject = async (project: Omit<Project, 'id'>): Promise<string> => {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .insert(toRow(project))
    .select('id')
    .single();

  if (error) {
    console.error('Error adding project:', error);
    throw error;
  }

  return data.id;
};

// Hämta alla projekt
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting projects:', error);
    throw error;
  }

  return (data || []).map((row) => toProject(row as SupabaseProjectRow));
};

// Uppdatera ett projekt
export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
  const payload: Partial<SupabaseProjectRow> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;
  if (updates.screenshotUrl !== undefined) payload.screenshot_url = updates.screenshotUrl;
  if (updates.liveUrl !== undefined) payload.live_url = updates.liveUrl;
  if (updates.githubUrl !== undefined) payload.github_url = updates.githubUrl;

  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Ta bort ett projekt
export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(PROJECTS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
