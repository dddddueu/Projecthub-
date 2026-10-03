# ProjectHub - Secure Project Management Workspace

A modern, full-featured project management web application built with **React 19**, **Vite**, **Tailwind CSS**, and **Firebase Firestore / Authentication**, featuring strict **Row Level Security (RLS)** policy parity.

---

## Features

- **Row Level Security (RLS) Parity**:
  Every query and document write is guarded by database security rules matching:
  ```sql
  CREATE POLICY "Users can manage own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);
  ```
- **Real-Time Data Sync**: Projects update instantaneously across active tabs using Firestore listeners.
- **Full Project Lifecycle Management**: Create, edit, inspect, and delete projects with statuses (*Planning*, *In Progress*, *Completed*, *On Hold*) and priority tiers (*Low*, *Medium*, *High*, *Urgent*).
- **Flexible Views**: Seamlessly switch between responsive **Grid Cards** and detailed **Data Table** views.
- **Live Search & Filters**: Search across project titles and descriptions, filter by status or priority, and sort by date or title.
- **Security Inspector**: Embedded policy inspector displaying active user authentication token state and policy definition.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or later recommended)
- `npm` or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-app.git
   cd your-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration & Firebase Setup

The app connects to Firebase using configuration stored in `firebase-applet-config.json`:

```json
{
  "projectId": "your-firebase-project-id",
  "appId": "your-app-id",
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "firestoreDatabaseId": "your-database-id",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your-sender-id"
}
```

### Deploying Security Rules

Security rules are defined in `firestore.rules`. To deploy them using Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

---

## Available Scripts

- `npm run dev` - Starts the Vite development server on port 3000
- `npm run build` - Builds production-ready assets into the `dist/` folder
- `npm run preview` - Locally previews the production build
- `npm run lint` - Type-checks the codebase using TypeScript (`tsc --noEmit`)
