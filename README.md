# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Local setup

## Local setup

1. Install dependencies with `npm install`.
2. Create `.env.local` in the project root if required by the current frontend configuration.
3. Start the frontend with `npm run dev`.
4. Start the backend in a second terminal with `cd backend` then `npm install` and `node server.js`.
5. Open `http://localhost:5173/`.

The Dashboard camera feed is bundled locally at `public/rover-cam-feed.jpg`, so it no longer depends on an external image URL.

The current dashboard provides AI-based hazard analysis and safety insights for monitoring mine conditions. The Gemini-based conversational AI Safety Agent was part of an earlier prototype and has been removed from the current deployed interface.
