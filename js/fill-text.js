gsap.registerPlugin(ScrollTrigger);

const target = document.querySelector(".js-fill > span");

if (target && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.to(target, {
    backgroundSize: "200% 200%",
    ease: "none",
    scrollTrigger: {
      trigger: ".js-fill",
      start: "top 80%",
      end: "bottom 35%",
      scrub: true
    }
  });
}

const diagonal_section = document.querySelector(".diagonal-section");
const diagonal_shape = document.querySelector(".diagonal-shape");
const inside = document.querySelector(".person-img");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: diagonal_section,
    start: "top top",
    end: () => "+=" + diagonal_section.offsetWidth, 
    pin: true,
    scrub: true
  }
});

// Move "\" shape to center
tl.to(diagonal_shape, {
  x: "95vw",
  ease: "power1.inOut",
  duration: 2
});

// Reveal image inside
tl.to(inside, {
  x: "20%",
  ease: "power1.inOut",
  duration: 2
});