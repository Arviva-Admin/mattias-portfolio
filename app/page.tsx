"use client";

import React from "react"

import { useState } from "react";
import { Plus, ExternalLink, Github, X, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  liveUrl: string;
  githubUrl: string;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "AI Skrivassistent",
    description: "AI-genererad app för automatiserad textproduktion",
    logoUrl: null,
    liveUrl: "https://example.com/ai-skrivare",
    githubUrl: "https://github.com/mattias/ai-skrivare",
  },
  {
    id: "2",
    name: "SmartRecept",
    description: "AI-genererad hemsida med personliga receptförslag",
    logoUrl: null,
    liveUrl: "https://example.com/smartrecept",
    githubUrl: "https://github.com/mattias/smartrecept",
  },
  {
    id: "3",
    name: "BudgetPlaneraren",
    description: "AI-genererad app för ekonomisk översikt",
    logoUrl: null,
    liveUrl: "https://example.com/budget",
    githubUrl: "https://github.com/mattias/budget",
  },
  {
    id: "4",
    name: "FitnessTracker Pro",
    description: "AI-genererad hemsida för träningsuppföljning",
    logoUrl: null,
    liveUrl: "https://example.com/fitness",
    githubUrl: "https://github.com/mattias/fitness",
  },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    logoUrl: "",
    liveUrl: "",
    githubUrl: "",
  });

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description:
        newProject.description || "AI-genererad app/hemsida från IdeaLab",
      logoUrl: newProject.logoUrl || null,
      liveUrl: newProject.liveUrl,
      githubUrl: newProject.githubUrl,
    };

    setProjects([...projects, project]);
    setNewProject({
      name: "",
      description: "",
      logoUrl: "",
      liveUrl: "",
      githubUrl: "",
    });
    setIsOpen(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProject({ ...newProject, logoUrl: url });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Mattias Portfolio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Alla projekt från IdeaLab
                </p>
              </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                  <Plus className="w-4 h-4" />
                  Lägg till projekt
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">
                    Lägg till nytt projekt
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Projektnamn *
                    </Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      placeholder="Min nya app"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Beskrivning
                    </Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="AI-genererad app/hemsida"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Logo/Bild</Label>
                    <div className="flex items-center gap-3">
                      {newProject.logoUrl ? (
                        <div className="relative">
                          <img
                            src={newProject.logoUrl || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                          />
                          <button
                            onClick={() =>
                              setNewProject({ ...newProject, logoUrl: "" })
                            }
                            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 rounded-full border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors bg-input/50">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                      <span className="text-sm text-muted-foreground">
                        Klicka för att ladda upp
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liveUrl" className="text-foreground">
                      Live Demo URL
                    </Label>
                    <Input
                      id="liveUrl"
                      value={newProject.liveUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-foreground">
                      GitHub URL
                    </Label>
                    <Input
                      id="githubUrl"
                      value={newProject.githubUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/..."
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button
                    onClick={handleAddProject}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
                    disabled={!newProject.name.trim()}
                  >
                    Lägg till
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-card border border-border/50 rounded-2xl p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Logo */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 group-hover:border-primary/40 transition-colors overflow-hidden">
          {project.logoUrl ? (
            <img
              src={project.logoUrl || "/placeholder.svg"}
              alt={`${project.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-primary">
              {project.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg leading-tight truncate group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Button>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full gap-2 border-border hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
