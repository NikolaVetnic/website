import { useEffect, useId, useState, type ReactNode } from "react";
import { Link } from "react-router";

import { formatPostDate, getPostPath, type Post, type PostSummary } from "~/blog/posts";
import {
  getAllTags,
  isFiltering,
  matchesFilter,
  SEARCH_INDEX_PATH,
  type BlogFilter,
  type SearchEntry,
} from "~/blog/search";
import Prose from "~/components/Prose/Prose";
import "./Blog.css";

type BlogProps = {
  // What the Blog's routes loaded: the list (`/blog`), one post (`/blog/<slug>`), or a post that doesn't exist.
  data: unknown;
};

function isPostPage(data: unknown): data is { post: Post } {
  return typeof data === "object" && data !== null && "post" in data;
}

function isListPage(data: unknown): data is { posts: PostSummary[] } {
  return typeof data === "object" && data !== null && "posts" in data;
}

function isMissingPost(data: unknown): boolean {
  return typeof data === "object" && data !== null && "missing" in data;
}

function PostMeta({ date, tags }: Pick<PostSummary, "date" | "tags">) {
  return (
    <p className="blog__meta">
      <time dateTime={date}>{formatPostDate(date)}</time>
      {tags.map((tag) => (
        <span key={tag} className="blog__tag">
          {tag}
        </span>
      ))}
    </p>
  );
}

const NO_FILTER: BlogFilter = { query: "", tags: [] };

// The filter, and whether the tags are open, outlive the list, so coming back from a post finds them as they were.
let lastFilter = NO_FILTER;
let lastTagsOpen = false;

// The posts' text, fetched once, the first time someone searches.
let searchIndex: Promise<Map<string, string>> | null = null;

function loadSearchIndex(): Promise<Map<string, string>> {
  searchIndex ??= fetch(SEARCH_INDEX_PATH)
    .then((response) => (response.ok ? (response.json() as Promise<SearchEntry[]>) : []))
    .then((entries) => new Map(entries.map((entry) => [entry.slug, entry.text])))
    .catch(() => {
      searchIndex = null;
      return new Map<string, string>();
    });
  return searchIndex;
}

// What the Blog shows scrolls, inside a window it fills; the search bar, on the list, stays at the bottom.
function BlogView({ children, bar }: { children: ReactNode; bar?: ReactNode }) {
  return (
    <div className="blog-view">
      <div className="blog-view__scroll">{children}</div>
      {bar}
    </div>
  );
}

type SearchBarProps = {
  tags: string[];
  filter: BlogFilter;
  onChange: (filter: BlogFilter) => void;
};

// A status bar along the window's bottom: the search field, which fills it, and a button at its right end that opens
// the tags above it.
function SearchBar({ tags, filter, onChange }: SearchBarProps) {
  const [areTagsOpen, setAreTagsOpen] = useState(lastTagsOpen);
  const tagsId = useId();

  const toggleTags = () => {
    lastTagsOpen = !areTagsOpen;
    setAreTagsOpen(!areTagsOpen);
  };

  const toggleTag = (tag: string) =>
    onChange({
      ...filter,
      tags: filter.tags.includes(tag) ? filter.tags.filter((chosen) => chosen !== tag) : [...filter.tags, tag],
    });

  return (
    <div className="blog-bar" role="search">
      {areTagsOpen ? (
        <div id={tagsId} className="blog-bar__tags" role="group" aria-label="Tags">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="blog-bar__tag"
              aria-pressed={filter.tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
      <div className="blog-bar__row">
        <input
          type="search"
          className="blog-bar__search"
          placeholder="Search posts"
          aria-label="Search posts"
          value={filter.query}
          onChange={(event) => onChange({ ...filter, query: event.target.value })}
        />
        <button
          type="button"
          className="blog-bar__tags-toggle"
          aria-expanded={areTagsOpen}
          aria-controls={tagsId}
          onClick={toggleTags}
        >
          Tags{filter.tags.length > 0 ? ` (${filter.tags.length})` : ""}
          <span className="blog-bar__chevron" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PostList({ posts }: { posts: PostSummary[] }) {
  const [filter, setFilter] = useState(lastFilter);
  const [texts, setTexts] = useState<Map<string, string> | null>(null);

  const changeFilter = (next: BlogFilter) => {
    lastFilter = next;
    setFilter(next);
  };

  // A search reaches into the posts' text once it has arrived; until then titles, summaries and tags.
  const isSearching = filter.query.trim() !== "";
  useEffect(() => {
    if (!isSearching || texts) {
      return;
    }
    let isCurrent = true;
    loadSearchIndex().then((index) => isCurrent && setTexts(index));
    return () => {
      isCurrent = false;
    };
  }, [isSearching, texts]);

  if (posts.length === 0) {
    return (
      <BlogView>
        <p className="blog__empty">No posts yet.</p>
      </BlogView>
    );
  }

  const shown = posts.filter((post) => matchesFilter(post, filter, texts?.get(post.slug)));

  return (
    <BlogView bar={<SearchBar tags={getAllTags(posts)} filter={filter} onChange={changeFilter} />}>
      {isFiltering(filter) ? (
        <p className="blog__count">
          <span>
            {shown.length} of {posts.length} posts
          </span>
          <button type="button" className="blog__clear" onClick={() => changeFilter(NO_FILTER)}>
            Clear
          </button>
        </p>
      ) : null}
      {shown.length === 0 ? (
        <p className="blog__empty blog__no-match">No posts match.</p>
      ) : (
        <ul className="blog__list">
          {shown.map((post) => (
            <li key={post.slug} className="blog__item">
              <h3 className="blog__item-title">
                <Link to={getPostPath(post.slug)}>{post.title}</Link>
              </h3>
              <PostMeta date={post.date} tags={post.tags} />
              <p className="blog__summary">{post.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </BlogView>
  );
}

function PostPage({ post }: { post: Post }) {
  return (
    <article className="blog-post">
      <Link className="blog__back" to="/blog">
        ← All posts
      </Link>
      <h1 className="blog-post__title">{post.title}</h1>
      <PostMeta date={post.date} tags={post.tags} />
      <Prose className="blog-post__body" html={post.html} />
    </article>
  );
}

function Blog({ data }: BlogProps) {
  if (isPostPage(data)) {
    return (
      <BlogView>
        <PostPage post={data.post} />
      </BlogView>
    );
  }
  if (isListPage(data)) {
    return <PostList posts={data.posts} />;
  }
  if (isMissingPost(data)) {
    return (
      <BlogView>
        <div className="blog-post">
          <Link className="blog__back" to="/blog">
            ← All posts
          </Link>
          <p className="blog__empty">This post doesn't exist, or it has moved.</p>
        </div>
      </BlogView>
    );
  }

  return (
    <BlogView>
      <p className="blog__empty">Loading…</p>
    </BlogView>
  );
}

export default Blog;
