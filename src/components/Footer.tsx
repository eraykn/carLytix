"use client";

import { Github } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative w-full bg-[#1e293b] border-t border-white/10 py-8 px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
        {/* Logo and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img 
            src="/carlytix-concept-a-logo.svg" 
            alt="CarLytix Logo" 
            className="h-10 w-auto"
          />
          <p className="text-sm text-slate-400">
            © {currentYear} CarLytix. Tüm hakları saklıdır.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <motion.p
            className="text-sm text-slate-300 font-medium"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Made by Eray Kan
          </motion.p>
          <a
            href="https://github.com/eraykn" // Burayı kendi GitHub linkinizle değiştirebilirsiniz
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}