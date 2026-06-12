import { isDocumentEvent, ready } from '@payloadcms/live-preview'

export type RefreshSubscription = (event: MessageEvent) => void

// Module-scoped so the ready handshake is only sent once per page load,
// even when the component remounts across view transition swaps.
let hasSentReadyMessage = false

/**
 * Listens for Payload `payload-document-event` messages and calls `refresh`
 * each time the document is saved or autosaved in the admin panel.
 *
 * Unlike the React `RefreshRouteOnSave`, this does NOT refresh on mount:
 * Astro SSR pages are freshly rendered when the preview iframe loads them,
 * and an initial refresh would loop when falling back to full page reloads.
 *
 * @returns the subscription, pass it to `unsubscribeFromRefresh` on teardown
 *
 * @link https://payloadcms.com/docs/live-preview/server
 */
export const subscribeToRefresh = (args: {
  refresh: () => Promise<void> | void
  serverURL: string
}): RefreshSubscription => {
  const { refresh, serverURL } = args

  const subscription: RefreshSubscription = (event) => {
    if (isDocumentEvent(event, serverURL)) {
      void refresh()
    }
  }

  window.addEventListener('message', subscription)

  if (!hasSentReadyMessage) {
    hasSentReadyMessage = true

    ready({
      serverURL,
    })
  }

  return subscription
}

export const unsubscribeFromRefresh = (subscription: RefreshSubscription): void => {
  window.removeEventListener('message', subscription)
}
