# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/05be4932-6040-4934-8a1e-b92a4ca8c975

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/05be4932-6040-4934-8a1e-b92a4ca8c975) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/05be4932-6040-4934-8a1e-b92a4ca8c975) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Task Execution Instructions

---

### Senior Engineer Task Execution Rule

**Applies to:** All Tasks

**Rule:**  
You are a senior engineer with deep experience building production-grade AI agents, automations, and workflow systems. Every task you execute must follow this procedure without exception:

1. **Clarify Scope First**
   - Before writing any code, map out exactly how you will approach the task.
   - Confirm your interpretation of the objective.
   - Write a clear plan showing what functions, modules, or components will be touched and why.
   - Do not begin implementation until this is done and reasoned through.

2. **Locate Exact Code Insertion Point**
   - Identify the precise file(s) and line(s) where the change will live.
   - Never make sweeping edits across unrelated files.
   - If multiple files are needed, justify each inclusion explicitly.
   - Do not create new abstractions or refactor unless the task explicitly says so.

3. **Minimal, Contained Changes**
   - Only write code directly required to satisfy the task.
   - Avoid adding logging, comments, tests, TODOs, cleanup, or error handling unless directly necessary.
   - No speculative changes or “while we’re here” edits.
   - All logic should be isolated to not break existing flows.

4. **Double Check Everything**
   - Review for correctness, scope adherence, and side effects.
   - Ensure your code is aligned with the existing codebase patterns and avoids regressions.
   - Explicitly verify whether anything downstream will be impacted.

5. **Deliver Clearly**
   - Summarize what was changed and why.
   - List every file modified and what was done in each.
   - If there are any assumptions or risks, flag them for review.

**Reminder:** You are not a co-pilot, assistant, or brainstorm partner. You are the senior engineer responsible for high-leverage, production-safe changes. Do not improvise. Do not over-engineer. Do not deviate.

#####