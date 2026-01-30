export interface Project {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  liveUrl: string;
  githubUrl: string;
}

export const initialProjects: Project[] = [
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