# astro-payload-live-preview

[Payload CMS](https://payloadcms.com) [Live Preview](https://payloadcms.com/docs/live-preview/overview) for [Astro](https://astro.build) — see your draft content update in the Payload admin panel as you type.

This package implements Payload's [server-side Live Preview](https://payloadcms.com/docs/live-preview/server) mode for Astro: every time a document is saved (draft save, autosave, or publish), the admin panel notifies your Astro site, which re-renders the route on the server and swaps the new HTML in place — no full page reload when you use Astro's `<ClientRouter />`.

```
┌─────────────────────────┐    save / autosave    ┌──────────────────────────┐
│  Payload admin panel    │ ──── postMessage ───► │  Your Astro site (SSR)   │
│  (Live Preview iframe)  │                       │  <RefreshRouteOnSave />  │
└─────────────────────────┘                       │  → re-fetch + DOM swap   │
                                                  └──────────────────────────┘
```

## Requirements

- **Astro 4 or 5 in SSR mode** — `output: 'server'` (or `export const prerender = false` on preview routes) with any adapter. Statically generated pages cannot reflect saved changes without a rebuild.
- **Payload 3.x** running anywhere your Astro server can reach (separate app, same monorepo, etc.)
- **Drafts + autosave** enabled on the collections you want to preview (autosave is what makes it feel live — set a low interval like `100`).

## Installation

```bash
npm install astro-payload-live-preview
# or
pnpm add astro-payload-live-preview
```

## Usage

**1. Configure Live Preview in your Payload config**, pointing at your Astro site. Include a preview secret so only the admin panel can see drafts:

```ts
// payload.config.ts
export default buildConfig({
  admin: {
    livePreview: {
      collections: ['posts'],
      url: ({ data }) =>
        `${process.env.ASTRO_URL}/posts/${data.id}?preview=${process.env.PREVIEW_SECRET}`,
    },
  },
  collections: [
    {
      slug: 'posts',
      fields: [{ name: 'title', type: 'text', required: true }],
      versions: {
        drafts: {
          autosave: { interval: 100 },
        },
      },
    },
  ],
})
```

**2. Render `<RefreshRouteOnSave />` on your Astro page**, fetching drafts only when the preview secret matches:

```astro
---
// src/pages/posts/[id].astro
import { RefreshRouteOnSave } from 'astro-payload-live-preview'

const isPreview = Astro.url.searchParams.get('preview') === process.env.PREVIEW_SECRET

// Fetch from Payload however you like: Local API, REST, or GraphQL.
// Pass draft: true (Local API) or ?draft=true (REST) when previewing.
const post = await fetchPost(Astro.params.id, { draft: isPreview })

if (!post) {
  return new Response(null, { status: 404 })
}
---

<h1>{post.title}</h1>
{isPreview && <RefreshRouteOnSave serverURL={process.env.PAYLOAD_SERVER_URL} />}
```

`serverURL` is the origin of your Payload admin panel (e.g. `http://localhost:3000`). It is used to validate the origin of incoming `postMessage` events.

**3. (Recommended) Add `<ClientRouter />` to your layout** for flicker-free refreshes:

```astro
---
import { ClientRouter } from 'astro:transitions'
---
<head>
  <ClientRouter />
</head>
```

With `<ClientRouter />`, each save swaps the DOM in place and preserves scroll position. Without it, the component falls back to a standard full-page reload — still functional, just less smooth.

## API

### `<RefreshRouteOnSave serverURL={string} />`

Astro component. Renders an invisible custom element that listens for Payload document events and refreshes the current route on each save.

### `subscribeToRefresh({ serverURL, refresh })` / `unsubscribeFromRefresh(subscription)`

Lower-level helpers (also available from `astro-payload-live-preview/client`) if you want to wire up your own client script with a custom refresh strategy.

## Fetching draft content

Your Astro server runs separately from Payload, so draft access needs an explicit strategy. The pattern used here and in the [example](https://github.com/BrainWeb/astro-payload-live-preview/tree/main/example):

1. Put a secret in the `admin.livePreview.url` query string (`?preview=...`).
2. On the Astro side, compare it against the same secret from your environment.
3. Only fetch with `draft: true` when it matches.

If you fetch over REST instead of the Local API, authenticate the server-to-server request (e.g. an API key user) since draft access requires an authenticated user by default.

## Example

The [`example/`](https://github.com/BrainWeb/astro-payload-live-preview/tree/main/example) directory contains a complete working setup: a Payload app (`example/payload`) and an Astro site (`example/website`) sharing a MongoDB database via the Local API.

```bash
pnpm install

# copy the .env examples and adjust if needed
cp example/payload/.env.example example/payload/.env
cp example/website/.env.example example/website/.env

# requires MongoDB on localhost:27017 (e.g. docker run -p 27017:27017 mongo)
pnpm dev:payload   # Payload admin on http://localhost:3000
pnpm dev:website   # Astro site on http://localhost:4321
```

Then open a post in the admin panel and select the **Live Preview** tab. Edits autosave and appear in the preview pane as you type.

## How it works

- Payload's admin panel embeds your Astro page in an iframe (or popup) and emits a `payload-document-event` via `window.postMessage` on every save.
- This package's component sends the [`ready`](https://payloadcms.com/docs/live-preview/server#building-your-own-router-refresh-component) handshake, listens for document events (validating the event origin against `serverURL`), and refreshes via `navigate()` from `astro:transitions/client` — falling back to `window.location.reload()` when view transitions aren't enabled.
- Unlike Payload's React `RefreshRouteOnSave`, it deliberately does **not** refresh on mount: Astro SSR pages are freshly rendered when the iframe loads them, and a mount-time refresh would loop under the full-reload fallback.

## Development

This is a pnpm workspace:

- `package/` — the publishable package (source in `package/src`, the example consumes it directly so changes apply immediately)
- `example/` — the Payload + Astro demo apps

```bash
pnpm build    # build the package (dist/)
pnpm release  # build + publish to npm
```

## License

[MIT](https://github.com/BrainWeb/astro-payload-live-preview/blob/main/LICENSE.md)
