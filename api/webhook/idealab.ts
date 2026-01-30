import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description, logoUrl, screenshotUrl, liveUrl, githubUrl, techStack } = req.body;

  // Validate required fields
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

    return res.status(201).json({ 
      success: true, 
      project: data,
      message: 'Project added to portfolio'
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
