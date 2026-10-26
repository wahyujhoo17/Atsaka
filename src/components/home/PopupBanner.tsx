import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const WA_NUMBER = "628176454312";

// "Jangan tampilkan lagi" / sending the form hides the popup for 30 days;
// closing with X only hides it for the current browser session.
const HIDE_UNTIL_KEY = "atsaka_popup_hidden_until";
const SESSION_KEY = "atsaka_popup_closed";
const HIDE_DAYS = 30;

const isHidden = () => {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return true;
    return Number(localStorage.getItem(HIDE_UNTIL_KEY) || 0) > Date.now();
  } catch {
    return false;
  }
};

const rememberClosed = (forDays?: number) => {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    if (forDays) localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + forDays * 24 * 60 * 60 * 1000));
  } catch {
    // Storage blocked (private mode): the popup simply shows again next visit
  }
};

const PopupBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [waNumber, setWaNumber] = useState("");

  useEffect(() => {
    if (isHidden()) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const close = (forDays?: number) => {
    rememberClosed(forDays);
    setIsVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber.trim()) return;
    const message = encodeURIComponent(
      `Halo ATSAKA, saya tertarik mendapatkan penawaran peralatan pemadam kebakaran. No WA saya: ${waNumber}`,
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");
    close(HIDE_DAYS);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative bg-gray-900 max-w-lg w-full animate-popup overflow-hidden shadow-2xl border border-white/10 group rounded-lg">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/popup-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-900/40"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 p-10 md:p-12 flex flex-col items-center text-center">
          {/* Close Button */}
          <button
            onClick={() => close()}
            className="absolute top-4 right-4 bg-white hover:bg-gray-200 text-black rounded-full p-1 transition-colors z-20"
            aria-label="Tutup popup"
          >
            <X size={18} />
          </button>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/img/logo.png"
              alt="ATSAKA Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Dapatkan Penawaran
            <br />
            Terbaik
          </h2>

          {/* Subtext */}
          <p className="text-gray-300 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Konsultasikan kebutuhan Anda dan dapatkan rekomendasi peralatan yang
            sesuai.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm mx-auto flex flex-col gap-4"
          >
            <input
              type="tel"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Nomor WhatsApp"
              className="w-full px-4 py-3.5 text-sm bg-white text-black outline-none focus:ring-2 focus:ring-orange-500 rounded-sm placeholder-gray-400 font-medium"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white font-bold text-xs tracking-[0.15em] uppercase py-4 border-2 border-dashed border-orange-500 hover:bg-orange-500/10 transition-colors rounded-sm"
            >
              Minta Penawaran
            </button>
          </form>

          {/* Bottom text */}
          <p className="text-[10px] text-gray-400 mt-6 max-w-xs mx-auto px-4">
            Kami akan segera menghubungi Anda melalui WhatsApp untuk konsultasi
            lebih lanjut.
          </p>

          <button
            type="button"
            onClick={() => close(HIDE_DAYS)}
            className="mt-4 text-[11px] text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
          >
            Jangan tampilkan lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBanner;
