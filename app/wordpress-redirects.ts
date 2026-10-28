import { getPostPath } from "~/blog/posts";

// The old WordPress site linked everything as a query string on its root (`/?p=2074`, `/?page_id=7`). Where each
// of those links goes now. public/.htaccess has the same redirects for Apache; a test keeps the two in step.

// Posts by their WordPress id, to the slug they were imported as.
const POSTS: Record<number, string> = {
  64: "persepolis-gamma",
  71: "svarun-divide-ut-regnes-2019-youtube",
  77: "cakewalk-sonar-midi-controllers-rewired-to-max-msp",
  347: "a-simple-feed-forward-image-classifier",
  362: "convolution-neural-network-image-classifier",
  365: "transfer-learning-finding-learning-rate-and-more",
  689: "knossos-chapter-v-assets-completed",
  1077: "sights-of-chapter-vi",
  1685: "using-mylyn-3-23-with-eclipse-adt",
  1700: "consuming-a-rest-api-with-abap",
  1739: "sap-database-tables",
  1742: "sap-internal-tables",
  1833: "developing-a-slot-based-save-system-in-unity",
  1967: "norsk-sprakkafe-i-novi-sad",
  2014: "l-verb",
  2074: "pixel-perfect-text-in-unity",
};

// Pages by their WordPress id: to their own page where they have one, else to the app of their section.
const PAGES: Record<number, string> = {
  2: "/", // Sample Page
  6: "/", // Home
  7: "/about", // Bio
  1072: "/about", // Bio [SRP]
  1508: "/about/resume", // Resume [ENG]
  9: "/blog",
  298: "/projects", // Code
  505: "/projects", // Other Projects
  895: "/projects", // Main Projects
  1253: "/projects", // Computer Graphics 2
  1371: "/projects", // Computer Graphics 1
  1611: "/projects", // Mars Explorer 3D
  1614: "/projects", // SocNet Project
  302: "/games", // Game Dev
  746: "/games/knossos", // K'NOSSOS
  770: "/games", // VSEVOLOD
  1413: "/games", // Game Dev Other
  1566: "/games", // Dungeon Gunner
  1571: "/games", // Rouge C
  1799: "/games/sodhara", // SODHARA
  296: "/art",
  102: "/music", // SVARUN
  158: "/music", // Lonesome Night
  277: "/music", // Contemporary Works
  491: "/music", // Soundtracks
  720: "/music", // HATOR
  729: "/music", // WATERWOOD
  928: "/music", // K'NOSSOS Soundtrack
  933: "/music", // Stock Music
  1103: "/music",
  8: "/contact",
};

// A parameter's raw value, matched the way the Apache rules match the query string.
function getParam(query: string, name: string): string | null {
  return new RegExp(`(?:^|&)${name}=([^&]*)`).exec(query)?.[1] ?? null;
}

// The new path for an old WordPress link, or null when the address isn't one. Ids the table doesn't know go to
// the post list or the desktop. Category, tag, date and author archives have no page of their own any more.
export function getWordPressRedirect(pathname: string, search: string): string | null {
  if (pathname !== "/" && pathname !== "/index.php") {
    return null;
  }

  const query = search.replace(/^\?/, "");
  if (getParam(query, "feed") !== null) {
    return "/rss.xml";
  }

  const post = getParam(query, "p");
  if (post && /^\d+$/.test(post)) {
    const slug = POSTS[Number(post)];
    return slug ? getPostPath(slug) : "/blog";
  }

  const page = getParam(query, "page_id");
  if (page && /^\d+$/.test(page)) {
    return PAGES[Number(page)] ?? "/";
  }

  if (["cat", "tag", "m", "author"].some((name) => getParam(query, name) !== null)) {
    return "/blog";
  }
  return null;
}

// Every id in the table, for the test that checks the Apache rules.
export const WORDPRESS_POST_IDS = Object.keys(POSTS).map(Number);
export const WORDPRESS_PAGE_IDS = Object.keys(PAGES).map(Number);
