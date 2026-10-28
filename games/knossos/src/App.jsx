import Devlog from "./components/Devlog";
import Download from "./components/Download";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Soundtrack from "./components/Soundtrack";
import Story from "./components/Story";
import Trailer from "./components/Trailer";

// The K’NOSSOS landing page, top to bottom.
const App = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Story />
      <Features />
      <Trailer />
      <Gallery />
      <Soundtrack />
      <Download />
      <Devlog />
    </main>
    <Footer />
  </>
);

export default App;
