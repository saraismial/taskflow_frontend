# TaskFlow Frontend

- React + Vite frontend for TaskFlow — a task management app with authentication, a dashboard for creating/updating tasks, and account management (profile edit, password change, account deletion).
- Demo
  - https://taskflowreact.netlify.app/login

---

## Tech Stack

- React
- Vite
- Axios
- React Router
- Context API
- Tailwind CSS (utility classes)

---

## What the App Does

After logging in, you land in a protected workspace with:

- A **Task Dashboard** to create tasks and manage your task list
- A **Profile page** to update account details, change password, or delete your account

---

## Features

### Authentication + Session

- Register + Login screens
- Stores `user`, `accessToken`, and `refreshToken` in localStorage
- Axios request interceptor automatically attaches the access token to requests
- Axios response interceptor automatically attempts token refresh on 401 (and retries the original request)

### Task Dashboard

- Fetches tasks from the API and displays them in a list
- Create tasks with:
  - title
  - description (optional)
  - priority (high/medium/low)
  - status
  - due date (optional)
- Sorts tasks by **due date** first, then **priority**
- Edit tasks in an **Edit Task modal**
- Delete tasks with a confirmation prompt
- Shows current date + task count

### Profile & Account Management

- Profile page shows name/email/role
- **Edit Profile modal**
- **Change Password modal**
- **Delete Account modal** (danger zone)

### Theme (WIP)

- Includes a ThemeContext with `day` and `night` modes and saved preference in localStorage.

---

## API Configuration

The frontend calls the backend via Axios:

- Base URL: `http://localhost:5050/api`

If your backend runs elsewhere, update the base URL in:

- `src/api/client.js`
