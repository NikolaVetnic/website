// Draws the Mermaid diagrams in rendered Markdown (`.prose-diagram`, see markdown.server.ts), in the site's own
// colours. Mermaid is large, so it's fetched only when a page has a diagram.

// A token from app.css (an RGB triplet, `27 43 58`) as #rrggbb, mixed toward another by `amount` (0–1).
function token(name: string, mixWith?: string, amount = 0): string {
  const style = getComputedStyle(document.documentElement);
  const read = (key: string) => style.getPropertyValue(key).trim().split(/\s+/).map(Number);
  const base = read(name);
  const other = mixWith ? read(mixWith) : base;
  return `#${base
    .map((value, index) =>
      Math.round(value + (other[index] - value) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

let count = 0;

export async function drawDiagrams(container: HTMLElement): Promise<void> {
  const figures = [...container.querySelectorAll<HTMLElement>(".prose-diagram")];
  if (figures.length === 0) {
    return;
  }

  const { default: mermaid } = await import("mermaid");
  const dark = document.documentElement.dataset.theme === "dark";
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    // The lighter layout engine; ELK, the other, is over a megabyte.
    layout: "dagre",
    theme: "base",
    fontFamily: getComputedStyle(container).fontFamily,
    themeVariables: {
      darkMode: dark,
      background: token("--surface-top"),
      primaryColor: token("--raised"),
      primaryTextColor: token("--text"),
      primaryBorderColor: token("--accent"),
      lineColor: token("--text-muted"),
      textColor: token("--text"),
      clusterBkg: token("--surface-top", "--text", 0.05),
      clusterBorder: token("--surface-top", "--text", 0.2),
      edgeLabelBackground: token("--surface-top"),
    },
  });

  for (const figure of figures) {
    // The source stays on the figure, so the diagram can be drawn again in other colours.
    figure.dataset.source ??= figure.querySelector(".prose-diagram__source")?.textContent ?? "";
    try {
      const { svg } = await mermaid.render(`prose-diagram-${++count}`, figure.dataset.source);
      if (figure.isConnected) {
        figure.innerHTML = svg;
        figure.classList.add("prose-diagram--drawn");
      }
    } catch {
      // A diagram Mermaid can't read keeps showing its source.
    }
  }
}
