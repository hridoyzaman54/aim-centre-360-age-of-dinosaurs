"use client";
import { useEffect, useState, useRef } from "react";
import {
  ERAS,
  TIMELINE_EVENTS,
  ADAPTATIONS,
  EXTINCTION_FACTS,
  FOSSIL_SITES,
} from "@/data/dinosaurEras";

export default function DinosaurErasPage() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeEra, setActiveEra] = useState(0);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [extinctionVisible, setExtinctionVisible] = useState(false);
  const [viewer3D, setViewer3D] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  const extinctionRef = useRef(null);

  // Verified Sketchfab public model IDs for each dinosaur
  const SKETCHFAB = {
    "Tyrannosaurus Rex": "e18c433cdd1c49f8ac152348b7384037",
    Triceratops: "909bf645de1746829ab19acd1ae31767",
    Velociraptor: "8f1744af7b0847a2aabe3df90be802f0",
    Spinosaurus: "d98b4f7dcf6d40b8b1f0b5523b3f551a",
    Ankylosaurus: "8f249e802fc94e9098ad902d33a670bf",
    Pteranodon: "144d0f815d5341bba6de95786a1b9343",
    Mosasaurus: "83338897566c4288a8e5f10db623ff18",
    Pachycephalosaurus: "6eea5cee4afa4730bf75c6329a43e56d",
    Brachiosaurus: "641feb1a485b492c8de31e84ff89ad64",
    Stegosaurus: "6e9a2f36f0a447758d71c2134512580e",
    Allosaurus: "9bd8f994a98a448792a188e305d6bd59",
    Diplodocus: "1d07ae9e002f4e8ab930dc92d07eb078",
    Archaeopteryx: "cae0cdf2206c4e869b15032f06d6b46f",
    Compsognathus: "f6e2f391d2de43db95ec15f674cb1d30",
    Eoraptor: "ef6e5b69a9db47639991b9a9116e4277",
    Coelophysis: "c8fee7a21dbc465d8fae98a0df4d190e",
    Plateosaurus: "80683eb568cc46caac0649e395fa5a1b",
  };

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 100);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === statsRef.current) setStatsVisible(true);
            if (entry.target === timelineRef.current) setTimelineVisible(true);
            if (entry.target === extinctionRef.current)
              setExtinctionVisible(true);
          }
        });
      },
      { threshold: 0.15 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);
    if (extinctionRef.current) observer.observe(extinctionRef.current);
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute("href").slice(1);
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.pageYOffset - 72,
            behavior: "smooth",
          });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  const era = ERAS[activeEra];
  const accentColor = era.color;

  return (
    <div className="min-h-screen bg-[#080B04] text-white relative font-dmsans">
      {/* 3D Viewer Modal */}
      {viewer3D && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setViewer3D(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a0e06] px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div>
                <div className="text-amber-400 text-xs tracking-widest font-semibold mb-0.5">
                  3D MODEL · SKETCHFAB
                </div>
                <div className="text-stone-100 font-playfair font-bold text-lg">
                  {viewer3D.name}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`https://sketchfab.com/search?q=${encodeURIComponent(viewer3D.name + " dinosaur")}&type=models`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-all"
                >
                  Browse More →
                </a>
                <button
                  onClick={() => setViewer3D(null)}
                  className="text-stone-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={{ height: "520px", background: "#111" }}>
              <iframe
                title={viewer3D.name}
                src={`https://sketchfab.com/models/${viewer3D.id}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0`}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                className="w-full h-full border-0"
              />
            </div>
            <div className="bg-[#0a0e06] px-6 py-3 text-stone-500 text-xs border-t border-white/10">
              Drag to rotate · Scroll to zoom · Right-click to pan
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 relative z-[60]">
            <span className="text-xl md:text-2xl">🦕</span>
            <div className="flex flex-col items-start leading-none">
              <div className="font-playfair font-bold text-base md:text-lg text-amber-400 tracking-wider">AIM Centre 360</div>
              <div className="text-[7px] md:text-[8px] text-stone-400 tracking-[0.15em] font-medium mt-0.5 uppercase">AIM High, Achieve Infinity</div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 font-dmsans text-sm tracking-widest relative z-[60]">
            {[
              ["#eras", "Eras"],
              ["#dinosaurs", "Species"],
              ["#timeline", "Timeline"],
              ["#science", "Science"],
              ["#extinction", "Extinction"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-white/70 hover:text-amber-400 transition-colors uppercase"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-[60] p-2 text-stone-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>

          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-[#080B04]/95 backdrop-blur-xl z-[50] md:hidden flex flex-col items-center justify-center transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col gap-8 font-dmsans text-xl tracking-widest text-center">
              {[
                ["#eras", "Eras"],
                ["#dinosaurs", "Species"],
                ["#timeline", "Timeline"],
                ["#science", "Science"],
                ["#extinction", "Extinction"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-stone-300 hover:text-amber-400 transition-colors uppercase"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          src="https://raw.createusercontent.com/e114d7d8-387e-4893-8ba7-42d8b5756122/"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B04]/60 via-[#080B04]/20 to-[#080B04]/80" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <div className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="text-center px-6 max-w-7xl w-full">
            <div className="mb-8">
              <span className="text-amber-400 text-xs font-medium tracking-[0.3em] uppercase">
                252 Million Years of Dominance
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-playfair font-black mb-8 leading-[0.82] tracking-tight">
              {["Age of", "Dinosaurs"].map((word, idx) => (
                <span
                  key={idx}
                  className={`block transition-all duration-1000 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                  style={{
                    transitionDelay: `${idx * 350}ms`,
                    color: idx === 1 ? "#D4A853" : undefined,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl text-stone-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "700ms", lineHeight: "1.7" }}
            >
              From the volcanic dawn of the Triassic to the catastrophic
              twilight of the Cretaceous, journey through 186 million years of
              the most spectacular creatures ever to inhabit our planet.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "900ms" }}
            >
              <a
                href="#eras"
                className="px-10 py-4 bg-white/8 backdrop-blur-md rounded-full font-medium border-2 border-amber-500 text-white hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] hover:scale-105 transition-all text-sm sm:text-base"
              >
                Explore the Eras
              </a>
              <a
                href="#dinosaurs"
                className="px-10 py-4 bg-white/8 backdrop-blur-md rounded-full font-medium border-2 border-amber-500/60 text-white hover:shadow-[0_0_20px_rgba(212,168,83,0.3)] transition-all text-sm sm:text-base"
              >
                Meet the Species
              </a>
            </div>
            <div
              className={`flex flex-wrap justify-center gap-3 mt-14 transition-all duration-1000 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "1100ms" }}
            >
              {[
                { label: "Triassic", period: "252–201 MYA" },
                { label: "Jurassic", period: "201–145 MYA" },
                { label: "Cretaceous", period: "145–66 MYA" },
              ].map((e, i) => (
                <div
                  key={i}
                  className="bg-white/8 backdrop-blur-md border border-white/15 rounded-full px-5 py-2 text-xs text-stone-300"
                >
                  <span className="text-amber-400 font-semibold">
                    {e.label}
                  </span>
                  <span className="text-white/40 mx-1">·</span>
                  {e.period}
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs tracking-widest">
            <span>SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>

        {/* Era Overview */}
        <div
          id="eras"
          className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-40"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-4 block">
                186 Million Years of History
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 leading-tight text-stone-100">
                Three Eras.
                <br />
                One Dynasty.
                <span className="block w-24 h-[2px] bg-amber-500 mt-4" />
              </h2>
              <p
                className="text-stone-300 leading-relaxed mb-6 text-sm sm:text-base"
                style={{ lineHeight: "1.75" }}
              >
                The Mesozoic Era is divided into three distinct geological
                periods, each with its own climate, fauna, flora, and
                catastrophic conclusion. Dinosaurs survived two mass extinctions
                before finally succumbing to the third.
              </p>
              <p
                className="text-stone-400 leading-relaxed text-sm"
                style={{ lineHeight: "1.75" }}
              >
                To put their reign in perspective: T. rex lived closer in time
                to us than to Brachiosaurus. The span of dinosaur dominance is
                almost incomprehensible — yet the fossil record has allowed
                science to reconstruct their world in extraordinary detail.
              </p>
            </div>
            <div ref={statsRef} className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { number: "186M", label: "Years of Dominance" },
                { number: "700+", label: "Named Species" },
                { number: "3", label: "Geological Periods" },
                { number: "10,000+", label: "Living Avian Descendants" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div
                    className="text-3xl sm:text-5xl font-playfair font-bold mb-2"
                    style={{ color: "#D4A853" }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-400 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Era selector */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {ERAS.map((e, i) => (
              <button
                key={i}
                onClick={() => setActiveEra(i)}
                className="text-left rounded-2xl p-6 md:p-8 border transition-all duration-300 cursor-pointer"
                style={{
                  background: activeEra === i ? e.bg : "rgba(255,255,255,0.03)",
                  borderColor:
                    activeEra === i ? e.color : "rgba(255,255,255,0.08)",
                  boxShadow:
                    activeEra === i ? `0 8px 40px ${e.color}25` : "none",
                  transform: activeEra === i ? "translateY(-4px)" : "none",
                }}
              >
                <div
                  className="text-xs font-semibold tracking-widest mb-3"
                  style={{ color: e.color }}
                >
                  {e.period}
                </div>
                <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-stone-100">
                  {e.name}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {e.desc.slice(0, 120)}…
                </p>
                <div className="mt-4 text-xs" style={{ color: e.color }}>
                  {activeEra === i
                    ? "Currently Viewing ↓"
                    : "Click to Explore →"}
                </div>
              </button>
            ))}
          </div>

          {/* Active era detail */}
          <div
            className="rounded-3xl p-8 md:p-12 border transition-all duration-500"
            style={{ background: era.bg, borderColor: `${accentColor}30` }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div
                  className="text-xs font-semibold tracking-widest mb-2"
                  style={{ color: accentColor }}
                >
                  {era.period}
                </div>
                <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-5 text-stone-100">
                  The {era.name} Period
                </h3>
                <p
                  className="text-stone-300 leading-relaxed mb-6 text-sm md:text-base"
                  style={{ lineHeight: "1.8" }}
                >
                  {era.desc}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-amber-400 tracking-wider mb-1 font-semibold">
                    DEFINING EVENT
                  </div>
                  <div className="text-stone-200 text-sm">{era.keyEvent}</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "CLIMATE", value: era.climate },
                  { label: "FAUNA", value: era.fauna },
                  { label: "FLORA", value: era.flora },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div
                      className="text-xs tracking-wider mb-1.5 font-semibold"
                      style={{ color: accentColor }}
                    >
                      {item.label}
                    </div>
                    <div className="text-stone-300 text-sm leading-relaxed">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Species Cards */}
        <div
          id="dinosaurs"
          className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32"
        >
          <div className="text-center mb-14">
            <span className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-4 block">
              Palaeontology Archive
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 text-stone-100">
              {era.name} Species
            </h2>
            <div
              className="w-24 h-[2px] mx-auto mt-4"
              style={{ background: accentColor }}
            />
            <p className="text-stone-400 mt-6 max-w-2xl mx-auto text-sm">
              Select an era above to change the species shown.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {era.dinos.map((dino, idx) => (
              <div
                key={`${dino.name}-${activeEra}`}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:scale-[1.025]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${accentColor}50`;
                  e.currentTarget.style.boxShadow = `0 8px 40px ${accentColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${dino.img}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B04] via-[#080B04]/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${dino.badgeColor}30`,
                        color: dino.badgeColor,
                        border: `1px solid ${dino.badgeColor}50`,
                      }}
                    >
                      {dino.badgeText}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-playfair font-bold mb-1 text-stone-100">
                    {dino.name}
                  </h3>
                  <p className="text-xs text-stone-500 italic mb-4">
                    {dino.latin}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { label: "Length", value: dino.length },
                      { label: "Weight", value: dino.weight },
                      { label: "Diet", value: dino.diet },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="bg-white/5 rounded-lg p-2 text-center border border-white/8"
                      >
                        <div className="text-xs" style={{ color: accentColor }}>
                          {s.label}
                        </div>
                        <div className="text-xs text-stone-300 font-medium mt-0.5 leading-tight">
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-stone-400 leading-relaxed text-sm"
                    style={{ lineHeight: "1.7" }}
                  >
                    {dino.desc}
                  </p>
                  <button
                    onClick={() =>
                      setViewer3D({ name: dino.name, id: SKETCHFAB[dino.name] })
                    }
                    className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all border"
                    style={{
                      borderColor: `${accentColor}50`,
                      color: accentColor,
                      background: `${accentColor}10`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${accentColor}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${accentColor}10`;
                    }}
                  >
                    🦴 VIEW IN 3D
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-4">
            {ERAS.map((e, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveEra(i);
                  document
                    .getElementById("dinosaurs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full text-sm font-medium transition-all border"
                style={{
                  borderColor:
                    activeEra === i ? e.color : "rgba(255,255,255,0.15)",
                  color: activeEra === i ? e.color : "rgba(255,255,255,0.5)",
                  background: activeEra === i ? `${e.color}15` : "transparent",
                }}
              >
                {e.name} ({e.period})
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div
          id="timeline"
          className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32"
        >
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-4 block">
              252–66 Million Years Ago
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 text-stone-100">
              AIM Chronology Timeline
            </h2>
            <div className="w-32 h-[2px] bg-amber-500 mx-auto mt-4" />
          </div>
          <div ref={timelineRef} className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/80 via-amber-400/40 to-red-500/80" />
            <div className="space-y-8">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isLeft = idx % 2 === 0;
                const isDino = event.type === "dinosaur";
                const dino = isDino ? ERAS.flatMap(e => e.dinos).find(d => d.name === event.dinoName) : null;
                const eraName = isDino ? ERAS.find(e => e.dinos.some(d => d.name === event.dinoName))?.name : "";
                return (
                  <div
                    key={idx}
                    className={`relative transition-all duration-700 ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <div className="hidden md:flex w-full items-center">
                      <div
                        className={`w-1/2 ${isLeft ? "pr-12 text-right" : "pl-12 order-3"}`}
                      >
                        {isDino && dino ? (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden inline-block text-left w-full max-w-md group hover:border-amber-500/50 transition-all">
                            <div className="flex gap-4 p-4">
                              <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-900 border border-white/10">
                                <img src={dino.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dino.name} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: event.color }}>{event.mya} MYA · {eraName}</span>
                                </div>
                                <h4 className="text-stone-100 font-playfair font-bold text-base mt-0.5">{dino.name}</h4>
                                <p className="text-stone-400 text-xs italic leading-none">{dino.latin}</p>
                                <p className="text-stone-300 text-xs mt-2 line-clamp-2 leading-relaxed">{dino.desc}</p>
                              </div>
                            </div>
                            <div className="bg-white/4 px-4 py-2 flex justify-between items-center border-t border-white/5">
                              <span className="text-[10px] text-stone-500 font-mono">Diet: {dino.diet} · L: {dino.length}</span>
                              <button
                                onClick={() => setViewer3D({ name: dino.name, id: SKETCHFAB[dino.name] })}
                                className="text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
                              >
                                View in 3D →
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 inline-block text-left w-full max-w-md">
                            <div
                              className="text-xs font-bold mb-2 font-mono"
                              style={{ color: event.color }}
                            >
                              {event.mya} MYA
                            </div>
                            <p className="text-stone-300 text-sm leading-relaxed">
                              {event.event}
                            </p>
                          </div>
                        )}
                      </div>
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-[#080B04] z-10"
                        style={{
                          borderColor: event.color,
                          boxShadow: `0 0 10px ${event.color}60`,
                        }}
                      />
                      {!isLeft && <div className="w-1/2" />}
                    </div>
                    <div className="md:hidden flex items-start gap-5 w-full pl-10">
                      <div
                        className="absolute left-4 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-[#080B04] mt-5"
                        style={{ borderColor: event.color }}
                      />
                      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden flex-1">
                        {isDino && dino ? (
                          <>
                            <div className="flex gap-3 p-3">
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-stone-900 border border-white/10">
                                <img src={dino.img} className="w-full h-full object-cover" alt={dino.name} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-bold tracking-wider uppercase" style={{ color: event.color }}>{event.mya} MYA · {eraName}</span>
                                <h4 className="text-stone-100 font-playfair font-bold text-sm leading-tight mt-0.5">{dino.name}</h4>
                                <p className="text-stone-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">{dino.desc}</p>
                              </div>
                            </div>
                            <div className="bg-white/4 px-3 py-1.5 flex justify-between items-center border-t border-white/5">
                              <span className="text-[9px] text-stone-500">Diet: {dino.diet}</span>
                              <button
                                onClick={() => setViewer3D({ name: dino.name, id: SKETCHFAB[dino.name] })}
                                className="text-[9px] font-bold uppercase tracking-wider text-amber-400"
                              >
                                View in 3D →
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-4">
                            <div
                              className="text-xs font-bold mb-1 font-mono"
                              style={{ color: event.color }}
                            >
                              {event.mya} MYA
                            </div>
                            <p className="text-stone-300 text-sm leading-relaxed">
                              {event.event}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Science & Adaptations */}
        <div
          id="science"
          className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32"
        >
          <div className="text-center mb-16">
            <span className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-4 block">
              Palaeobiology
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 text-stone-100">
              Revolutionary Adaptations
            </h2>
            <div className="w-32 h-[2px] bg-amber-500 mx-auto mt-4" />
            <p className="text-stone-400 mt-6 max-w-2xl mx-auto text-sm leading-relaxed">
              Modern palaeontology has radically rewritten our understanding of
              these remarkable animals.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADAPTATIONS.map((adapt, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 transition-all duration-300 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = `${adapt.color}40`;
                  e.currentTarget.style.boxShadow = `0 16px 40px ${adapt.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="text-4xl mb-5">{adapt.icon}</div>
                <div
                  className="w-8 h-[1.5px] mb-4 rounded"
                  style={{ background: adapt.color }}
                />
                <h3 className="text-lg font-playfair font-bold mb-3 text-stone-100">
                  {adapt.title}
                </h3>
                <p
                  className="text-stone-400 text-sm leading-relaxed"
                  style={{ lineHeight: "1.75" }}
                >
                  {adapt.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-white/4 rounded-2xl p-8 border border-amber-500/20">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="text-amber-400 text-xs tracking-widest font-semibold mb-3">
                  HOW WE KNOW
                </div>
                <h3 className="text-2xl font-playfair font-bold mb-4 text-stone-100">
                  The Science of Palaeontology
                </h3>
                <p
                  className="text-stone-400 text-sm leading-relaxed"
                  style={{ lineHeight: "1.8" }}
                >
                  Modern palaeontology combines CT scanning, isotope analysis,
                  biomechanical modelling, and ancient protein research to
                  reconstruct extinct life with unprecedented accuracy. Growth
                  rings in fossil bones reveal metabolism. Proteins preserved in
                  80-million-year-old fossils confirm evolutionary
                  relationships. Every year, ~50 new dinosaur species are
                  formally described.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "CT Scanning",
                  "Isotope Analysis",
                  "Protein Sequencing",
                  "Biomechanics",
                  "AI Classification",
                  "Micro-CT Imaging",
                ].map((method, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-lg px-3 py-2 text-center border border-white/8"
                  >
                    <span className="text-stone-400 text-xs">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-2xl font-playfair font-bold text-stone-200 mb-7">
              Greatest Fossil Sites on Earth
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {FOSSIL_SITES.map((site, i) => (
                <div
                  key={i}
                  className="bg-white/4 rounded-xl p-5 border border-white/8"
                >
                  <div className="text-stone-200 font-semibold text-sm mb-0.5">
                    {site.site}
                  </div>
                  <div className="text-stone-500 text-xs mb-2">
                    {site.location} · {site.era}
                  </div>
                  <div className="text-stone-400 text-xs">{site.finds}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extinction */}
        <div
          id="extinction"
          className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32"
        >
          <div className="text-center mb-16">
            <span className="text-red-500 text-xs tracking-[0.25em] uppercase mb-4 block font-semibold">
              66 Million Years Ago
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-4 text-stone-100">
              The Great Dying
            </h2>
            <div className="w-32 h-[2px] bg-red-600 mx-auto mt-4" />
          </div>
          <div className="bg-gradient-to-br from-red-950/40 to-black/60 rounded-3xl p-8 md:p-14 border border-red-900/40 mb-14">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-5 text-stone-100">
                  Chicxulub: The Last Day
                </h3>
                <p
                  className="text-stone-300 leading-relaxed mb-5 text-sm md:text-base"
                  style={{ lineHeight: "1.8" }}
                >
                  On a single day 66 million years ago, a 10-kilometre-wide
                  asteroid struck the Yucatán Peninsula at 72,000 km/h,
                  releasing energy equivalent to a billion nuclear weapons. The
                  impact triggered megatsunami, global firestorms, and a
                  decade-long "impact winter" as dust blotted out the sun.
                </p>
                <p
                  className="text-stone-400 leading-relaxed text-sm"
                  style={{ lineHeight: "1.8" }}
                >
                  Photosynthesis collapsed. Plant life died. Herbivores starved.
                  Carnivores followed. Within decades, 75% of all species on
                  Earth were gone — including all non-avian dinosaurs.
                </p>
              </div>
              <div>
                <p
                  className="text-stone-400 leading-relaxed text-sm mb-6"
                  style={{ lineHeight: "1.8" }}
                >
                  Yet the dinosaurs did not truly go extinct. One lineage
                  survived: the feathered, small-bodied ancestors of modern
                  birds. Today, over 10,000 species of avian dinosaurs fill
                  every ecological niche on Earth. Every time you see a bird,
                  you are looking at a living dinosaur.
                </p>
                <div className="bg-black/40 rounded-xl p-5 border border-red-900/30">
                  <div className="text-red-400 text-xs font-semibold tracking-wider mb-3">
                    WHAT SURVIVED
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Small birds",
                      "Crocodilians",
                      "Turtles",
                      "Lizards",
                      "Snakes",
                      "Mammals",
                      "Amphibians",
                      "Insects",
                    ].map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            ref={extinctionRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {EXTINCTION_FACTS.map((fact, idx) => (
              <div
                key={idx}
                className={`bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center transition-all duration-700 ${extinctionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div
                  className="text-xl md:text-2xl font-playfair font-bold mb-2"
                  style={{ color: "#EF4444" }}
                >
                  {fact.stat}
                </div>
                <div className="text-xs text-stone-500 leading-tight">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Birds Are Dinosaurs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="bg-gradient-to-br from-amber-900/20 to-green-900/20 rounded-3xl p-10 md:p-16 border border-amber-600/20 text-center">
            <div className="text-6xl mb-6">🦅</div>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-5 text-stone-100">
              Dinosaurs Never Went Extinct
            </h2>
            <p
              className="text-stone-300 max-w-3xl mx-auto leading-relaxed mb-6 text-sm md:text-base"
              style={{ lineHeight: "1.8" }}
            >
              The sparrow outside your window is a dinosaur. Birds are
              classified within the Dinosauria — they are not merely descendants
              of dinosaurs, they <em>are</em> dinosaurs. Every wing beat, every
              feather, every hollow bone is a living echo of the Mesozoic Era.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                "Sparrows",
                "Eagles",
                "Penguins",
                "Owls",
                "Hummingbirds",
                "Ostriches",
                "Parrots",
                "Albatrosses",
              ].map((b, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-amber-900/30 border border-amber-600/20 text-amber-200 text-xs font-medium"
                >
                  {b} 🦕
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-5 text-stone-100">
              Explore the Fossil Record
            </h2>
            <p
              className="text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed text-sm"
              style={{ lineHeight: "1.8" }}
            >
              The greatest dinosaur collections on Earth are found at the
              Smithsonian, the American Museum of Natural History, the Natural
              History Museum London, and the Royal Tyrrell Museum of
              Palaeontology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#eras"
                className="inline-block px-10 py-4 bg-white/8 backdrop-blur-md rounded-full font-medium border-2 border-amber-500 text-white hover:shadow-[0_0_30px_rgba(212,168,83,0.5)] transition-all text-sm"
              >
                Back to Top ↑
              </a>
              <a
                href="https://naturalhistory.si.edu/research/paleobiology"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-white/5 backdrop-blur-md rounded-full font-medium border border-white/20 text-stone-300 hover:bg-white/10 transition-all text-sm"
              >
                Smithsonian Palaeobiology →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦕</span>
              <div>
                <div className="text-amber-400 text-sm font-semibold tracking-widest">
                  AIM CENTRE 360
                </div>
                <div className="text-stone-500 text-xs mt-0.5">
                  AIM High, Achieve Infinity · Prehistoric Archive
                </div>
              </div>
            </div>
            <div className="text-stone-600 text-xs text-center md:text-right">
              <p>
                Content compiled from peer-reviewed palaeontological research.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dmsans { font-family: 'DM Sans', sans-serif; }
        @keyframes scrollHint {
          0%, 100% { opacity: 0.3; transform: translateY(0) translateX(-50%); }
          50% { opacity: 0.8; transform: translateY(8px) translateX(-50%); }
        }
        .scroll-hint { animation: scrollHint 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
