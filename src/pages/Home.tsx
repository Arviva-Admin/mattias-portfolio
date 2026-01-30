import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { ProjectCard } from "../components/ProjectCard";
import { Project } from "../data/projects";
import { getProjects, addProject as addProjectToDb } from "../services/projectService";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Kunde inte ladda projekt. Kontrollera Supabase-konfigurationen.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (newProject: Omit<Project, "id">) => {
    try {
      const projectId = await addProjectToDb(newProject);
      const project: Project = {
        ...newProject,
        id: projectId,
      };
      setProjects([project, ...projects]);
    } catch (err) {
      console.error('Failed to add project:', err);
      setError('Kunde inte lägga till projekt. Försök igen.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header onAddProject={handleAddProject} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Header onAddProject={handleAddProject} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="text-sm text-primary hover:underline"
            >
              Försök igen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onAddProject={handleAddProject} />

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Inga projekt ännu
            </h3>
            <p className="text-muted-foreground">
              Klicka på &quot;Lägg till projekt&quot; för att komma igång
            </p>
          </div>
        )}
      </section>
    </main>
  );
}