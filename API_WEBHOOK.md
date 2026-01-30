# API Webhook Endpoint för IdeaLab → Supabase

Om du vill skippa Pica och ha ett **direkt API-endpoint** i portfolion som IdeaLab kan kalla.

---

## Steg 1: Skapa API-endpoint

Vi skapar ett enkelt Vercel Serverless Function.

### 1.1 Skapa API-fil

`/api/webhook/idealab.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description, logoUrl, screenshotUrl, liveUrl, githubUrl, techStack } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description: description || 'AI-generated from IdeaLab',
        logo_url: logoUrl || null,
        screenshot_url: screenshotUrl || null,
        live_url: liveUrl || '',
        github_url: githubUrl || '',
        tech_stack: techStack || [],
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, project: data });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

---

## Steg 2: Deploy till Vercel

1. Push till GitHub
2. Koppla repo till Vercel
3. Lägg till env-variabler i Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Webhook-URL blir: `https://your-domain.vercel.app/api/webhook/idealab`

---

## Steg 3: Anropa från IdeaLab

```javascript
await fetch('https://your-domain.vercel.app/api/webhook/idealab', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'SneakerShop',
    description: 'E-commerce for sneakers',
    liveUrl: 'https://sneaker-shop.vercel.app',
    githubUrl: 'https://github.com/user/sneaker-shop',
    screenshotUrl: 'https://example.com/screenshot.png',
    techStack: ['React', 'Node', 'Stripe']
  })
});
```

---

## Steg 4: Testa

```bash
curl -X POST https://your-domain.vercel.app/api/webhook/idealab \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test App",
    "liveUrl": "https://test.com",
    "screenshotUrl": "https://example.com/ss.png"
  }'
```
