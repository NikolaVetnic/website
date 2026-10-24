import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "Nikola Pacek Vetnić" },
  {
    name: "description",
    content: "Software developer, game developer and musician. Projects, music and a blog.",
  },
];

export default function Home() {
  return (
    <main className="placeholder">
      <h1>Nikola Pacek Vetnić</h1>
      <p>The new site is under construction.</p>
    </main>
  );
}
