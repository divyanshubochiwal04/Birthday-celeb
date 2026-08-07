/**
 * TributeApp - Celebration Storyboard Manager
 * Architectural Refactoring for Enterprise Standards
 * Built with modular design patterns, robust error boundary checks,
 * and high-performance GSAP scroll/timeline animation setups.
 */
((window, document) => {
  'use strict';

  // TributeApp Namespace Configuration
  const TributeApp = {
    // State Tracking
    state: {
      isAutoScrolling: false,
      storyTimeline: null,
      activeFloatAnimations: []
    },

    // Bound reference for listener removal
    _boundKill: null,

    // Initialization lifecycle
    init() {
      // 1. Verify and register GreenSock Plugins
      if (!this.checkDependencies()) {
        console.error("[TributeApp] Core dependencies (GSAP or AOS) missing. Aborting animation load.");
        return;
      }

      // 2. Unify DOM Initialization
      this.initLanding();
      this.initHero();
      this.initPortraits();
      this.initTimeline();
      this.initDomains();
      this.initLogos();
      this.initWishes();
      this.initFinale();
      this.initAOS();
    },

    /**
     * Confirms that global animation libraries are resolved
     * @returns {boolean}
     */
    checkDependencies() {
      if (typeof gsap === 'undefined') return false;
      try {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      } catch (e) {
        console.warn("[TributeApp] Error registering GSAP plugins:", e);
      }
      return true;
    },

    /**
     * Initialize AOS with optimal settings
     */
    initAOS() {
      if (window.AOS && typeof window.AOS.init === 'function') {
        window.AOS.init({
          duration: 1000,
          once: true,
          disable: 'mobile' // Disable scroll animations on mobile to save frames
        });
      }
    },

    /**
     * Private Utility: Floating Element Motion
     * Creates subtle multi-directional movement hooks
     * @param {string|Element} selector
     * @param {Object} config
     */
    floatElement(selector, config = {}) {
      const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!target) return;

      const {
        x = "5vw",
        y = "5vh",
        duration = 4 + Math.random() * 2
      } = config;

      const anim = gsap.to(target, {
        x: () => (Math.random() > 0.5 ? x : `-${x}`),
        y: () => (Math.random() > 0.5 ? y : `-${y}`),
        duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      this.state.activeFloatAnimations.push(anim);
    },

    /**
     * SECTION 1: Landing screen entry and countdown trigger
     */
    initLanding() {
      const landing = document.querySelector(".landing");
      const startBtn = document.getElementById("landingStartBtn");
      const overlay = document.getElementById("countdownOverlay");
      const countNumEl = document.querySelector(".count-num");

      if (!landing || !startBtn || !overlay || !countNumEl) return;

      // Smooth entrance of landing elements
      gsap.from(".landing-content", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      // Subtle float animation on landing background dots
      [".dot-1", ".dot-2", ".dot-3", ".dot-4", ".dot-5"].forEach((sel) => {
        this.floatElement(sel, { x: '2vw', y: '2vh', duration: 6 + Math.random() * 3 });
      });

      startBtn.addEventListener("click", () => {
        // Micro-interaction on click
        gsap.fromTo(
          startBtn,
          { scale: 1 },
          { scale: 0.94, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
        );

        // Fade out landing content and start countdown
        gsap.timeline()
          .set(overlay, { display: "flex", opacity: 1 })
          .call(() => this.runCountdownAndStory(overlay, countNumEl));
      }, { passive: true });
    },

    /**
     * Executes the celebration countdown overlay animations
     * @param {Element} overlay
     * @param {Element} countNumEl
     */
    runCountdownAndStory(overlay, countNumEl) {
      document.body.classList.add("dark-theme");
      const numbers = [3, 2, 1];

      const tl = gsap.timeline({
        onComplete: () => {
          this.spawnConfetti(overlay);
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.8,
            delay: 0.8,
            onComplete: () => {
              overlay.style.display = "none";
              gsap.to(window, {
                scrollTo: { y: ".hero", autoKill: false },
                duration: 1.2,
                ease: "power3.inOut",
                onComplete: () => this.startStoryScroll()
              });
            }
          });
        }
      });

      numbers.forEach((num, index) => {
        tl.call(() => {
          countNumEl.textContent = String(num);
        });

        tl.fromTo(
          countNumEl,
          { scale: 0, opacity: 0 },
          {
            scale: 1.2,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(2)"
          }
        );

        tl.to(countNumEl, {
          scale: 0.6,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in"
        });

        if (index < numbers.length - 1) {
          tl.to({}, { duration: 0.1 }); // Gap frame
        }
      });
    },

    /**
     * Scroll Listeners Management
     */
    addScrollListeners() {
      this._boundKill = this.killAutoScroll.bind(this);
      window.addEventListener("wheel", this._boundKill, { passive: true });
      window.addEventListener("touchstart", this._boundKill, { passive: true });
    },

    removeScrollListeners() {
      if (this._boundKill) {
        window.removeEventListener("wheel", this._boundKill);
        window.removeEventListener("touchstart", this._boundKill);
      }
    },

    /**
     * Safely interrupts active auto scroll timeline
     */
    killAutoScroll() {
      if (this.state.isAutoScrolling) {
        this.state.isAutoScrolling = false;
        if (this.state.storyTimeline) {
          this.state.storyTimeline.kill();
        }
        document.body.classList.remove("scrolling");
        this.removeScrollListeners();
      }
    },

    /**
     * Cinematic Auto-Scroll Control Lifecycle
     */
    startStoryScroll() {
      const sections = Array.from(document.querySelectorAll("section:not(.landing)"));
      if (sections.length === 0) return;

      this.state.isAutoScrolling = true;
      document.body.classList.add("scrolling");

      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        onComplete: () => {
          this.state.isAutoScrolling = false;
          document.body.classList.remove("scrolling");
          this.removeScrollListeners();
        }
      });
      this.state.storyTimeline = tl;

      this.addScrollListeners();

      sections.forEach((target) => {
        if (!this.state.isAutoScrolling) return;

        let delayStay = 2.5;
        if (target.classList.contains("portraits-section")) {
          delayStay = 4.0;
        } else if (target.id === "empire-timeline-1" || target.id === "empire-timeline-2") {
          delayStay = 5.0;
        } else if (target.classList.contains("domains-section")) {
          delayStay = 4.0;
        } else if (target.classList.contains("logos-section")) {
          delayStay = 3.0;
        } else if (target.classList.contains("wishes-section")) {
          delayStay = 32.0; // Stay longer to watch the diary pages turn
        } else if (target.classList.contains("thankyou-section")) {
          delayStay = 3.0;
        }

        tl.to(window, {
          duration: 3.5, // Smooth cinematic panning speed
          scrollTo: { y: target, autoKill: false },
          onStart: () => {
            if (!this.state.isAutoScrolling) tl.kill();
          }
        });
        tl.to({}, { duration: delayStay });
      });
    },

    /**
     * Confetti Particle Eruption Engine
     * Uses hardware-accelerated CSS elements spawned dynamically
     * @param {Element} overlay
     */
    spawnConfetti(overlay) {
      if (!overlay) return;

      const piecesCount = 200; // Balanced count to prevent GPU thrashing on entry-level systems
      const colors = ["#ffd700", "#ff6b35", "#4ecdc4", "#ffffff"];
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < piecesCount; i++) {
        const piece = document.createElement("div");
        piece.style.width = `${Math.random() * 4 + 6}px`;
        piece.style.height = `${Math.random() * 8 + 6}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.position = "absolute";
        piece.style.willChange = "transform, opacity";

        // Distribute spawn points along edges
        const edge = Math.floor(Math.random() * 4);
        let startX, startY;

        switch (edge) {
          case 0: // Top
            startX = Math.random() * 100 + "vw";
            startY = "-10px";
            break;
          case 1: // Right
            startX = "100vw";
            startY = Math.random() * 100 + "vh";
            break;
          case 2: // Bottom
            startX = Math.random() * 100 + "vw";
            startY = "100vh";
            break;
          case 3: // Left
            startX = "-10px";
            startY = Math.random() * 100 + "vh";
            break;
        }

        piece.style.left = startX;
        piece.style.top = startY;
        fragment.appendChild(piece);

        gsap.to(piece, {
          x: (Math.random() - 0.5) * window.innerWidth * 0.9,
          y: (Math.random() - 0.5) * window.innerHeight * 0.9,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 1.8 + Math.random() * 1.5,
          ease: "power2.out",
          onComplete: () => piece.remove()
        });
      }

      overlay.appendChild(fragment);

      // Smooth modern transitions via cinematic glass overlay
      const glassPane = document.createElement("div");
      glassPane.classList.add("glass-pane");
      document.body.appendChild(glassPane);

      gsap.fromTo(
        glassPane,
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => glassPane.remove()
        }
      );
    },

    /**
     * SECTION 2: Hero Intro & Floating elements
     */
    initHero() {
      const hero = document.querySelector(".hero");
      if (!hero) return;

      const tl = gsap.timeline();

      tl.from(".boss-photo", {
        duration: 1.4,
        scale: 0.4,
        rotate: -8,
        opacity: 0,
        ease: "back.out(1.8)"
      })
      .from(".hero-title", {
        duration: 1.1,
        y: '6vh',
        opacity: 0,
        ease: "power3.out"
      }, "-=0.7")
      .from(".hero-subtitle", {
        duration: 1,
        y: '3vh',
        opacity: 0,
        ease: "power2.out"
      }, "-=0.6")
      .from(".cta-btn", {
        duration: 0.8,
        y: '3vh',
        opacity: 0,
        scale: 0.9,
        ease: "power2.out"
      }, "-=0.5");

      // Subtle float motion on photo
      gsap.to(".boss-photo", {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Parallax bindings
      gsap.to(".boss-photo", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: '10vh',
        ease: "none"
      });

      gsap.to(".hero-title", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: '5vh',
        ease: "none"
      });

      // Floating abstract shapes
      for (let i = 1; i <= 5; i++) {
        this.floatElement(`.doodle-${i}`, {
          x: `${2 + i * 0.3}vw`,
          y: `${2 + i * 0.4}vh`,
          duration: 5 + i * 0.5
        });
      }

      const cta = document.getElementById("cta-journey");
      if (cta) {
        cta.addEventListener("click", () => {
          this.killAutoScroll(); // Safely stop auto-scroll timeline first!
          gsap.fromTo(
            cta,
            { scale: 1 },
            { scale: 0.95, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
          );
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: "#empire-timeline-1", autoKill: true },
            ease: "power2.out"
          });
        }, { passive: true });

        // Hover micro-animations
        const ctaHover = gsap.to(cta, {
          scale: 1.04,
          duration: 0.25,
          boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
          paused: true,
          ease: "power2.out"
        });

        cta.addEventListener("mouseenter", () => ctaHover.play());
        cta.addEventListener("mouseleave", () => ctaHover.reverse());
      }
    },

    /**
     * SECTION 3: Portrait gallery scroll bindings
     */
    initPortraits() {
      const portraits = document.querySelectorAll(".portrait-img");
      if (portraits.length === 0) return;

      portraits.forEach((img, index) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: ".portraits-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: '10vh',
          scale: 0.8,
          duration: 1.1,
          delay: index * 0.12,
          ease: "power3.out"
        });

        this.floatElement(img, {
          x: `${4 + index * 0.8}vw`,
          y: `${3 + index * 0.5}vh`,
          duration: 5.5 + Math.random() * 2
        });
      });

      // Parallax inner wrapper transition
      gsap.to(".portraits-inner", {
        scrollTrigger: {
          trigger: ".portraits-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        y: -40,
        ease: "none"
      });
    },

    /**
     * SECTION 4: Professional Timeline slides
     */
    initTimeline() {
      const cards = document.querySelectorAll(".timeline-card");
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        const fromX = index % 2 === 0 ? '-10vw' : '10vw';
        
        // Timeline entry
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: '5vh',
          x: fromX,
          duration: 1.2,
          ease: "power2.out"
        });

        this.floatElement(card, { x: '1vw', y: '1vh', duration: 6 + Math.random() * 2 });

        // Scroll zoom
        gsap.fromTo(
          card,
          { scale: 0.85 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 20%",
              scrub: true
            }
          }
        );
      });

      // Animate filling timeline progress line on scroll
      const sections = document.querySelectorAll(".timeline-section");
      sections.forEach((section) => {
        const progressLine = section.querySelector(".timeline-line-progress");
        if (!progressLine) return;

        gsap.fromTo(progressLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              scrub: true
            }
          }
        );
      });

      // Blob Parallaxing
      [1, 2].forEach((num) => {
        const sign = num === 1 ? -1 : 1;
        gsap.to(`.timeline-section .blob-${num}`, {
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          },
          y: sign * 75,
          x: sign * 45,
          ease: "none"
        });
      });
    },

    /**
     * SECTION 5: Domains visual cards
     */
    initDomains() {
      const domainCards = document.querySelectorAll(".domain-card");
      if (domainCards.length === 0) return;

      gsap.from(".domains-grid", {
        scrollTrigger: {
          trigger: ".domains-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: '8vh',
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      domainCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: '5vh',
          duration: 0.7,
          delay: index * 0.08,
          ease: "power2.out"
        });

        this.floatElement(card, { x: '1.2vw', y: '1.2vh', duration: 5 + Math.random() * 3 });

        gsap.fromTo(
          card,
          { scale: 0.8, rotation: -4 },
          {
            scale: 1,
            rotation: 0,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 30%",
              scrub: true
            }
          }
        );
      });

      gsap.to(".domains-inner", {
        scrollTrigger: {
          trigger: ".domains-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        y: -40,
        ease: "none"
      });
    },

    /**
     * SECTION 6: Brands Logo Showcase
     */
    initLogos() {
      const logosSection = document.querySelector(".logos-section");
      if (!logosSection) return;

      gsap.from(".logo-piece", {
        scrollTrigger: {
          trigger: logosSection,
          start: "top 85%",
          once: true
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    },

    /**
     * SECTION 7: Book/Diary Automated Page Flipping
     */
    initWishes() {
      const pages = document.querySelectorAll('.book .page');
      // Defensive checks: requires at least 7 pages to run cleanly
      if (pages.length < 7) return;

      const coverFront = pages[0];
      const page1 = pages[2];
      const page2 = pages[3];
      const page3 = pages[4];

      if (!coverFront || !page1 || !page2 || !page3) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".wishes-section",
          start: "top center",
          onEnter: () => {
            // Hard reset values on view entrance to guarantee sync
            gsap.set(pages, { rotateY: 0 });
            gsap.set(coverFront, { zIndex: 200 });
            gsap.set(pages[0], { zIndex: 1 });
            gsap.set(pages[1], { zIndex: 3 });
            gsap.set(page1, { zIndex: 5 });
            gsap.set(page2, { zIndex: 4 });
            gsap.set(page3, { zIndex: 3 });
            gsap.set(pages[5], { zIndex: 2 });
            gsap.set(pages[6], { zIndex: 0 });
            tl.restart();
          },
          onLeaveBack: () => {
            tl.pause(0);
          }
        },
        paused: true
      });

      // Cinematic slow-flipping parameters
      tl.to(coverFront, {
        rotateY: -180,
        duration: 6.5,
        ease: "power2.inOut",
        onStart: () => gsap.set(coverFront, { zIndex: 200 }),
        onComplete: () => gsap.set(coverFront, { zIndex: 1 })
      }).to({}, { duration: 1.5 });

      tl.to(page1, {
        rotateY: -180,
        duration: 3.8,
        ease: "power2.inOut",
        onStart: () => gsap.set(page1, { zIndex: 200 }),
        onComplete: () => gsap.set(page1, { zIndex: 2 })
      }).to({}, { duration: 3.5 });

      tl.to(page2, {
        rotateY: -180,
        duration: 3.8,
        ease: "power2.inOut",
        onStart: () => gsap.set(page2, { zIndex: 200 }),
        onComplete: () => gsap.set(page2, { zIndex: 3 })
      }).to({}, { duration: 3.5 });

      tl.to(page3, {
        rotateY: -180,
        duration: 3.8,
        ease: "power2.inOut",
        onStart: () => gsap.set(page3, { zIndex: 200 }),
        onComplete: () => gsap.set(page3, { zIndex: 4 })
      }).to({}, { duration: 3.5 });
    },

    /**
     * SECTION 8: Finale Credits & Signoff
     */
    initFinale() {
      const finaleSection = document.querySelector(".finale-section");
      if (!finaleSection) return;

      const titleEl = document.querySelector(".finale-title");
      if (titleEl) {
        // Split title into individual animation characters
        const text = titleEl.textContent;
        const chars = text.split("").map((char) => `<span class="char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`).join("");
        titleEl.innerHTML = chars;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: finaleSection,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(".finale-inner", {
        opacity: 0,
        y: '10vh',
        scale: 0.92,
        duration: 1.2,
        ease: "power3.out"
      });

      if (titleEl) {
        tl.from(".finale-title .char", {
          opacity: 0,
          y: '2vh',
          stagger: 0.04,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.6");
      }
    }
  };

  // Safe DOM ready event binding
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => TributeApp.init());
  } else {
    TributeApp.init();
  }

})(window, document);