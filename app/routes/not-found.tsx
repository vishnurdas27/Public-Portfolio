import { Link } from "react-router";
import { profile } from "~/content";

export function meta() {
  return [{ title: `Page not found | ${profile.name}` }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main id="main" className="container-x grid min-h-dvh place-content-center gap-5 py-24">
      <p className="eyebrow">404</p>
      <h1 className="font-serif text-[clamp(3rem,9vw,6rem)] italic leading-none">Page not found.</h1>
      <p className="max-w-[30rem] text-muted">That page doesn't exist. Try the recruiter view or my story.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn btn-primary">
          Recruiter view
        </Link>
        <Link to="/story" className="btn btn-ghost">
          My story
        </Link>
      </div>
    </main>
  );
}
