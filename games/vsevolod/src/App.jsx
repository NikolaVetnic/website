import Download from "./components/Download";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Soundtrack from "./components/Soundtrack";
import Status from "./components/Status";
import Story from "./components/Story";

// The VSEVOLOD landing page, top to bottom.
const App = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Story />
      <Features />
      <Gallery />
      <Soundtrack />
      <Download />
      <Status />
    </main>
    <Footer />
  </>
);

export default App;
