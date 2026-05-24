// jsdom polyfills for sh3-core's viewport / layout stores.
// Loaded for any test that runs under the `jsdom` environment.

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as { ResizeObserver?: typeof RO }).ResizeObserver = RO;
}
