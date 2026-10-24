import Shell from "~/components/Shell/Shell";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "Nikola Pacek Vetnić" },
  {
    name: "description",
    content: "Software developer, game developer and musician. Projects, music and a blog.",
  },
];

export default function Home() {
  return <Shell />;
}
