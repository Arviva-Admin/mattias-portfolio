import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
// import * as github from './lib/github';
// import * as vercel from './lib/vercel';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// AI capabilities configuration
const CAPABILITIES = {
  database: {
    read: true,
    write: true,
    delete: true,
  },
  github: {
    createRepo: true,
    commit: true,
    push: true,
    createPR: true,
  },
  vercel: {
    deploy: true,
    updateEnv: true,
    getDomains: true,
  },
  codeGeneration: {
    createProject: true,
    modifyCode: true,
    chooseTechStack: true,
  },
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Tool definitions for the AI
const tools = [
  {
    type: 'function',
    function: {
      name: 'create_project',
      description: 'Creates a new project with GitHub repo and Vercel deployment',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name' },
          description: { type: 'string', description: 'Project description' },
          framework: {
            type: 'string',
            enum: ['nextjs', 'vite-react', 'remix', 'astro'],
            description: 'Framework to use',
          },
          features: {
            type: 'array',
            items: { type: 'string' },
            description: 'Features to include',
          },
        },
        required: ['name', 'description', 'framework'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'modify_project_code',
      description: 'Modifies code in an existing project',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID from database' },
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                content: { type: 'string' },
              },
            },
            description: 'Files to create or modify',
          },
          commitMessage: { type: 'string', description: 'Git commit message' },
        },
        required: ['projectId', 'files', 'commitMessage'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_projects',
      description: 'Lists all projects from the database',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_project',
      description: 'Deletes a project and its resources',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID to delete' },
        },
        required: ['projectId'],
      },
    },
  },
];

// Starter templates for different frameworks
function getStarterFiles(framework: string, projectName: string) {
  const templates: Record<string, Array<{ path: string; content: string }>> = {
    'vite-react': [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
          devDependencies: {
            '@types/react': '^18.2.43',
            '@types/react-dom': '^18.2.17',
            '@vitejs/plugin-react': '^4.2.1',
            typescript: '^5.2.2',
            vite: '^5.0.8',
          },
        }, null, 2),
      },
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      },
      {
        path: 'src/main.tsx',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      },
      {
        path: 'src/App.tsx',
        content: `function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>${projectName}</h1>
      <p>Welcome to your new project!</p>
    </div>
  )
}

export default App`,
      },
      {
        path: 'src/index.css',
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}`,
      },
      {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      },
    ],
    nextjs: [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
          },
          dependencies: {
            react: '^18',
            'react-dom': '^18',
            next: '14',
          },
        }, null, 2),
      },
      {
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>${projectName}</h1>
      <p>Welcome to your new Next.js project!</p>
    </main>
  )
}`,
      },
      {
        path: 'app/layout.tsx',
        content: `export const metadata = {
  title: '${projectName}',
  description: 'Generated by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      },
    ],
  };

  return templates[framework] || templates['vite-react'];
}

// Function implementations
async function executeFunction(name: string, args: any) {
  switch (name) {
    case 'get_projects': {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { projects: data };
    }

    case 'create_project': {
      // TODO: Implement GitHub + Vercel integration
      return {
        success: false,
        message: 'Project creation coming soon! GitHub & Vercel APIs will be integrated.',
        projectData: args,
      };
    }

    case 'modify_project_code': {
      // TODO: Implement GitHub commit + push
      return {
        success: false,
        message: 'Code modification coming soon!',
        projectId: args.projectId,
      };
    }

    case 'delete_project': {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', args.projectId);
      
      if (deleteError) throw deleteError;
      return { success: true, deletedId: args.projectId };
    }

    default:
      throw new Error(`Unknown function: ${name}`);
  }
}

async function callOpenRouter(messages: ChatMessage[]) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const systemPrompt = `Du är en kraftfull AI-assistent med full kontroll över användarens projekt.

Du har tillgång till följande verktyg via function calling:
- create_project: Skapar GitHub repo + Vercel deploy
- modify_project_code: Ändrar kod i befintliga projekt
- get_projects: Listar alla projekt
- delete_project: Raderar projekt

När användaren frågar om något, använd rätt verktyg för att utföra uppgiften.
Svara alltid på svenska.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.VERCEL_URL || 'https://mattias-portfolio.vercel.app',
      'X-Title': 'Portfolio AI Assistant',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-70b-instruct:free', // Gratis & kraftfull
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      tools,
      tool_choice: 'auto',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // Call OpenRouter AI
    const aiResponse = await callOpenRouter(messages);
    const assistantMessage = aiResponse.choices[0].message;

    // Check if AI wants to use a tool
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // Execute the function
      const result = await executeFunction(functionName, functionArgs);

      // Call AI again with function result
      const finalResponse = await callOpenRouter([
        ...messages,
        assistantMessage,
        {
          role: 'tool',
          content: JSON.stringify(result),
          tool_call_id: toolCall.id,
        } as any,
      ]);

      return res.status(200).json({
        message: finalResponse.choices[0].message.content,
        functionCalled: functionName,
        result,
      });
    }

    // No tool call, just return the message
    return res.status(200).json({
      message: assistantMessage.content,
      capabilities: CAPABILITIES,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
