gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// helper: floating effect
function floatElement(selector, config = {}) {
  const {
    x = "5vw",
    y = "5vh",
    duration = 4 + Math.random() * 2
  } = config;

  gsap.to(selector, {
    x: () => (Math.random() > 0.5 ? x : `-${x}`),
    y: () => (Math.random() > 0.5 ? y : `-${y}`),
    duration,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
}

// LANDING + COUNTDOWN + STORY AUTO-SCROLL
function initLanding() {
  const landing = document.querySelector(".landing");
  const startBtn = document.getElementById("landingStartBtn");
  const overlay = document.getElementById("countdownOverlay");
  const countNumEl = document.querySelector(".count-num");

  if (!landing || !startBtn || !overlay || !countNumEl) return;

  // landing entry animation
  gsap.from(".landing-content", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.from(".badge-pill", {
    y: '2vh',
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
  });

  // floating dots
  [".dot-1", ".dot-2", ".dot-3", ".dot-4", ".dot-5"].forEach((sel) => {
    floatElement(sel, { x: '2vw', y: '2vh', duration: 6 + Math.random() * 3 });
  });

  

  

  startBtn.addEventListener("click", () => {
    // small click animation
    gsap.fromTo(
      startBtn,
      { scale: 1 },
      { scale: 0.94, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );

    // fade out landing content and start countdown
    gsap.timeline()
      .set(overlay, { display: "flex", opacity: 1 })
      .call(() => runCountdownAndStory(overlay, countNumEl));
  });
}

function runCountdownAndStory(overlay, countNumEl) {
  document.body.classList.add("dark-theme");
  const numbers = [3, 2, 1];

  const tl = gsap.timeline({
    onComplete: () => {
      // confetti + hide overlay + start story scroll
      spawnConfetti(overlay);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        onComplete: () => {
          overlay.style.display = "none";
          gsap.to(window, {
            scrollTo: {
              y: ".hero",
            },
            duration: 1,
            onComplete: () => {
              startStoryScroll();
            }
          });
        }
      });
    }
  });

  numbers.forEach((num, index) => {
    tl.call(() => {
      countNumEl.textContent = num;
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
      tl.to({}, { duration: 0.1 }); // small gap
    }
  });
}





function startStoryScroll() {
  const sections = Array.from(document.querySelectorAll("section:not(.landing)"));
  let isAutoScrolling = true;

  const tl = gsap.timeline({
    defaults: { ease: "power1.inOut" },
    onComplete: () => {
      isAutoScrolling = false;
      document.body.classList.remove("scrolling");
      removeEventListeners();
    }
  });

  const killAutoScroll = () => {
    if (isAutoScrolling) {
      isAutoScrolling = false;
      tl.kill();
      document.body.classList.remove("scrolling");
      removeEventListeners();
    }
  };

  const addEventListeners = () => {
    window.addEventListener("wheel", killAutoScroll);
    window.addEventListener("touchstart", killAutoScroll);
  };

  const removeEventListeners = () => {
    window.removeEventListener("wheel", killAutoScroll);
    window.removeEventListener("touchstart", killAutoScroll);
  };

  addEventListeners();
  document.body.classList.add("scrolling");

  sections.forEach((target) => {
    if (!isAutoScrolling) return;

    let delayStay = 2.5; // Default delay
    if (target.classList.contains("portraits-section")) {
      delayStay = 4.0;
    } else if (target.id === "empire-timeline-1" || target.id === "empire-timeline-2") {
      delayStay = 5.0;
    } else if (target.classList.contains("domains-section")) {
      delayStay = 4.0;
    } else if (target.classList.contains("logos-section")) {
      delayStay = 3.0;
    } else if (target.classList.contains("wishes-section")) {
      delayStay = 34; // Increased delay for diary animation
    } else if (target.classList.contains("thankyou-section")) {
      delayStay = 3.0;
    }

    tl.to(window, {
      duration: 4, // Slower scroll
      scrollTo: {
        y: target,
        autoKill: false,
      },
      onStart: () => {
        if (!isAutoScrolling) tl.kill();
      }
    });
    tl.to({}, { duration: delayStay });
  });
}
// simple confetti burst
function spawnConfetti(overlay) {
  const pieces = 400; // Increased number of pieces
  const colors = ["#ffd700", "#ff6b35", "#4ecdc4", "#ffffff"];

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("div");
    piece.style.width = "10px";
    piece.style.height = "10px";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.position = "absolute";

    // Burst from edges and corners
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
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
    overlay.appendChild(piece);

    gsap.to(piece, {
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      rotation: Math.random() * 360,
      opacity: 0,
      duration: 2 + Math.random() * 2,
      ease: "power2.out",
      onComplete: () => piece.remove(),
    });
  }

  const glassPane = document.createElement("div");
  glassPane.classList.add("glass-pane");
  document.body.appendChild(glassPane);

  gsap.fromTo(
    glassPane,
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    {
      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        glassPane.remove();
      },
    }
  );
}

/* HERO ANIMATION + PARALLAX */
function initHero() {
  const tl = gsap.timeline();

  tl.from(".boss-photo", {
    duration: 1.4,
    scale: 0.4,
    rotate: -8,
    opacity: 0,
    ease: "back.out(1.8)"
  })
    .from(
      ".hero-title",
      {
        duration: 1.1,
        y: '6vh',
        ease: "power3.out"
      },
      "-=0.7"
    )
    .from(
      ".hero-subtitle",
      {
        duration: 1,
        y: '3vh',
        ease: "power2.out"      },
      "-=0.6"
    )
    .from(
      ".cta-btn",
      {
        duration: 0.8,
y: '3vh',
        opacity: 0,
        scale: 0.9,
        ease: "power2.out"
      },
      "-=0.5"
    );

  // subtle float
  gsap.to(".boss-photo", {
    y: -12,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // hero parallax
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

  // floating doodles
  floatElement(".doodle-1", { x: '3vw', y: '3vh' });
  floatElement(".doodle-2", { x: '2.5vw', y: '2.5vh' });
  floatElement(".doodle-3", { x: '2vw', y: '3vh' });
  floatElement(".doodle-4", { x: '3vw', y: '4vh' });
  floatElement(".doodle-5", { x: '2vw', y: '2vh' });

  const cta = document.getElementById("cta-journey");
  if (cta) {
    // button click scroll + click animation
    cta.addEventListener("click", () => {
      gsap.fromTo(
        cta,
        { scale: 1 },
        { scale: 0.95, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
      const el = document.querySelector("#empire-timeline-1");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });

    // hover animation for CTA
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
}

/* PORTRAITS – floating PNGs + parallax */
function initPortraits() {
  const portraits = document.querySelectorAll(".portrait-img");

  portraits.forEach((img, index) => {
    // entry animation
    gsap.from(img, {
      scrollTrigger: {
        trigger: ".portraits-section",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
y: '10vh',
      scale: 0.8,
      duration: 1,
      delay: index * 0.1,
      ease: "power3.out"
    });

    // floating motion
    floatElement(img, {
      x: `${5 + index}vw`,
      y: `${3 + index}vh`,
      duration: 5 + Math.random() * 3
    });
  });

  // parallax of whole section
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
}

/* TIMELINE ANIMATION (lift + slide) */
function initTimeline() {
  const cards = document.querySelectorAll(".timeline-card");

  cards.forEach((card, index) => {
    const fromX = index % 2 === 0 ? '-10vw' : '10vw';
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: '5vh',
      x: fromX,
      duration: 1.4,
      ease: "power2.out",
    });

    // Floating effect
    floatElement(card, { x: '1vw', y: '1vh', duration: 5 + Math.random() * 2 });

    // Scroll in-and-out effect
    gsap.fromTo(
      card,
      { scale: 0.8 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );
  });

  // parallax BG blobs for timeline
  gsap.to(".timeline-section .blob-1", {
    scrollTrigger: {
      trigger: ".timeline-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -70,
    x: -40,
    ease: "none",
  });

  gsap.to(".timeline-section .blob-2", {
    scrollTrigger: {
      trigger: ".timeline-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: 80,
    x: 50,
    ease: "none",
  });
}

/* DOMAINS ANIMATION */
function initDomains() {
  const domainCards = document.querySelectorAll(".domain-card");

  gsap.from(".domains-grid", {
    scrollTrigger: {
      trigger: ".domains-section",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: '10vh',
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  domainCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: '5vh',
      duration: 0.7,
      delay: index * 0.06,
      ease: "power2.out",
    });

    // Floating effect
    floatElement(card, { x: '1.5vw', y: '1.5vh', duration: 6 + Math.random() * 3 });

    // Scroll in-and-out effect with rotation
    gsap.fromTo(
      card,
      { scale: 0.5, rotation: -15 },
      {
        scale: 1,
        rotation: 0,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );
  });

  // parallax move of domains section
  gsap.to(".domains-inner", {
    scrollTrigger: {
      trigger: ".domains-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -40,
    ease: "none",
  });
}

/* LOGOS – scattered to assembled strip on scroll */
/* LOGOS – smoother non-scrub scroll */
function initLogos() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".logos-section",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });

  tl.from(".logo-piece", {
    opacity: 0,
    y: '5vh',
    stagger: 0.2,
    duration: 1.0,
    ease: "power2.out",
  });
}

/* WISHES – DIARY AUTO PAGE FLIP (stacked overlapping pages) */
function initWishes() {
  const pages = document.querySelectorAll('.book .page');
  if (pages.length === 0) return;

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
        // Reset and play the timeline when scrolling into view
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
        // Optional: reset when scrolling back up past the trigger
        tl.pause(0);
      },
    },
    paused: true, // Start paused
  });

  // Animation sequence
  tl.to(coverFront, { rotateY: -180, duration: 7, ease: "power2.inOut", onStart: () => gsap.set(coverFront, { zIndex: 200 }), onComplete: () => gsap.set(coverFront, { zIndex: 1 }) }).to({}, { duration: 2 });
  tl.to(page1, { rotateY: -180, duration: 4, ease: "power2.inOut", onStart: () => gsap.set(page1, { zIndex: 200 }), onComplete: () => gsap.set(page1, { zIndex: 2 }) }).to({}, { duration: 4 });
  tl.to(page2, { rotateY: -180, duration: 4, ease: "power2.inOut", onStart: () => gsap.set(page2, { zIndex: 200 }), onComplete: () => gsap.set(page2, { zIndex: 3 }) }).to({}, { duration: 4 });
  tl.to(page3, { rotateY: -180, duration: 4, ease: "power2.inOut", onStart: () => gsap.set(page3, { zIndex: 200 }), onComplete: () => gsap.set(page3, { zIndex: 4 }) }).to({}, { duration: 4 });
}

/* FINALE – fade in + slight scale */
function initFinale() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".finale-section",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  });

  tl.from(".finale-inner", {
    opacity: 0,
    y: '10vh',
    scale: 0.9,
    duration: 1.2,
    ease: "power3.out",
  });

  tl.from(
    ".finale-title .char",
    {
      opacity: 0,
      y: '2vh',
      stagger: 0.05,
      ease: "power2.out",
    },
    "-=0.5"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const finaleTitle = document.querySelector(".finale-title");
  const text = finaleTitle.textContent;
  const chars = text.split("").map((char) => `<span class="char">${char}</span>`).join("");
  finaleTitle.innerHTML = chars;
});

// INIT ALL
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({ duration: 1000 });
  }

  initLanding();
  initHero();
  initPortraits();
  initTimeline();
  initDomains();
  initLogos();
  initWishes();
  initFinale();
});