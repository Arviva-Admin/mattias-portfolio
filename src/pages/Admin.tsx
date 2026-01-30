import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../data/projects';
import { getProjects, deleteProject, addProject } from '../services/projectService';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { AddProjectDialog } from '../components/AddProjectDialog';
import { Textarea } from '../components/ui/textarea';

export default function Admin() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Kunde inte ladda projekt.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta projekt?')) {
      return;
    }

    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Kunde inte ta bort projekt. Försök igen.');
    }
  };

  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    try {
      const projectId = await addProject(newProject);
      const project: Project = {
        ...newProject,
        id: projectId,
      };
      setProjects([project, ...projects]);
    } catch (err) {
      console.error('Failed to add project:', err);
      alert('Kunde inte lägga till projekt. Försök igen.');
    }
  };

  const normalizeProject = (item: any): Omit<Project, "id"> | null => {
    const name = item?.name || item?.title || item?.projectName || item?.project || item?.appName;
    if (!name) return null;

    const description = item?.description || item?.summary || item?.details || '';
    const liveUrl = item?.liveUrl || item?.live || item?.url || item?.previewUrl || '';
    const githubUrl = item?.githubUrl || item?.repo || item?.repository || '';
    const logoUrl = item?.logoUrl || item?.logo || item?.icon || item?.image || null;
    const screenshotUrl = item?.screenshotUrl || item?.screenshot || item?.previewImage || item?.preview || null;

    return {
      name,
      description: description || 'AI-genererad app/hemsida från IdeaLab',
      logoUrl: logoUrl || null,
      screenshotUrl: screenshotUrl || null,
      liveUrl,
      githubUrl,
    };
  };

  const handleImportFromIdeaLab = async () => {
    setImportError(null);
    setImportSuccess(null);

    if (!importText.trim()) {
      setImportError('Klistra in JSON-data från IdeaLab först.');
      return;
    }

    try {
      setImporting(true);
      const parsed = JSON.parse(importText);
      const items = Array.isArray(parsed)
        ? parsed
        : parsed?.projects || parsed?.items || parsed?.data || [];

      if (!Array.isArray(items)) {
        throw new Error('JSON måste vara en lista eller ha fältet "projects".');
      }

      const normalized = items
        .map(normalizeProject)
        .filter((project): project is Omit<Project, "id"> => Boolean(project));

      if (normalized.length === 0) {
        throw new Error('Kunde inte hitta några projekt i JSON-data.');
      }

      const createdIds = await Promise.all(normalized.map((project) => addProject(project)));
      const createdProjects = normalized.map((project, index) => ({
        ...project,
        id: createdIds[index],
      }));

      setProjects([...createdProjects, ...projects]);
      setImportText('');
      setImportSuccess(`Importerade ${createdProjects.length} projekt från IdeaLab.`);
    } catch (err: any) {
      console.error('Import failed:', err);
      setImportError(err?.message || 'Importen misslyckades.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAddProject={handleAddProject} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Välkommen, {user?.displayName || user?.email}!
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            Logga ut
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Totalt Projekt
            </h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Publicerade
            </h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              AI-Genererade
            </h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
        </div>

        {/* Projects Management */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Hantera Projekt</h2>
          <p className="text-muted-foreground mt-1">
            Redigera eller ta bort befintliga projekt
          </p>
        </div>

        {/* IdeaLab Import */}
        <div className="mb-8 bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Importera från IdeaLab (JSON)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Klistra in JSON-listan från IdeaLab. Vi försöker automatiskt mappa fälten
            (name/title, description, liveUrl, githubUrl, screenshotUrl).
          </p>
          <Textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='[{"name":"SneakerShop","description":"...","liveUrl":"https://...","screenshotUrl":"https://..."}]'
            className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[160px]"
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleImportFromIdeaLab}
              disabled={importing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {importing ? 'Importerar...' : 'Importera projekt'}
            </button>
            {importError && (
              <span className="text-sm text-destructive">{importError}</span>
            )}
            {importSuccess && (
              <span className="text-sm text-emerald-600">{importSuccess}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="text-sm text-primary hover:underline"
            >
              Försök igen
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Inga projekt ännu</h3>
            <p className="text-muted-foreground">
              Lägg till ditt första projekt för att komma igång
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard project={project} />
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="absolute top-4 right-4 p-2 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                  title="Ta bort projekt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}