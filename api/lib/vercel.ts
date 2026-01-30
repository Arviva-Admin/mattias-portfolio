// Vercel API integration for deployments
interface VercelDeployment {
  id: string;
  url: string;
  readyState: string;
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

async function vercelFetch(endpoint: string, options: RequestInit = {}) {
  const url = `https://api.vercel.com${endpoint}`;
  const headers = {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
    ...(VERCEL_TEAM_ID && { 'X-Vercel-Team-Id': VERCEL_TEAM_ID }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error: ${response.status} - ${error}`);
  }

  return response.json();
}

export interface CreateProjectOptions {
  name: string;
  gitRepository: {
    type: 'github';
    repo: string; // format: "owner/repo"
  };
  framework?: 'nextjs' | 'vite' | 'remix' | 'astro' | 'create-react-app';
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  environmentVariables?: Array<{
    key: string;
    value: string;
    target: Array<'production' | 'preview' | 'development'>;
  }>;
}

/**
 * Creates a new Vercel project
 */
export async function createProject(options: CreateProjectOptions) {
  try {
    const data = await vercelFetch('/v9/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: options.name,
        gitRepository: options.gitRepository,
        framework: options.framework,
        buildCommand: options.buildCommand,
        outputDirectory: options.outputDirectory,
        installCommand: options.installCommand,
        environmentVariables: options.environmentVariables,
      }),
    });

    return {
      success: true,
      project: {
        id: data.id,
        name: data.name,
        framework: data.framework,
      },
    };
  } catch (error: any) {
    console.error('Error creating Vercel project:', error);
    throw new Error(`Failed to create Vercel project: ${error.message}`);
  }
}

/**
 * Triggers a new deployment for a project
 */
export async function deployProject(projectName: string, gitSource?: {
  type: 'github';
  repoId: string;
  ref: string;
}) {
  try {
    const data = await vercelFetch('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        gitSource,
        target: 'production',
      }),
    });

    return {
      success: true,
      deployment: {
        id: data.id,
        url: data.url,
        readyState: data.readyState,
      },
    };
  } catch (error: any) {
    console.error('Error deploying project:', error);
    throw new Error(`Failed to deploy project: ${error.message}`);
  }
}

/**
 * Gets deployment status
 */
export async function getDeployment(deploymentId: string): Promise<VercelDeployment> {
  try {
    const data = await vercelFetch(`/v13/deployments/${deploymentId}`);
    return {
      id: data.id,
      url: data.url,
      readyState: data.readyState,
    };
  } catch (error: any) {
    console.error('Error getting deployment:', error);
    throw new Error(`Failed to get deployment: ${error.message}`);
  }
}

/**
 * Lists all projects
 */
export async function listProjects() {
  try {
    const data = await vercelFetch('/v9/projects');
    return data.projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      framework: project.framework,
      createdAt: project.createdAt,
    }));
  } catch (error: any) {
    console.error('Error listing projects:', error);
    throw new Error(`Failed to list projects: ${error.message}`);
  }
}

/**
 * Deletes a Vercel project
 */
export async function deleteProject(projectId: string) {
  try {
    await vercelFetch(`/v9/projects/${projectId}`, {
      method: 'DELETE',
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Adds environment variables to a project
 */
export async function addEnvironmentVariables(
  projectId: string,
  variables: Array<{
    key: string;
    value: string;
    target: Array<'production' | 'preview' | 'development'>;
  }>
) {
  try {
    const results = await Promise.all(
      variables.map((variable) =>
        vercelFetch(`/v10/projects/${projectId}/env`, {
          method: 'POST',
          body: JSON.stringify(variable),
        })
      )
    );

    return { success: true, count: results.length };
  } catch (error: any) {
    console.error('Error adding environment variables:', error);
    throw new Error(`Failed to add environment variables: ${error.message}`);
  }
}
