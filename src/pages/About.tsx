import { Link } from "react-router-dom";
import { Sparkles, Code, Palette, Zap } from "lucide-react";
import { Button } from "../components/ui/button";

export default function About() {
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
            </nav>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Om mig
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jag är Mattias, en passionerad utvecklare som skapar innovativa lösningar genom AI-genererade appar och hemsidor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Utveckling</h3>
            <p className="text-muted-foreground">
              Modern webbutveckling med de senaste teknologierna och ramverken.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Design</h3>
            <p className="text-muted-foreground">
              Användarvänliga och estetiska gränssnitt som engagerar användarna.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-driven</h3>
            <p className="text-muted-foreground">
              Utnyttjar artificiell intelligens för att skapa smarta och effektiva lösningar.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Min resa</h2>
          <p className="text-muted-foreground mb-4">
            Genom IdeaLab har jag skapat en mängd olika projekt som visar på mångsidigheten inom modern webbutveckling.
            Från AI-assisterade skrivverktyg till smarta receptgeneratorer och ekonomiska översiktsappar.
          </p>
          <p className="text-muted-foreground">
            Varje projekt är ett bevis på potentialen i att kombinera mänsklig kreativitet med artificiell intelligens.
          </p>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Se mina projekt
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}