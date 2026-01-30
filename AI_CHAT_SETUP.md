# AI Chat Integration Guide

## Overview
AI Chat Widget med full kontroll över alla projekt via GitHub & Vercel APIs.

## Environment Variables

Lägg till i Vercel:

```bash
# GitHub API
GITHUB_TOKEN=ghp_xxx  # Personal Access Token med repo, workflow, admin:org scope
GITHUB_OWNER=Arviva-Admin

# Vercel API  
VERCEL_TOKEN=xxx  # Vercel API token
VERCEL_TEAM_ID=xxx  # Optional: team ID

# OpenRouter AI (30+ modeller, många gratis)
OPENROUTER_API_KEY=sk-or-xxx
```

## Setup Guide

### 1. GitHub Token
1. Gå till https://github.com/settings/tokens/new
2. Välj scopes:
   - `repo` (full control)
   - `workflow` (update workflows)
   - `admin:org` (för team repos)
3. Kopiera token → lägg till i Vercel

### 2. Vercel Token
1. Gå till https://vercel.com/account/tokens
2. Skapa ny token
3. Kopiera → lägg till i Vercel

### 3. OpenRouter API Key
1. Gå till https://openrouter.ai/keys
2. Logga in (GitHub/Google)
3. Skapa ny API key
4. **GRATIS krediter ingår!**
5. Kopiera → lägg till i Vercel

## OpenRouter Modeller (Exempel)

**Gratis:**
- `meta-llama/llama-3.1-70b-instruct:free` (Standard, kraftfull)
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`

**Betald (billig):**
- `anthropic/claude-3.5-sonnet` ($3/1M tokens)
- `openai/gpt-4` ($5/1M tokens)
- `google/gemini-pro-1.5` ($0.50/1M tokens)

## Features

### ✅ Implementerat
- Chat UI med flytande widget
- Grundläggande intent detection
- Supabase databas integration
- Lista projekt

### 🚧 Nästa Steg
- GitHub repo creation
- Automatisk Vercel deploy
- Git commit + push
- AI-driven framework selection
- Live kod-modifiering

## Usage Examples

**Skapa projekt:**
```
User: "Skapa en ny portfolio-sida med Next.js"
AI: *Skapar GitHub repo → pushar kod → deployer till Vercel → sparar i DB*
```

**Modifiera kod:**
```
User: "Ändra bakgrundsfärgen till blå på mitt projekt X"
AI: *Hittar projekt → ändrar CSS → committar → pushar → auto-deploy*
```

**Lista projekt:**
```
User: "Visa alla mina projekt"
AI: *Hämtar från Supabase → visar lista med länkar*
```

## Next Steps

1. Lägg till environment variables i Vercel
2. Implementera GitHub API integration
3. Implementera Vercel API integration  
4. Lägg till riktig AI (OpenAI/Anthropic)
5. Testa full workflow
