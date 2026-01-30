import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { Project } from "../data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-card border border-border/50 rounded-2xl p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Screenshot */}
      {project.screenshotUrl && (
        <div className="mb-4 overflow-hidden rounded-xl border border-border/50 bg-muted/30">
          <img
            src={project.screenshotUrl}
            alt={`${project.name} preview`}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}
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