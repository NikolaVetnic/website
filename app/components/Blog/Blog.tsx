import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router";

import { formatPostDate, getPostPath, type Post, type PostSummary } from "~/blog/posts";
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

function PostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return <p className="blog__empty">No posts yet.</p>;
  }

  return (
    <ul className="blog__list">
      {posts.map((post) => (
        <li key={post.slug} className="blog__item">
          <h3 className="blog__item-title">
            <Link to={getPostPath(post.slug)}>{post.title}</Link>
          </h3>
          <PostMeta date={post.date} tags={post.tags} />
          <p className="blog__summary">{post.summary}</p>
        </li>
      ))}
    </ul>
  );
}

function PostPage({ post }: { post: Post }) {
  const navigate = useNavigate();

  // Links within the site move the window instead of reloading the page; links out open a new tab (see posts.server.ts).
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as Element).closest("a");
    if (
      !link ||
      link.target ||
      link.origin !== window.location.origin ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(link.pathname + link.search + link.hash);
  };

  return (
    <article className="blog-post">
      <Link className="blog__back" to="/blog">
        ← All posts
      </Link>
      <h1 className="blog-post__title">{post.title}</h1>
      <PostMeta date={post.date} tags={post.tags} />
      <div className="blog-post__body" onClick={handleClick} dangerouslySetInnerHTML={{ __html: post.html }} />
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
