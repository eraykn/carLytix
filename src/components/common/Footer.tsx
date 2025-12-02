"use client";

import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ExternalLink, Car, Bot, BarChart3, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    urunler: [
      { name: "CarLytix AI", href: "/ai", icon: Bot },
      { name: "CarLytix Match", href: "/assistant", icon: Car },
      { name: "Araç Karşılaştırma", href: "/compare", icon: BarChart3 },
    ],
    sirket: [
      { name: "Hakkımızda", href: "/aboutus" },
      { name: "Kariyer", href: "#" },
      { name: "Blog", href: "#" },
      { name: "İletişim", href: "/aboutus" },
    ],
    destek: [
      { name: "Yardım Merkezi", href: "#" },
      { name: "SSS", href: "#" },
      { name: "Gizlilik Politikası", href: "#" },
      { name: "Kullanım Koşulları", href: "#" },
    ],
  };

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <img 
              src="/images/brands/carlytix-concept-a-logo.svg" 
              alt="CarLytix Logo" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              CarLytix, yapay zeka destekli araç analiz platformudur. Türkiye otomobil pazarında 
              size en uygun aracı bulmak için veri odaklı öneriler sunar.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:eraykn95@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-[#2db7f5] transition-colors text-sm">
                <Mail className="w-4 h-4" />
                eraykn95@gmail.com
              </a>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                İstanbul, Türkiye
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com/eraykn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/eray-kan-a45ab02a4/" 
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Ürünler</h3>
            <ul className="space-y-3">
              {footerLinks.urunler.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#2db7f5] transition-colors text-sm group"
                  >
                    <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Şirket</h3>
            <ul className="space-y-3">
              {footerLinks.sirket.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-[#2db7f5] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Destek</h3>
            <ul className="space-y-3">
              {footerLinks.destek.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-[#2db7f5] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Bültenimize Abone Olun</h4>
              <p className="text-slate-400 text-sm">En son araç analizleri ve güncellemeler için.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#2db7f5]/50 transition-colors"
              />
              <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(45,183,245,0.4)] transition-all duration-300">
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} CarLytix. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Gizlilik
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Koşullar
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Çerezler
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}