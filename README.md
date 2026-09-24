# TaskFlow

TaskFlow is a lightweight, responsive project management web application for small dev/design/marketing teams, agencies, and freelancers managing client projects.

## Step 01: Show Your Thinking

### 1. Who is the user, and what are the top 2–3 things they want to do in TaskFlow?
- **Target User:** Solo freelancers, project leads, agency managers, and members of small dev/design/marketing teams handling multiple deliverables across client projects.
- **Top Objectives:**
  1. **Get Instant Visibility:** Instantly identify overdue items, upcoming deadlines, and overall workload across active projects without digging through complex nested menus.
  2. **Track & Update Execution:** Visualize and update task progress across workflow stages (To Do, In Progress, Done) via a focused Kanban board with real-time filtering by project and assignee.
  3. **Capture & Organize Work Quickly:** Create, edit, and assign tasks to projects and team members in seconds with minimal friction.

### 2. What should the app make easiest on the very first screen after login, and why?
- **Core Priority:** The Dashboard/Home screen must make spotting risks (overdue tasks and tasks due soon) and assessing active project workload effortless within 5 seconds of entering.
- **Rationale:** Small teams and agency leads operate in fast-paced environments where context switching is high. Their immediate operational question is "What is overdue or due right now?" followed by "What is in progress?". Placing urgent metrics, overdue warnings, upcoming deliverables, and active project distributions front and center removes friction and enables immediate action.

### 3. Describe the flow for one key task: the user opens the app, creates a new task, and assigns it to a project/status.
1. **Entry:** The user opens TaskFlow; the dashboard loads with synchronized project metrics and a prominent "New Task" button in the navigation header and dashboard actions.
2. **Trigger:** The user clicks "New Task", which opens the task creation form modal.
3. **Data Input & Assignment:**
   - Enters the task title.
   - Selects the target project from the project dropdown.
   - Selects the designated assignee from the team member list.
   - Sets the target due date.
   - Chooses the initial status (`To Do`, `In Progress`, or `Done`).
4. **Submission & Propagation:** The user clicks "Create Task". Validation confirms required fields, the modal closes, and the shared React state updates immediately.
5. **Immediate Feedback:** If on the Dashboard, project task totals and due metrics update instantly; if navigating to the Task Board, the new task card appears in its respective Kanban column with project code, assignee avatar, and due date indicator.

### 4. State the assumptions made about the product, such as single team vs multiple teams and multiple projects.
- **Single Workspace / Single Team:** Operates under a unified workspace model representing one agency or internal team with a shared roster of team members.
- **Multiple Concurrent Projects:** Full support for managing multiple distinct client projects simultaneously, each with its own health and task breakdown.
- **In-Memory & Persistent State:** Uses reactive client-side React state synchronized with browser `localStorage` for immediate responsiveness and continuity across refreshes without backend latency.
- **No Authentication Overhead:** Assumes direct authenticated access into the workspace context to maximize operational focus for evaluation.
- **Standard Three-Stage Workflow:** A clear delivery pipeline (`To Do` -> `In Progress` -> `Done`) matching agile agency workflows.

---

## Tech Stack
- **Framework:** React
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or later)
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
