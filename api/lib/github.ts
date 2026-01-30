// GitHub API integration for project management
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Arviva-Admin';

export interface CreateRepoOptions {
  name: string;
  description: string;
  private?: boolean;
  autoInit?: boolean;
}

export interface CommitFileOptions {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
}

/**
 * Creates a new GitHub repository
 */
export async function createRepository(options: CreateRepoOptions) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: options.name,
      description: options.description,
      private: options.private ?? false,
      auto_init: options.autoInit ?? true,
    });

    return {
      success: true,
      repo: {
        name: response.data.name,
        fullName: response.data.full_name,
        url: response.data.html_url,
        cloneUrl: response.data.clone_url,
        defaultBranch: response.data.default_branch,
      },
    };
  } catch (error: any) {
    console.error('Error creating repository:', error);
    throw new Error(`Failed to create repository: ${error.message}`);
  }
}

/**
 * Creates or updates a file in a repository
 */
export async function createOrUpdateFile(options: CommitFileOptions) {
  try {
    const { owner, repo, path, content, message, branch = 'main' } = options;

    // Check if file exists
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (error: any) {
      // File doesn't exist, that's ok
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(sha && { sha }),
    });

    return {
      success: true,
      commit: {
        sha: response.data.commit.sha,
        url: response.data.commit.html_url,
      },
    };
  } catch (error: any) {
    console.error('Error creating/updating file:', error);
    throw new Error(`Failed to create/update file: ${error.message}`);
  }
}

/**
 * Creates multiple files in a repository using a single commit
 */
export async function commitMultipleFiles(
  repo: string,
  files: Array<{ path: string; content: string }>,
  message: string,
  branch: string = 'main'
) {
  try {
    const owner = GITHUB_OWNER;

    // Get the latest commit SHA
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const latestCommitSha = refData.object.sha;

    // Get the tree SHA
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: data.sha,
        };
      })
    );

    // Create a new tree
    const { data: treeData } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: blobs,
    });

    // Create a new commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    });

    // Update the reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return {
      success: true,
      commit: {
        sha: newCommit.sha,
        url: newCommit.html_url,
      },
    };
  } catch (error: any) {
    console.error('Error committing multiple files:', error);
    throw new Error(`Failed to commit files: ${error.message}`);
  }
}

/**
 * Lists all repositories for the authenticated user
 */
export async function listRepositories() {
  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return data.map((repo: any) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      private: repo.private,
      defaultBranch: repo.default_branch,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));
  } catch (error: any) {
    console.error('Error listing repositories:', error);
    throw new Error(`Failed to list repositories: ${error.message}`);
  }
}

/**
 * Deletes a repository
 */
export async function deleteRepository(repo: string) {
  try {
    await octokit.repos.delete({
      owner: GITHUB_OWNER,
      repo,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting repository:', error);
    throw new Error(`Failed to delete repository: ${error.message}`);
  }
}
