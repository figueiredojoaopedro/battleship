📄 ADR 001 – Use React and TypeScript for Frontend Development

Status: Accepted
Date: 2025-05-13
Context:
We are developing a browser-based Batalha Naval (Battleship) game. The frontend must support a dynamic UI with interactive components, such as game boards, cells, and drag-and-drop ship placement. We also want strong typing and developer tooling to avoid runtime errors during gameplay.

Decision:
We chose to use React with TypeScript for the following reasons:
• React offers a component-based structure which fits well for building the board, cells, and controls as reusable units.
• TypeScript enhances code reliability with static typing, catching errors at compile-time.
• The React ecosystem (e.g., hooks, dev tools, libraries) will help with state management, interactivity, and future scalability.
• We will use create-react-app with the TypeScript template to scaffold the project quickly.

Consequences:
• Developers must have familiarity with both React and TypeScript.
• We need to define and maintain custom types for game-related entities (e.g., ships, cells).
• We will benefit from improved maintainability, type safety, and editor support (autocomplete, type checking).
• Future architecture decisions (e.g., multiplayer support, state management with Redux or Zustand) will need to align with this tech stack.

batalha-naval/
├── public/
│ └── index.html
├── src/
│ ├── assets/ # Images, icons, sounds, etc.
│ ├── components/ # Reusable UI components
│ │ ├── Board/
│ │ │ ├── Board.tsx
│ │ │ └── Board.css
│ │ ├── Cell/
│ │ │ ├── Cell.tsx
│ │ │ └── Cell.css
│ │ └── Ship.tsx
│ ├── game/ # Game logic and utilities
│ │ ├── gameLogic.ts
│ │ └── types.ts
│ ├── hooks/ # Custom React hooks
│ ├── App.tsx # Root component
│ ├── App.css
│ ├── index.tsx # Entry point
│ └── styles/ # Global styles
│ └── globals.css
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json (if using TypeScript)

1. ✅ Design the board layout (10x10 grid using Tailwind and components)
2. ✅ Create reusable <Cell /> and <Board /> components
3. ✅ Add game logic (turns, ship placement, hits/misses)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
# battleship
