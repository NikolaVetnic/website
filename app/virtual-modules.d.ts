// Modules that Vite plugins make at build time (see vite.config.ts).
declare module "virtual:desktop-widgets" {
  import type { DesktopWidgets } from "~/desktop/widgets";

  const widgets: DesktopWidgets;
  export default widgets;
}
