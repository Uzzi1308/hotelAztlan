/* ============================================================
   Hotel Aztlán · main.js
   ============================================================ */

// ⚠️ CAMBIA ESTE NÚMERO por el número real de WhatsApp (formato internacional, sin + ni espacios)
const WHATSAPP_NUMBER = "523111234567";

/* ---------- Init Lucide icons ---------- */
if (window.lucide) {
  lucide.createIcons();
}

/* ---------- Año en footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- WhatsApp links (data-wa) ---------- */
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(el.dataset.wa || "Hola, quiero información.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  });
});

/* ---------- Burger menu ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
if (burger && menu) {
  burger.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
}

/* ---------- Scroll progress bar ---------- */
const pg = document.getElementById("pg");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrollTop = h.scrollTop || document.body.scrollTop;
  const scrollHeight = h.scrollHeight - h.clientHeight;
  const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  pg.style.transform = `scaleX(${pct})`;
});

/* ---------- Header scrolled state + active links ---------- */
const header = document.querySelector("header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);

  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach((a) =>
    a.classList.toggle("act", a.getAttribute("href") === "#" + current)
  );
});

/* ---------- Ripple effect on buttons ---------- */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const r = document.createElement("span");
    r.className = "rip";
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + "px";
    r.style.left = e.clientX - rect.left - size / 2 + "px";
    r.style.top = e.clientY - rect.top - size / 2 + "px";
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* ---------- Quick booking ---------- */
const qGo = document.getElementById("q_go");
if (qGo) {
  qGo.addEventListener("click", () => {
    const input = document.getElementById("q_in").value;
    const output = document.getElementById("q_out").value;
    const guests = document.getElementById("q_g").value;
    const room = document.getElementById("q_r").value;
    const formatDate = (value) => {
      if (!value) return "Por definir";
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    };
    const msg = `Hola, me gustaría consultar disponibilidad en Hotel Aztlán:\n\nLlegada: ${formatDate(input)}\nSalida: ${formatDate(output)}\nHuéspedes: ${guests}\nHabitación: ${room}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  });
}

/* ---------- Booking form ---------- */
const bookForm = document.getElementById("bookForm");
if (bookForm) {
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("b_name").value.trim();
    const phone = document.getElementById("b_phone").value.trim();
    const input = document.getElementById("b_in").value;
    const output = document.getElementById("b_out").value;
    const guests = document.getElementById("b_g").value;
    const room = document.getElementById("b_r").value;
    const notes = document.getElementById("b_notes").value.trim();

    if (!name || !phone || !input || !output) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const msg = `*Nueva reservación - Hotel Aztlán*\n\nNombre: ${name}\nTeléfono: ${phone}\nLlegada: ${input}\nSalida: ${output}\nHuéspedes: ${guests}\nHabitación: ${room}${
      notes ? "\nNotas: " + notes : ""
    }`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  });
}

/* ---------- Copiar dirección del hotel ---------- */
const copyAddressButton = document.getElementById("copyAddress");
if (copyAddressButton) {
  copyAddressButton.addEventListener("click", async () => {
    const address = copyAddressButton.dataset.address;
    const label = copyAddressButton.querySelector("span");
    const status = document.getElementById("copyAddressStatus");
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
        copied = true;
      } else {
        const field = document.createElement("textarea");
        field.value = address;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        copied = document.execCommand("copy");
        field.remove();
      }
    } catch (error) {
      copied = false;
    }
    label.textContent = copied ? "Dirección copiada" : "No se pudo copiar";
    status.textContent = copied ? "Dirección copiada al portapapeles." : "No se pudo copiar la dirección.";
    window.setTimeout(() => { label.textContent = "Copiar dirección"; }, 2200);
  });
}
/* ---------- Tarjetas del restaurante ---------- */
const restaurantCarousel = document.querySelector(".restaurant-carousel");
if (restaurantCarousel) {
  const restaurantCards = Array.from(restaurantCarousel.querySelectorAll(".restaurant-card"));
  const restaurantDots = restaurantCarousel.querySelector(".restaurant-dots");
  const restaurantStatus = restaurantCarousel.querySelector(".restaurant-status");
  const restaurantPrev = restaurantCarousel.querySelector(".restaurant-prev");
  const restaurantNext = restaurantCarousel.querySelector(".restaurant-next");
  let restaurantIndex = 0;

  restaurantCards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "restaurant-dot";
    dot.setAttribute("aria-label", `Mostrar tarjeta ${index + 1} de ${restaurantCards.length}`);
    dot.addEventListener("click", () => showRestaurantCard(index));
    restaurantDots.appendChild(dot);
  });

  function showRestaurantCard(index) {
    restaurantIndex = (index + restaurantCards.length) % restaurantCards.length;
    restaurantCards.forEach((card, cardIndex) => {
      card.classList.remove("is-active", "is-prev", "is-next");
      if (cardIndex === restaurantIndex) card.classList.add("is-active");
      else if (cardIndex === (restaurantIndex - 1 + restaurantCards.length) % restaurantCards.length) card.classList.add("is-prev");
      else if (cardIndex === (restaurantIndex + 1) % restaurantCards.length) card.classList.add("is-next");
    });
    restaurantDots.querySelectorAll(".restaurant-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === restaurantIndex);
      if (dotIndex === restaurantIndex) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    restaurantStatus.textContent = `Tarjeta ${restaurantIndex + 1} de ${restaurantCards.length}`;
    if (restaurantCards.length < 2) {
      restaurantPrev.hidden = true;
      restaurantNext.hidden = true;
      restaurantDots.hidden = true;
    }
  }

  restaurantPrev.addEventListener("click", () => showRestaurantCard(restaurantIndex - 1));
  restaurantNext.addEventListener("click", () => showRestaurantCard(restaurantIndex + 1));
  let restaurantTouchStart = 0;
  restaurantCarousel.addEventListener("touchstart", (event) => { restaurantTouchStart = event.changedTouches[0].screenX; }, { passive: true });
  restaurantCarousel.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].screenX - restaurantTouchStart;
    if (Math.abs(delta) > 45) showRestaurantCard(restaurantIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
  showRestaurantCard(0);
}
/* ---------- Lightbox de la galería ---------- */
const lb = document.getElementById("lb");
const lbImg = lb ? lb.querySelector("img") : null;
const historyPhoto = document.querySelector(".history-photo");
const historyPhotoImg = historyPhoto ? historyPhoto.querySelector("img") : null;
function openHistoryPhoto() {
  if (!lb || !lbImg || !historyPhotoImg) return;
  lbImg.src = historyPhotoImg.src;
  lbImg.alt = historyPhotoImg.alt;
  lb.classList.add("history-on", "on");
}
if (historyPhoto) {
  historyPhoto.addEventListener("click", openHistoryPhoto);
  historyPhoto.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openHistoryPhoto();
    }
  });
}
/* ---------- Galerías por área de instalaciones ---------- */
const installationViewer = document.getElementById("installationViewer");
const installationViewerImage = document.getElementById("installationViewerImage");
const installationViewerTitle = document.getElementById("installationViewerTitle");
const installationViewerCaption = document.getElementById("installationViewerCaption");
const installationThumbnails = document.getElementById("installationThumbnails");
const installationViewerClose = installationViewer?.querySelector(".installation-viewer-close");
const installationViewerPrev = installationViewer?.querySelector(".installation-viewer-prev");
const installationViewerNext = installationViewer?.querySelector(".installation-viewer-next");
let installationViewerOrigin = null;
let installationViewerImages = [];
let installationViewerIndex = 0;

function showInstallationImage(index) {
  if (!installationViewerImages.length) return;
  installationViewerIndex = (index + installationViewerImages.length) % installationViewerImages.length;
  const image = installationViewerImages[installationViewerIndex];
  installationViewerImage.src = image.currentSrc || image.src;
  installationViewerImage.alt = image.alt || installationViewerTitle.textContent || "Hotel Aztlán";
  installationViewerCaption.textContent = image.alt || installationViewerTitle.textContent || "";
  installationThumbnails.querySelectorAll(".installation-thumb").forEach((button, buttonIndex) => {
    const active = buttonIndex === installationViewerIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function openInstallationGallery(category) {
  if (!installationViewer) return;
  const cover = category.querySelector(":scope > img");
  if (!cover) return;
  installationViewerOrigin = category;
  installationViewerImages = [cover, ...category.querySelectorAll(".gallery-source img")];
  installationViewerIndex = 0;
  installationViewerTitle.textContent = category.dataset.title || "Instalaciones";
  installationThumbnails.replaceChildren();
  const hasMultipleImages = installationViewerImages.length > 1;
  installationViewerPrev.hidden = !hasMultipleImages;
  installationViewerNext.hidden = !hasMultipleImages;

  installationViewerImages.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "installation-thumb";
    button.setAttribute("aria-label", `Ver imagen ${index + 1} de ${category.dataset.title || "esta área"}`);
    button.setAttribute("aria-pressed", "false");
    const thumbnail = document.createElement("img");
    thumbnail.src = image.currentSrc || image.src;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    button.appendChild(thumbnail);
    button.addEventListener("click", () => showInstallationImage(index));
    installationThumbnails.appendChild(button);
  });

  showInstallationImage(0);
  if (!installationViewer.open) installationViewer.showModal();
}

document.querySelectorAll(".gallery-category").forEach((category) => {
  category.addEventListener("click", () => openInstallationGallery(category));
  category.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openInstallationGallery(category);
    }
  });
});
installationViewerClose?.addEventListener("click", () => installationViewer.close());
installationViewerPrev?.addEventListener("click", () => showInstallationImage(installationViewerIndex - 1));
installationViewerNext?.addEventListener("click", () => showInstallationImage(installationViewerIndex + 1));
installationViewer?.addEventListener("click", (event) => {
  if (event.target === installationViewer) installationViewer.close();
});
installationViewer?.addEventListener("close", () => installationViewerOrigin?.focus());
if (lb) {
  lb.addEventListener("click", () => {
    lb.classList.remove("on", "history-on");
    if (lbImg) lbImg.src = "";
  });
}
/* ---------- Reveal on scroll (rv class) ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        observer.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12 }
);
document
  .querySelectorAll("section .card, section .room, section .photo, section .near div, .mont div")
  .forEach((el) => {
    el.classList.add("rv");
    observer.observe(el);
  });























