import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/18629104389?text=Hi%20Sine%20Autos%2C%20I%27d%20like%20to%20inquire%20about%20a%20vehicle."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sine Autos on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background sm:h-16 sm:w-16"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <MessageCircle className="relative h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
