import { useEffect, useState, type RefObject } from "react";

export type Size = { width: number; height: number };

// The element's size, kept up to date; null until the element has been measured in the browser.
function useElementSize(ref: RefObject<HTMLElement | null>): Size | null {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export default useElementSize;
