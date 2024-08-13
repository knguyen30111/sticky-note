# Sticky Notes

This repository contains a collection of sticky notes for organizing your tasks and ideas.

## Enviroment

- `node` 18.20.0
- `bun` 1.1.4

## Installation

To set up the Cafe Order System workspace, follow these steps:

1. Clone the repository: `$ git clone https://github.com/knguyen30111/sticky-note.git`.
2.
3. Navigate to the project folder: `$ cd sticky-note`.
4. Install the dependencies: `$ bun install`.
5. Start a local web server with HMR for development: `$ bun dev`.
6. Build the project and output to the `./dist` folder: `$ bun run dist`.
7. Run unit tests: `$ bun test`.

## Folder Structure

The folder structure of this repository is as follows:

```
.
├── src/
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── index.css
│   ├── components/
│   │   └── StickyNote.tsx
│   └── hooks/
│       ├── useResizable.ts
│       └── useDraggable.ts
├── public/
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── index.html
├── postcss.config.js
├── package.json
├── .gitignore
└── README.md
```
