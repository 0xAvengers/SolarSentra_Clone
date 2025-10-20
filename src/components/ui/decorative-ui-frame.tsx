"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { usePumpFunLink } from "@/hooks/usePumpFunLink";

interface DecorativeUIFrameProps {
  children: ReactNode;
  className?: string;
}

export const DecorativeUIFrame = ({
  children,
  className,
}: DecorativeUIFrameProps) => {
  const [slashCount, setSlashCount] = useState(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);
  const { scrollY } = useScroll();
  
  // Hook para obtener el link dinámico de Pump.fun
  const { pumpFunLink } = usePumpFunLink();

  // Configuración de breakpoints en vh - FÁCIL DE MODIFICAR
  const colorBreakpoints = [
    { vh: 0, color: "white" }, // Inicio
    { vh: 30, color: "white" }, // Inicio
    { vh: 75, color: "black" }, // 150vh - cambio a negro
    // { vh: 275, color: "white" },    // 150vh - cambio a negro
    { vh: 500, color: "white" },
    { vh: 600, color: "white" },


    // { vh: 600, color: "black" },
    // { vh: 800, color: "black" },
    // { vh: 830, color: "black" },
    // { vh: 930, color: "black" },
    // { vh: 950, color: "black" },
    { vh: 1065, color: "black" },
    { vh: 1165, color: "white" },
    { vh: 1245, color: "black" }, // Cambio a negro
    { vh: 1515, color: "black" }, // Cambio a negro
    { vh: 1555, color: "white" },

    // 150vh - cambio a negro
  ];

  // Configuración específica para links e iconos - SOLO NEGRO Y BLANCO
  const linkColorBreakpoints = [
    { vh: 0, color: "white" }, // Inicio
    { vh: 100, color: "white" }, // Mantener negro
    { vh: 100, color: "black" }, // Cambio a blanco
    { vh: 700, color: "black" }, // Mantener blanco
    { vh: 865, color: "black" }, // Mantener blanco
    { vh: 865, color: "black" }, // Cambio a negro
    { vh: 900, color: "black" }, // Cambio a negro
    { vh: 950, color: "black" }, // Cambio a negro
    { vh: 1165, color: "black" }, // Cambio a negro
    { vh: 1165, color: "white" }, // Cambio a negro
    { vh: 1245, color: "white" }, // Cambio a negro
    { vh: 1245, color: "black" }, // Cambio a negro
    { vh: 1515, color: "black" }, // Cambio a negro
    { vh: 1555, color: "white" }, // Cambio a negro
  ];

  // Convierte vh a píxeles
  const vhToPixels = (vh: number) => {
    if (typeof window !== "undefined") {
      return (vh * window.innerHeight) / 100;
    }
    return vh * 10; // fallback
  };

  // Extrae los valores de vh y colores
  const vhValues = colorBreakpoints.map((bp) => vhToPixels(bp.vh));
  const frameColors = colorBreakpoints.map((bp) =>
    bp.color === "white" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
  );
  const textColors = colorBreakpoints.map((bp) =>
    bp.color === "white" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
  );

  // Valores específicos para links e iconos
  const linkVhValues = linkColorBreakpoints.map((bp) => vhToPixels(bp.vh));
  const linkColors = linkColorBreakpoints.map((bp) =>
    bp.color === "white" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
  );
  const linkBgColors = linkColorBreakpoints.map(
    (bp) => (bp.color === "white" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)") // Contrario para fondo del botón
  );

  // Colores invertidos para el div de la imagen del botón
  const linkInvertedColors = linkColorBreakpoints.map(
    (bp) => (bp.color === "white" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)") // Invertido: white -> black, black -> white
  );

  // Filtro para el logo - invierte cuando linkColorBreakpoints es "black"
  // Logo blanco -> se invierte a negro cuando bp.color es "black"
  const logoFilters = linkColorBreakpoints.map(
    (bp) => (bp.color === "black" ? "invert(1)" : "invert(0)") // Invierte el logo blanco a negro
  );

  // Filtro específico para logo verde -> blanco
  // Convierte verde a blanco cuando bp.color es "black" (invertido)
  const logoGreenToWhiteFilters = linkColorBreakpoints.map(
    (bp) =>
      bp.color === "black"
        ? "brightness(100) saturate(0) contrast(0) brightness(2)"
        : "none" // Verde a blanco cuando es "black"
  );

  const frameColor = useTransform(scrollY, vhValues, frameColors);
  const textColor = useTransform(scrollY, vhValues, textColors);

  // Transforms específicos para links e iconos
  const linkTextColor = useTransform(scrollY, linkVhValues, linkColors);
  const linkBgColor = useTransform(scrollY, linkVhValues, linkBgColors);
  const linkInvertedColor = useTransform(
    scrollY,
    linkVhValues,
    linkInvertedColors
  );
  const logoFilter = useTransform(scrollY, linkVhValues, logoFilters);
  const logoGreenToWhiteFilter = useTransform(
    scrollY,
    linkVhValues,
    logoGreenToWhiteFilters
  );

  // Configuración de secciones - heights en vh
  const sectionHeights = [
    { start: 0, end: 100 }, // HeroSection
    { start: 100, end: 200 }, // VelocityScroll
    { start: 200, end: 500 }, // ParallaxLayers
    { start: 500, end: 800 }, // HorizontalScroll
    { start: 800, end: 950 }, // Better For All section
  ];

  // Calcula el progreso global
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Calcula el progreso global del scroll
    const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
    const globalScrollPercent = Math.max(
      0,
      Math.min(100, (latest / totalScrollHeight) * 100)
    );
    setGlobalProgress(globalScrollPercent);
  });

  const calculateSlashes = () => {
    const width = window.innerWidth;
    let count;
    if (width < 640) {
      count = Math.floor(width / 11);
    } else if (width < 768) {
      count = Math.floor(width / 16);
    } else {
      count = Math.floor(width / 21.5);
    }
    setSlashCount(count);
  };

  useEffect(() => {
    calculateSlashes();
    window.addEventListener("resize", calculateSlashes);
    return () => window.removeEventListener("resize", calculateSlashes);
  }, []);

  return (
    <div className="relative max-h-screen overflow-hidden w-full pointer-events-none">
      {/* Main Border Frame */}
      <motion.div
        className={cn(
          "fixed z-50 pointer-events-none border",
          "inset-1 rounded-[8px] sm:inset-2 sm:rounded-[12px] md:inset-3 md:rounded-[16px]"
        )}
        style={{ borderColor: frameColor }}
      />

      {/* Top Horizontal Line */}
      <div className="fixed z-30 pointer-events-none top-[40px] left-1 right-1 sm:top-[50px] sm:left-2 sm:right-2 md:top-[60px] md:left-3 md:right-3">
        <motion.div
          className="h-px w-full translate-y-[25px] sm:translate-y-[35px] md:translate-y-[45px]"
          style={{ backgroundColor: frameColor }}
        />
      </div>

      {/* Bottom Horizontal Line */}
      <div className="fixed z-30 pointer-events-none bottom-[40px] left-1 right-1 sm:bottom-[50px] sm:left-2 sm:right-2 md:bottom-[60px] md:left-3 md:right-3">
        <motion.div
          className="h-px w-full translate-y-[-35px] sm:translate-y-[-55px] md:translate-y-[-65px]"
          style={{ backgroundColor: frameColor }}
        />
      </div>

      {/* Content Area */}
      <div
        className={cn(
          "relative z-20 min-h-screen p-6 m-3 pt-8 pb-16",
          className
        )}
      >
        {children}
      </div>

      {/* MOBILE MENU SYSTEM - Simplified with maximum z-index */}
      {/* Hamburger Button */}
      <div 
        className="md:hidden fixed top-6 right-6 pointer-events-auto" 
        style={{ zIndex: 999999999 }}
      >
        <button
          className="focus:outline-none p-3 bg-black/20 rounded-md hover:bg-black/40 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Hamburguesa clickeada!", !menuOpen);
            setMenuOpen(!menuOpen);
          }}
          style={{ zIndex: 999999999 }}
        >
          <div
            className={`w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/95 flex flex-col items-center justify-center"
          style={{ zIndex: 999999998 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(false);
          }}
        >
          <div 
            className="flex flex-col items-center gap-8 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 999999999 }}
          >
            {/* Mobile navigation items */}

            <a
              href="https://t.me/solarsentra_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-helvetica-now-text font-bold uppercase text-white hover:text-[#CDFE00] transition-colors duration-300 cursor-pointer"
              style={{ letterSpacing: "0.25em" }}
              onClick={() => setMenuOpen(false)}
            >
              TELEGRAM BOT
            </a>

            <a
              href="https://x.com/solarsentra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-helvetica-now-text font-bold uppercase text-white hover:text-[#CDFE00] transition-colors duration-300 cursor-pointer"
              style={{ letterSpacing: "0.25em" }}
              onClick={() => setMenuOpen(false)}
            >
              FOLLOW US
            </a>

            <a
              href="https://solarsentra.mintlify.app/whitepaper/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-helvetica-now-text font-bold uppercase text-white hover:text-[#CDFE00] transition-colors duration-300 cursor-pointer"
              style={{ letterSpacing: "0.25em" }}
              onClick={() => setMenuOpen(false)}
            >
              WHITEPAPER
            </a>

          </div>
        </div>
      )}

      {/* Bottom Slash Line */}
      <div className="fixed bottom-2 left-0 right-0 z-30 pointer-events-none sm:bottom-3 md:bottom-4">
        <div className="flex justify-center items-center h-4 sm:h-6 md:h-8 w-full">
          <motion.div
            className="text-[12px] sm:text-lg md:text-xl font-bb-mono tracking-wider text-center w-full overflow-hidden"
            style={{ color: frameColor }}
          >
            {Array.from({ length: slashCount }, (_, i) => (
              <span
                key={i}
                className="inline-block mr-0.5 sm:mr-0.5 md:mr-2 font-bb-mono"
              >
                /
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Logo */}
      <div className="fixed top-1 left-6 z-50 flex items-center gap-3">
        <motion.img
          src="logoWhite.png"
          alt="Logo"
          className="w-16 sm:w-20 md:w-28"
          style={{
            filter: logoFilter,
            transition: "filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <motion.span
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
          style={{
            fontFamily: "Formula Condensed, sans-serif",
            fontWeight: 900,
            color: linkTextColor,
            transform: "scale(1.125) translateY(2px)",
            letterSpacing: "2.5px",
          }}
        >
          SOLARSENTRA
        </motion.span>
      </div>

      {/* Navigation Buttons */}
      <div className="hidden md:flex fixed top-8 right-8 z-50 items-center gap-10 pointer-events-auto">
        {/* Navigation buttons */}
        
        <motion.a
          href="https://t.me/solarsentra_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-helvetica-now-text font-bold uppercase hover:text-[#CDFE00] hover:scale-105 transition-all duration-300 ease-out cursor-pointer relative group"
          style={{ color: linkTextColor }}
        >
          <span className="relative z-10">Telegram Bot</span>
          <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
        </motion.a>
        
        <motion.a
          href="https://x.com/solarsentra"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-helvetica-now-text font-bold uppercase hover:text-[#CDFE00] hover:scale-105 transition-all duration-300 ease-out cursor-pointer relative group"
          style={{ color: linkTextColor }}
        >
          <span className="relative z-10">Follow US</span>
          <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
        </motion.a>
        
        <motion.a
          href="https://solarsentra.mintlify.app/whitepaper/introduction"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-helvetica-now-text font-bold uppercase hover:text-[#CDFE00] hover:scale-105 transition-all duration-300 ease-out cursor-pointer relative group"
          style={{ color: linkTextColor }}
        >
          <span className="relative z-10">Whitepaper</span>
          <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
        </motion.a>


        {/* Global Progress Percentage */}
        <motion.div
          className="fixed top-[120px] right-8 z-50 flex items-center gap-1 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-0">
            <motion.span
              className="text-sm font-bb-manual-mono-pro-original-semi-regular"
              style={{ color: linkTextColor }}
            >
              +
            </motion.span>
            <motion.span
              className="text-sm font-bb-manual-mono-pro-original-semi-regular px-5"
              style={{ color: linkTextColor }}
            >
              SYS CALC {Math.round(globalProgress)}%
            </motion.span>
            <motion.span
              className="text-sm font-bb-manual-mono-pro-original-semi-regular"
              style={{ color: linkTextColor }}
            >
              +
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Social Icons - Fixed bottom right */}
      <div className="fixed bottom-14 right-14 z-50 flex items-center gap-6 pointer-events-auto hidden md:flex">
        <motion.a
          href="https://x.com/solarsentra"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#CDFE00] hover:scale-110 transition-all duration-300 ease-out cursor-pointer"
          style={{ color: linkTextColor }}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </motion.a>
        <motion.a
          href="https://t.me/solarsentra_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#CDFE00] hover:scale-110 transition-all duration-300 ease-out cursor-pointer"
          style={{ color: linkTextColor }}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 40 37">
            <path fillRule="evenodd" clipRule="evenodd" d="M39.9231 4.35498C40.4987 1.54881 37.7424 -0.783168 35.0704 0.249238L2.31631 12.9042C-0.667687 14.0571 -0.800647 18.2298 2.10388 19.5703L9.2368 22.8625L12.63 34.7387C12.8063 35.3556 13.2958 35.8333 13.9169 35.9942C14.5379 36.155 15.1978 35.9754 15.6514 35.5216L20.8783 30.2947L28.2002 35.7862C30.3256 37.3801 33.3868 36.2191 33.9206 33.6166L39.9231 4.35498ZM3.62146 16.2822L36.3755 3.62728L30.3731 32.8891L21.7949 26.4553C21.0741 25.9146 20.0653 25.9863 19.4281 26.6235L17.1894 28.8622L17.8621 25.1628L31.0423 11.9826C31.6838 11.3412 31.7516 10.3241 31.2009 9.60318C30.6503 8.88226 29.6513 8.68006 28.8637 9.13013L10.6613 19.5314L3.62146 16.2822ZM12.8807 22.4341L13.9787 26.2771L14.4003 23.9585C14.4661 23.5962 14.641 23.2625 14.9014 23.0021L18.921 18.9827L12.8807 22.4341Z" />
          </svg>
        </motion.a>
        <motion.a
          href="https://solarsentra.mintlify.app/whitepaper/introduction"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#CDFE00] hover:scale-110 transition-all duration-300 ease-out cursor-pointer"
          style={{ color: linkTextColor }}
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 40 40">
            <path d="M36.2501 9.91123L26.5779 0.23914C26.4247 0.0860155 26.2171 0 26.0007 0H7.47905C5.2914 0 3.51172 1.77984 3.51172 3.96749V36.0326C3.51172 38.2202 5.29148 40 7.47913 40H32.5218C34.7095 40 36.4892 38.2202 36.4892 36.0326V10.4885C36.4892 10.272 36.4031 10.0644 36.2501 9.91123ZM26.8172 2.78742L33.7021 9.67225H29.152C28.5282 9.67225 27.9418 9.42936 27.5009 8.98842C27.06 8.54756 26.8171 7.96123 26.8172 7.33756V2.78742ZM34.8565 36.0325C34.8565 37.3199 33.8092 38.3673 32.5218 38.3673H7.47905C6.19164 38.3673 5.14429 37.3199 5.14429 36.0325V3.96749C5.14437 2.68007 6.19171 1.63265 7.47905 1.63265H25.1846V7.33741C25.1844 8.39717 25.5971 9.3935 26.3464 10.1428C27.0957 10.8922 28.0921 11.3048 29.1519 11.3048H34.8564L34.8565 36.0325Z" />
            <path d="M21.4914 27.4602H21.1259C20.6751 27.4602 20.3096 27.8257 20.3096 28.2765C20.3096 28.7274 20.6751 29.0929 21.1259 29.0929H21.4914C21.9421 29.0929 22.3077 28.7274 22.3077 28.2765C22.3077 27.8257 21.9421 27.4602 21.4914 27.4602Z" />
            <path d="M18.4856 27.4602H10.5566C10.1058 27.4602 9.74023 27.8257 9.74023 28.2765C9.74023 28.7274 10.1058 29.0929 10.5566 29.0929H18.4856C18.9364 29.0929 19.3019 28.7274 19.3019 28.2765C19.3019 27.8257 18.9365 27.4602 18.4856 27.4602Z" />
            <path d="M29.4443 23.7302H10.5566C10.1058 23.7302 9.74023 24.0957 9.74023 24.5466C9.74023 24.9974 10.1058 25.3629 10.5566 25.3629H29.4443C29.895 25.3629 30.2606 24.9974 30.2606 24.5466C30.2606 24.0957 29.895 23.7302 29.4443 23.7302Z" />
            <path d="M29.4443 20H10.5566C10.1058 20 9.74023 20.3655 9.74023 20.8163C9.74023 21.2672 10.1058 21.6327 10.5566 21.6327H29.4443C29.895 21.6327 30.2606 21.2672 30.2606 20.8163C30.2606 20.3655 29.895 20 29.4443 20Z" />
            <path d="M29.4443 16.2698H10.5566C10.1058 16.2698 9.74023 16.6352 9.74023 17.0861C9.74023 17.537 10.1058 17.9024 10.5566 17.9024H29.4443C29.895 17.9024 30.2606 17.537 30.2606 17.0861C30.2606 16.6352 29.895 16.2698 29.4443 16.2698Z" />
          </svg>
        </motion.a>
      </div>

      {/* Bottom Text Info */}
      <div className="fixed bottom-8 left-0 right-0 sm:bottom-10 md:bottom-12 z-30 pointer-events-none">
        <div className="flex justify-between items-center translate-y-[-20px] px-2 sm:px-4 md:px-6">
          <motion.div
            className="flex justify-start items-center w-1/2 text-[9px] sm:text-xs md:text-sm font-bb-mono gap-[150px]"
            style={{ color: frameColor }}
          >
            <span>*HTM.STS</span>
            <span>VER/12433.56</span>
            <span className="flex flex-col leading-tight translate-y-[10px]">
              <span>RUNTIME.LIVE</span>
              <span>RELATIVE.RUN</span>
            </span>
          </motion.div>
          <div className="w-32 sm:w-36 md:w-40"></div>
        </div>
      </div>
    </div>
  );
};

// Dummy social icon functions (replace with real ones)
function social1() {
  return (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function social2() {
  return (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.053 20.235c-1.132 1.046-2.636 1.765-4.323 1.765-3.477 0-6.297-2.82-6.297-6.297 0-3.477 2.82-6.297 6.297-6.297 1.687 0 3.191.719 4.323 1.765l.965-.965C20.604 8.82 18.748 7.703 16.73 7.703c-4.582 0-8.297 3.715-8.297 8.297s3.715 8.297 8.297 8.297c2.018 0 3.874-1.117 5.288-2.553l-.965-.965z" />
    </svg>
  );
}
function social3() {
  return (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223-.324 0-.454-.157-.454-.454v-4.63L7.37 10.4c-.66-.185-.68-.66.136-.994l11.86-4.573c.548-.202 1.028.126.846.94z" />
    </svg>
  );
}
