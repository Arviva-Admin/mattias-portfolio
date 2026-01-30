import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AddProjectDialog } from "./AddProjectDialog";
import { Project } from "../data/projects";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onAddProject: (project: Omit<Project, "id">) => void;
}

export function Header({ onAddProject }: HeaderProps) {
  const { user, login, logout } = useAuth();

  return (
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

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Hem
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Om mig
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Kontakt
            </Link>
            {user ? (
              <>
                <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
                <button onClick={logout} className="text-foreground hover:text-primary">
                  Logga ut
                </button>
              </>
            ) : (
              <button onClick={login} className="text-foreground hover:text-primary">
                Logga in
              </button>
            )}
            <AddProjectDialog onAddProject={onAddProject} />
          </nav>
        </div>
      </div>
    </header>
  );
}