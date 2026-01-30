# Pica Workflow Setup - IdeaLab → Supabase Auto-logging

## Översikt
Detta workflow loggar automatiskt nya projekt från IdeaLab till Supabase via Pica Pro.

---

## Steg 1: Skapa Pica Workflow

### 1.1 Trigger: Webhook
1. Öppna Pica → Skapa ny workflow
2. Lägg till **Webhook Trigger**
3. Kopiera webhook-URL (ex: `https://pica.ai/webhooks/xxx`)

---

## Steg 2: Konfigurera Supabase-anslutning

### 2.1 Lägg till Supabase HTTP-node
1. Lägg till **HTTP Request** node
2. Konfigurera:
   - **Method**: `POST`
   - **URL**: `https://nrpcoqfwimjmtromxjnv.supabase.co/rest/v1/projects`
   - **Headers**:
     ```
     apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycGNvcWZ3aW1qbXRyb214am52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Njc4NjUsImV4cCI6MjA4NTM0Mzg2NX0.EVmqXzcYSiG-3QQ7PNTv6tkQeM6kHwu7gUBcweTqBsI
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycGNvcWZ3aW1qbXRyb214am52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Njc4NjUsImV4cCI6MjA4NTM0Mzg2NX0.EVmqXzcYSiG-3QQ7PNTv6tkQeM6kHwu7gUBcweTqBsI
     Content-Type: application/json
     Prefer: return=representation
     ```

### 2.2 Mapping från Webhook → Supabase
Body (JSON):
```json
{
  "name": "{{webhook.body.name}}",
  "description": "{{webhook.body.description}}",
  "logo_url": "{{webhook.body.logoUrl}}",
  "screenshot_url": "{{webhook.body.screenshotUrl}}",
  "live_url": "{{webhook.body.liveUrl}}",
  "github_url": "{{webhook.body.githubUrl}}",
  "tech_stack": "{{webhook.body.techStack}}",
  "status": "active"
}
```

---

## Steg 3: Testa Webhook

Skicka test-POST till Pica webhook-URL:

```bash
curl -X POST https://your-pica-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "AI-generated app",
    "logoUrl": "https://example.com/logo.png",
    "screenshotUrl": "https://example.com/screenshot.png",
    "liveUrl": "https://test-app.vercel.app",
    "githubUrl": "https://github.com/user/test-app",
    "techStack": ["React", "Vite", "Tailwind"]
  }'
```

---

## Steg 4: Integrera med IdeaLab

När IdeaLab skapar ett projekt, låt den posta till Pica webhook-URL.

**Exempel från IdeaLab (pseudo):**
```javascript
await fetch('https://your-pica-webhook-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: projectName,
    description: projectDescription,
    liveUrl: deployedUrl,
    githubUrl: repoUrl,
    screenshotUrl: screenshotUrl,
    techStack: ['React', 'Node']
  })
});
```

---

## Alternativ: Direkt API-endpoint

Om Pica är svårt att konfigurera, kan vi skapa ett eget API-endpoint i portfolion.
Se `API_WEBHOOK.md` för instruktioner.
