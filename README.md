# TaskFlow

TaskFlow is a lightweight project management web application built for small teams, agencies, and freelancers managing client projects.

## Step 01: Show Your Thinking

### 1. Who is the user, and what are the top 2-3 things they want to do in TaskFlow?
The user is a freelancer, project lead, or member of a small design, development, or marketing team managing multiple client deliverables.

The top things they want to do are:
1. See what is overdue, due soon, and currently in progress without clicking through complex menus.
2. Track and update tasks across workflow stages (To Do, In Progress, Done) using a Kanban board with project and assignee filters.
3. Quickly create, edit, and assign tasks to projects and team members.

### 2. What should the app make easiest on the very first screen after login, and why?
The dashboard should make it immediately obvious which tasks are overdue and which are due soon, alongside the status of active projects.

Small teams and freelancers switch between tasks frequently. Their primary concern when opening the app is identifying urgent work and immediate blockers before looking at the broader project workload.

### 3. Describe the flow for one key task: the user opens the app, creates a new task, and assigns it to a project/status.
1. The user opens the app to the dashboard and clicks the New Task button.
2. A task creation modal opens with form fields for title, project, assignee, due date, and status.
3. The user enters the task title, selects the project and assignee from the dropdowns, sets a due date, and chooses an initial status (To Do, In Progress, or Done).
4. The user clicks Create Task.
5. The form validates the required fields, closes the modal, and adds the task to the shared state.
6. The task immediately appears in the corresponding column on the Task Board, and dashboard counts update automatically.

### 4. State the assumptions made about the product, such as single team vs multiple teams and multiple projects.
- Single Team Workspace: The application assumes one shared team with a set roster of team members.
- Multiple Projects: The app supports multiple concurrent projects with their own tasks and progress.
- Client-Side Mock State: The app uses React state with realistic mock data. Browser localStorage is used only to keep task changes across page refreshes. There is no backend or database.
- Standard Workflow: Tasks follow a simple three-column pipeline: To Do, In Progress, and Done.

## Tech Stack
- React
- JavaScript
- Tailwind CSS
- Vite
- Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
