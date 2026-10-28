import { DEVLOG } from "../content";
import { openInSite } from "../site";
import "./Devlog.css";

const Devlog = () => (
  <section id="devlog" className="section section--alt">
    <div className="section__inner">
      <h2 className="section__title">Devlog</h2>
      <ul className="devlog">
        {DEVLOG.map((post) => (
          <li key={post.path}>
            <a
              className="devlog__post"
              href={post.path}
              target="_top"
              onClick={(event) => openInSite(event, post.path)}
            >
              <img className="devlog__image" src={post.image} alt="" loading="lazy" />
              <span className="devlog__body">
                <span className="devlog__date">{post.date}</span>
                <span className="devlog__title">{post.title}</span>
                <span className="devlog__summary">{post.summary}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Devlog;
