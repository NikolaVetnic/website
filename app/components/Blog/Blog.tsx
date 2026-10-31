import { useEffect, useState } from "react";
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

// The filter outlives the list, so coming back from a post finds it as it was left.
let lastFilter = NO_FILTER;

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

function PostFilters({
  tags,
  filter,
  onChange,
}: {
  tags: string[];
  filter: BlogFilter;
  onChange: (filter: BlogFilter) => void;
}) {
  const toggleTag = (tag: string) =>
    onChange({
      ...filter,
      tags: filter.tags.includes(tag) ? filter.tags.filter((chosen) => chosen !== tag) : [...filter.tags, tag],
    });

  return (
    <div className="blog__filters">
      <input
        type="search"
        className="blog__search"
        placeholder="Search posts"
        aria-label="Search posts"
        value={filter.query}
        onChange={(event) => onChange({ ...filter, query: event.target.value })}
      />
      <div className="blog__tag-filters" role="group" aria-label="Tags">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="blog__tag-filter"
            aria-pressed={filter.tags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
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
    return <p className="blog__empty">No posts yet.</p>;
  }

  const shown = posts.filter((post) => matchesFilter(post, filter, texts?.get(post.slug)));

  return (
    <div className="blog__index">
      <PostFilters tags={getAllTags(posts)} filter={filter} onChange={changeFilter} />
      {isFiltering(filter) ? (
        <p className="blog__count">
          {shown.length} of {posts.length} posts
          <button type="button" className="blog__clear" onClick={() => changeFilter(NO_FILTER)}>
            Clear
          </button>
        </p>
      ) : null}
      {shown.length === 0 ? (
        <p className="blog__empty">No posts match.</p>
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
    </div>
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
    return <PostPage post={data.post} />;
  }
  if (isListPage(data)) {
    return <PostList posts={data.posts} />;
  }
  if (isMissingPost(data)) {
    return (
      <div className="blog-post">
        <Link className="blog__back" to="/blog">
          ← All posts
        </Link>
        <p className="blog__empty">This post doesn't exist, or it has moved.</p>
      </div>
    );
  }

  return <p className="blog__empty">Loading…</p>;
}

export default Blog;
