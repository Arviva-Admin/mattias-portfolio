import { Link } from "react-router-dom";
import { useState } from "react";
import { Sparkles, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulera formulärinlämning (ersätt med faktisk implementation senare)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Återställ formulär efter 3 sekunder
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
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

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kontakta mig
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Har du frågor om mina projekt eller vill du samarbeta? Tveka inte att höra av dig!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Skicka ett meddelande</h2>
            
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Tack för ditt meddelande!</h3>
                <p className="text-muted-foreground">Jag återkommer så snart som möjligt.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Namn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ditt namn"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="din@email.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Meddelande</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Berätta vad du vill diskutera..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Skickar..." : "Skicka meddelande"}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">E-post</h3>
                  <p className="text-muted-foreground">mattias@idealar.se</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Svara vanligtvis inom 24 timmar.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Sociala medier</h3>
                  <p className="text-muted-foreground">Följ mig för uppdateringar</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  GitHub
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Intresserad av samarbete?</h3>
              <p className="text-muted-foreground mb-4">
                Jag är alltid öppen för nya möjligheter och spännande projekt.
              </p>
              <Link to="/about">
                <Button variant="outline">
                  Läs mer om mig
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}