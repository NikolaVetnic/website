// The page usually runs inside the site's K’NOSSOS window, in an iframe. A link to another page of the site then
// asks the site to open it in its own window (the Blog for a post) instead of loading the whole site inside this
// window; see the site's AppPage component. On its own, the page follows the link as usual.
export function openInSite(event, path) {
  if (window.parent === window || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
    return;
  }
  event.preventDefault();
  window.parent.postMessage({ type: "open", path }, window.location.origin);
}
