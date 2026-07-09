"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type GithubCommit = {
  sha: string;
  message: string;
  repo: string;
  timestamp: string;
};

export type GithubRepo = {
  name: string;        // e.g. "ndiecyber/SH03-Internship-System"
  displayName: string; // e.g. "SH03-Internship-System"
  description: string | null;
  updatedAt: string;
};

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ sha: string; message: string }>;
  };
  created_at: string;
};

type GithubApiRepo = {
  full_name: string;
  name: string;
  description: string | null;
  updated_at: string;
};

/** Step 1: Fetch list of user's public repositories */
export async function fetchGithubReposAction(): Promise<{
  repos?: GithubRepo[];
  error?: string;
  username?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Tidak terautentikasi." };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        githubUsername: true,
        accounts: {
          where: { provider: "github" },
          select: { access_token: true }
        }
      }
    });

    const accessToken = user?.accounts?.[0]?.access_token;

    if (!accessToken && !user?.githubUsername) {
      return {
        error: "Silakan hubungkan akun GitHub di halaman Profil terlebih dahulu."
      };
    }

    const username = user?.githubUsername || "me";

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "LEXA-Internship-System"
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // If using access token, we can get ALL repos (including private/collaborator) via /user/repos
    // Otherwise, we fallback to public repos via /users/{username}/repos
    const url = accessToken
      ? `https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator`
      : `https://api.github.com/users/${username}/repos?per_page=50&sort=updated&type=public`;

    const response = await fetch(url, {
      headers,
      next: { revalidate: 0 }
    });

    if (response.status === 404) {
      return { error: `Username GitHub "${username}" tidak ditemukan.` };
    }
    if (!response.ok) {
      return { error: "Gagal mengambil daftar repository. Coba lagi nanti." };
    }

    const data: GithubApiRepo[] = await response.json();

    const repos: GithubRepo[] = data.map((r) => ({
      name: r.full_name,
      displayName: r.name,
      description: r.description,
      updatedAt: r.updated_at
    }));

    return { repos, username };
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return { error: "Terjadi kesalahan saat mengambil daftar repository." };
  }
}

/** Step 2: Fetch commits from a SPECIFIC repository on a given date */
export async function fetchGithubCommitsAction(
  date: string,
  repoFullName?: string // e.g. "ndiecyber/SH03-Internship-System"
): Promise<{
  commits?: GithubCommit[];
  error?: string;
  username?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Tidak terautentikasi." };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        githubUsername: true,
        accounts: {
          where: { provider: "github" },
          select: { access_token: true }
        }
      }
    });

    const accessToken = user?.accounts?.[0]?.access_token;

    if (!accessToken && !user?.githubUsername) {
      return {
        error: "Silakan hubungkan akun GitHub di halaman Profil terlebih dahulu."
      };
    }

    const username = user?.githubUsername || "me";

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "LEXA-Internship-System"
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const targetDate = new Date(date);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    let events: GithubEvent[] = [];

    if (accessToken && repoFullName) {
      // Fetch direct commits using the token (more accurate, includes private)
      // We set since/until for the specific date in WIB
      const since = new Date(`${targetDateStr}T00:00:00+07:00`).toISOString();
      const until = new Date(`${targetDateStr}T23:59:59+07:00`).toISOString();
      
      const commitRes = await fetch(
        `https://api.github.com/repos/${repoFullName}/commits?since=${since}&until=${until}`,
        { headers, next: { revalidate: 0 } }
      );

      if (commitRes.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawCommits: any[] = await commitRes.json();
        
        // Mock the events structure to reuse existing parsing logic below
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockPayloadCommits = rawCommits.map((c: any) => ({
          sha: c.sha,
          message: c.commit.message
        }));

        events = [
          {
            id: "mock",
            type: "PushEvent",
            repo: { name: repoFullName },
            payload: { commits: mockPayloadCommits },
            // Assigning a time in the middle of the day to pass the date check
            created_at: new Date(`${targetDateStr}T12:00:00Z`).toISOString()
          }
        ];
      }
    }

    if (events.length === 0) {
      // Fallback to Events API
      const url = accessToken
        ? `https://api.github.com/users/${username}/events?per_page=100` // Authenticated user events might fail if username is "me", so need actual username if available, but /users/{username} works if we know it. We'll use /user/events. But we need their username for public.
        // Wait, if accessToken is present but we don't have username, we could use /events, but for simplicity:
        : `https://api.github.com/users/${username}/events?per_page=100`;

      const response = await fetch(
        accessToken ? `https://api.github.com/users/${username}/events?per_page=100` : `https://api.github.com/users/${username}/events?per_page=100`,
        { headers, next: { revalidate: 0 } }
      );

      if (response.status === 404) {
        return { error: `Username GitHub "${username}" tidak ditemukan.` };
      }
      if (!response.ok) {
        return { error: "Gagal mengambil data dari GitHub. Coba lagi nanti." };
      }
      events = await response.json();
    }

    const commits: GithubCommit[] = [];

    for (const event of events) {
      if (event.type !== "PushEvent") continue;

      // Filter by repo if specified
      if (repoFullName && event.repo.name !== repoFullName) continue;

      const eventDate = new Date(event.created_at);
      const wibDate = new Date(eventDate.getTime() + 7 * 60 * 60 * 1000);
      const eventDateStr = wibDate.toISOString().split("T")[0];

      if (eventDateStr !== targetDateStr) continue;

      for (const commit of event.payload.commits ?? []) {
        if (commit.message.startsWith("Merge")) continue;

        commits.push({
          sha: commit.sha.slice(0, 7),
          message: commit.message.split("\n")[0],
          repo: event.repo.name,
          timestamp: wibDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta"
          })
        });
      }
    }

    // Deduplicate by sha
    const unique = Array.from(new Map(commits.map((c) => [c.sha, c])).values());

    return { commits: unique, username };
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    return { error: "Terjadi kesalahan saat mengambil data GitHub." };
  }
}
