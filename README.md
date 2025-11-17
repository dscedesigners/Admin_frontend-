Admin Frontend (React + Vite)

This repository contains the frontend for an admin dashboard built with React and Vite. The UI provides pages for Dashboard, Customers, Orders, and Vendors, plus shared layout and components.

**This README covers:** how to run the frontend locally, what modules are implemented, and quick notes about integration with the backend.

**Prerequisites**
- Node.js (v16+ recommended) and npm
- Backend server running (by default expected at `http://localhost:5000`) or set a custom API base URL (see Environment section)

**Install & Run (development)**
1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server (Vite):

   ```bash
   npm run dev
   ```

3. Open your browser at the address Vite shows (usually `http://localhost:5173`).

**Build / Preview (production)**

```bash
npm run build
npm run preview
```

**Frontend ↔ Backend integration**
- The frontend API client (`src/api/index.js`) uses `http://localhost:5000/api` as the default backend base URL.

Completed Modules (frontend)
- Pages: `Dashboard`, `Customers`, `CustomerDetails`, `Orders`, `Vendors` — 5 pages completed
- Components: `Header`, `Layout`, `Sidebar`, `SalesSummary`, `TopProducts`, `OrdersOverview`, `OrdersTable` — shared UI components implemented
- API clients: `src/api/` contains clients for `customers.js`, `dashboard.js`, `orders.js`, `products.js`, and `vendors.js`

Notes & Next steps
- The frontend expects API endpoints under `/api` (e.g. `/api/auth`, `/api/users`, `/api/product`, `/api/order`, `/api/admin`). Make sure the backend runs on the port the frontend expects or update `API_BASE_URL`.
- Add environment support (e.g. `.env` + Vite `import.meta.env`) if you want different base URLs for dev/production.

Hosting / Deployment
- not hosted yet


---
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
