import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Divisions from "@/components/Divisions";
import ProkerGrid from "@/components/ProkerGrid";
import HallOfFame from "@/components/HallOfFame";
import Gallery from "@/components/Gallery";
import SabaBot from "@/components/SabaBot";
import TerminalMode from "@/components/TerminalMode";
import { getPrograms, getGalleryPhotos } from "@/lib/data";

// ISR: prerender the page and refresh its dynamic data (divisions, proker,
// prestasi, gallery) at most once a minute. Phase 4 admin writes will also call
// revalidatePath('/') for an instant refresh after edits.
export const revalidate = 60;

export default async function Home() {
  // Server-side reads for the two client components that own modal state:
  // ProkerGrid (proker modal) and Gallery (photo lightbox). Everything else
  // (About/Divisions/HallOfFame) self-fetches as Server Components.
  const [programs, photos] = await Promise.all([
    getPrograms(),
    getGalleryPhotos(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Divisions />
        <ProkerGrid programs={programs} />
        <HallOfFame />
        <Gallery photos={photos} />
      </main>
      {/* Public-only AI assistant — fixed-position widget, lives outside <main>
          so it floats above all sections without affecting document flow. */}
      <SabaBot />
      {/* Hidden "Mode Peretas" easter egg — type "SABA" to open the CLI overlay. */}
      <TerminalMode />
    </>
  );
}
