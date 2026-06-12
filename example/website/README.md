# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔄 Payload Live Preview

This site demonstrates [server-side Live Preview](https://payloadcms.com/docs/live-preview/server) with `astro-payload-live-preview`:

- `src/pages/posts/[id].astro` renders a post via the Payload Local API and includes `<RefreshRouteOnSave />` when opened with the preview secret (`?preview=...`), fetching draft content with `draft: true`.
- `src/layouts/Layout.astro` includes Astro's `<ClientRouter />` so each save swaps the DOM in place instead of fully reloading the page.
- The Payload app (`../payload`) configures `admin.livePreview` to point at this site and enables drafts + autosave on the `posts` collection.

To try it: run both apps (`pnpm dev:payload` and `pnpm dev:website` from the repo root), then open a post in the Payload admin panel and select the **Live Preview** tab. Edits autosave and appear in the preview pane as you type.

> Note: `astro-payload-live-preview` is consumed from the workspace (`package/`), so changes to the package source are picked up immediately.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
