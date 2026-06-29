import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        fixed bottom-6 right-6 z-50
        flex h-14 w-14 items-center justify-center
        rounded-2xl
        border border-[#c6a98b]/20
        bg-gradient-to-br from-[#f4ede4] via-[#e8d7c3] to-[#c6a98b]
        text-[#3d2c21]
        shadow-[0_10px_35px_rgba(90,60,40,0.28)]
        backdrop-blur-xl
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:scale-105
        hover:shadow-[0_14px_40px_rgba(90,60,40,0.35)]
        hover:from-[#f7f1ea]
        hover:to-[#d2b395]
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-[#c6a98b]/30
      "
    >
      <ChevronUp className="h-7 w-7 drop-shadow-sm" />
    </button>
  );
}
