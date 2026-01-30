# Mattias Portfolio

En portföljwebbplats byggd med Vite, React och TypeScript. Visar upp AI-genererade projekt från IdeaLab med Firebase-integration för autentisering och datalagring.

## Funktioner

- **Responsiv design** med Tailwind CSS
- **Reaktiva komponenter** för projektvisning och tillägg
- **Routing** med React Router
- **Firebase Authentication** för säker inloggning
- **Supabase** för projektdatalagring i realtid
- **Admin Panel** för projekthantering
- **API-integration** med TanStack Query och Axios
- **Modern UI** med shadcn/ui-inspirerade komponenter

## Teknologier

- **Frontend**: React 18, TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase Auth + Supabase DB
- **API**: TanStack React Query, Axios
- **Build**: Vite
- **Linting**: ESLint

## Kom igång

### 1. Installera dependencies

```bash
pnpm install
```

### 2. Konfigurera Firebase

1. Skapa ett nytt projekt på [Firebase Console](https://console.firebase.google.com/)
2. Aktivera **Authentication** och välj Google Sign-in som provider
3. Kopiera Firebase-konfigurationen från Project Settings
4. Skapa en `.env`-fil i projektets rot:

```bash
cp .env.example .env
```

5. Fyll i dina Firebase-värden i `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Konfigurera Supabase

1. Skapa ett projekt på [Supabase](https://supabase.com/)
2. Gå till **Project Settings → API**
3. Kopiera **Project URL** och **anon public key**
4. Lägg till i `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Skapa tabellen `projects` (se schema längre ner)

### 4. Starta dev-servern

```bash
pnpm dev
```

5. Öppna [http://localhost:5173](http://localhost:5173) i din webbläsare.

## Bygg för produktion

```bash
pnpm build
```

## Projektstruktur

```
src/
├── components/          # Återanvändbara komponenter
│   ├── ui/             # UI-komponenter (Button, Dialog, etc.)
│   ├── Header.tsx      # Huvudnavigering
│   ├── ProjectCard.tsx # Projektvisning
│   └── AddProjectDialog.tsx # Dialog för att lägga till projekt
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Autentiseringskontext
├── data/               # Statiska data
│   └── projects.ts     # Projekttyper
├── lib/                # Hjälpfunktioner och konfiguration
│   ├── firebase.ts     # Firebase-initialisering
│   └── utils.ts        # Utility-funktioner
├── pages/              # Sidkomponenter
│   ├── Home.tsx        # Startsida med projekt
│   ├── About.tsx       # Om-sida
│   ├── Contact.tsx     # Kontaktsida
│   ├── Admin.tsx       # Admin-panel
│   └── Login.tsx       # Inloggningssida
├── services/           # API-tjänster
│   └── projectService.ts # Supabase-operationer
├── App.tsx             # Huvudapp med routing
├── main.tsx            # App-entry
└── index.css           # Globala styles
```

## Supabase Struktur

### Tabell: `projects`

```sql
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  screenshot_url text,
  live_url text,
  github_url text,
  tech_stack text[],
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Säkerhet

- `.env`-filen är tillagd i `.gitignore` för att skydda dina nycklar
- Använd `.env.example` som mall för andra utvecklare

### Rekommenderad RLS (Supabase)

```sql
alter table public.projects enable row level security;

create policy "Public read"
on public.projects
for select
using (true);

create policy "Authenticated write"
on public.projects
for all
using (auth.role() = 'authenticated');
```

## Deployment

### Rekommenderade plattformar:

- **Vercel** - Enklast för React/Vite-appar
- **Netlify** - Bra gratisnivå
- **Firebase Hosting** - Integreras perfekt med Firebase

### Deployment-steg (Vercel):

```bash
# Installera Vercel CLI
pnpm add -g vercel

# Deploya
vercel
```

## Bidra

Projekt från IdeaLab - AI-genererade lösningar.

## Licens

MIT