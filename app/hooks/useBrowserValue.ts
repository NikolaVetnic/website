import { useSyncExternalStore } from "react";

// Nothing to follow: the value doesn't change while the page is open.
const subscribeToNothing = () => () => {};

// A value known only in the browser (its language's time format, something kept out of the HTML): the fallback
// during pre-rendering and hydration, as in the HTML, then the browser's. `get` must return the same value each
// time it's called, as strings and numbers do.
export default function useBrowserValue<Value>(get: () => Value, fallback: Value): Value {
  return useSyncExternalStore(subscribeToNothing, get, () => fallback);
}
