import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Project } from "../data/projects";

interface AddProjectDialogProps {
  onAddProject: (project: Omit<Project, "id">) => void;
}

export function AddProjectDialog({ onAddProject }: AddProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    logoUrl: "",
    screenshotUrl: "",
    liveUrl: "",
    githubUrl: "",
  });

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;

    const project: Omit<Project, "id"> = {
      name: newProject.name,
      description:
        newProject.description || "AI-genererad app/hemsida från IdeaLab",
      logoUrl: newProject.logoUrl || null,
      screenshotUrl: newProject.screenshotUrl || null,
      liveUrl: newProject.liveUrl,
      githubUrl: newProject.githubUrl,
    };

    onAddProject(project);
    setNewProject({
      name: "",
      description: "",
      logoUrl: "",
      screenshotUrl: "",
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
            <Label htmlFor="screenshotUrl" className="text-foreground">
              Screenshot URL
            </Label>
            <Input
              id="screenshotUrl"
              value={newProject.screenshotUrl}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  screenshotUrl: e.target.value,
                })
              }
              placeholder="https://.../preview.png"
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
  );
}