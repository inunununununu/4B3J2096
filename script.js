
/* =========================
   1. 手機版導覽選單
========================= */
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = document.querySelectorAll(".nav a");

function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "開啟導覽選單");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "關閉導覽選單" : "開啟導覽選單"
  );
});

// 點擊導覽連結後關閉手機選單
navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// 切換到桌面版時，清除手機選單狀態
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

/* =========================
   2. 回到頂部按鈕
========================= */
const backToTop = document.querySelector("#backToTop");

function updateBackToTop() {
  backToTop.classList.toggle("show", window.scrollY > 400);
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? "auto" : "smooth"
  });
});

/* =========================
   3. 作品區塊滑入動畫
========================= */
const revealElements = document.querySelectorAll(
  ".section-heading, .work-card, .hero-content, .closing"
);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* =========================
   4. 導覽列目前區塊標記
========================= */
const sections = document.querySelectorAll(
  "main section[id]"
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", isCurrent);

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================
   5. 自動顯示今年年份
========================= */
document.querySelector("#year").textContent =
  new Date().getFullYear();

/* =========================
   6. 作品圖片全圖預覽
========================= */
const imagePreview = document.querySelector("#imagePreview");
const imagePreviewContent = document.querySelector(
  "#imagePreviewContent"
);
const imagePreviewClose = document.querySelector(
  ".image-preview-close"
);

document.querySelectorAll(".work-image").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (typeof imagePreview.showModal !== "function") {
      return;
    }

    event.preventDefault();
    const image = link.querySelector("img");
    imagePreviewContent.src = image.currentSrc || image.src;
    imagePreviewContent.alt = image.alt;
    imagePreview.showModal();
  });
});

imagePreviewClose.addEventListener("click", () => {
  imagePreview.close();
});

imagePreview.addEventListener("click", (event) => {
  if (event.target === imagePreview) {
    imagePreview.close();
  }
});

imagePreview.addEventListener("close", () => {
  imagePreviewContent.removeAttribute("src");
});

/* =========================
   7. 點擊星星粒子效果
========================= */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

window.addEventListener("click", (event) => {
  if (prefersReducedMotion.matches) {
    return;
  }

  const particleColors = [
    "#168fc1",
    "#5fc4d8",
    "#087f8c",
    "#91d9e8",
    "#b7e9f2",
    "#ffffff"
  ];

  for (let index = 0; index < 10; index += 1) {
    const angle = (Math.PI * 2 * index) / 10 +
      (Math.random() - 0.5) * 0.45;
    const distance = 24 + Math.random() * 28;
    const particle = document.createElement("span");

    particle.className = "click-particle";
    particle.textContent = "✦";
    particle.setAttribute("aria-hidden", "true");
    particle.style.left = `${event.clientX}px`;
    particle.style.top = `${event.clientY}px`;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.color = particleColors[
      Math.floor(Math.random() * particleColors.length)
    ];
    particle.style.fontSize = `${7 + Math.random() * 13}px`;
    document.body.append(particle);
    particle.addEventListener("animationend", () => {
      particle.remove();
    }, { once: true });
  }
});
