import { CopilotClient } from "@github/copilot-sdk";
import { execSync } from "node:child_process";

const issueNumber = process.argv[2];
const repo = process.env.GITHUB_REPOSITORY;

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const epic = JSON.parse(
  sh(`gh issue view ${issueNumber} --repo ${repo} --json title,body`)
);

const PROMPT = `
You are a principal software architect.

PHASE 1 — Expand Brief Into Production Specification
- Target users
- Core user journeys
- Feature set (MVP + future scope)
- Non-functional requirements (performance, security, scale)
- UX quality expectations
- Abuse prevention
- Observability
- Definition of production-ready
- Explicit out-of-scope

PHASE 2 — Convert Into Agile Structure
Return structured JSON:

{
  "epics": [
    {
      "title": "",
      "description": "",
      "stories": [
        {
          "title": "",
          "description": "",
          "tasks": [
            {
              "title": "",
              "body": "",
              "labels": ["ready-for-dev"]
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Tasks must be PR-sized.
- Vertical slices only.
- No placeholders.
- No vague work.
- Must include acceptance criteria.
- Must include tests required.
- Must include out-of-scope.
- Assume production SaaS quality.

BRIEF:
${epic.title}

${epic.body}
`;

const client = new CopilotClient({
  githubToken: process.env.GITHUB_TOKEN,
});

await client.start();

const session = await client.createSession({
  model: "gpt-5",
  systemMessage: {
    content: "Produce rigorous, production-grade architecture. No fluff."
  }
});

const result = await session.sendAndWait({ prompt: PROMPT }, 600000);
const plan = JSON.parse(result.data.content);

// Create child issues (tasks only)
for (const epicBlock of plan.epics) {
  for (const story of epicBlock.stories) {
    for (const task of story.tasks) {
      const labels = (task.labels || [])
        .map(l => `--label "${l}"`)
        .join(" ");

      sh(
        `gh issue create --repo ${repo} \
        --title "${task.title}" \
        --body "${task.body.replace(/"/g, '\\"')}" \
        ${labels}`
      );
    }
  }
}

await session.destroy();
await client.stop();

sh(
  `gh issue comment ${issueNumber} \
  --repo ${repo} \
  --body "Architect completed decomposition into epics, stories, and atomic tasks."`
);
