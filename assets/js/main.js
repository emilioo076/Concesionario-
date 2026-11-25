/* SOHO Automotriz — interacción del sitio */
(() => {
  "use strict";

  const INV = Array.isArray(window.INVENTARIO) ? window.INVENTARIO : [];
  const SOHO = Object.assign({ whatsapp: "524495526782" }, window.SOHO || {});

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat("es-MX");

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normalize = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const nombre = (a) => `${a.marca} ${a.modelo}`;
  const foto = (id, chica) => `assets/img/autos/${id}${chica ? "-sm" : ""}.jpg`;
  const spec = (a, etiqueta) => (a.specs || []).find(([k]) => k === etiqueta)?.[1];
  const waLink = (texto) => `https://wa.me/${SOHO.whatsapp}?text=${encodeURIComponent(texto)}`;

  const mensajeAuto = (texto) =>
    texto
      ? `Hola, SOHO Automotriz. Me interesa el ${texto}. ¿Sigue disponible?`
      : "Hola, SOHO Automotriz. Me gustaría recibir información sobre su inventario.";

  const descripcionAuto = (a) => [nombre(a), a.anio, a.color && `color ${a.color.toLowerCase()}`].filter(Boolean).join(" ");

  /* ---------- Enlaces de WhatsApp ---------- */
  $$(".js-wa").forEach((link) => {
    link.href = waLink(mensajeAuto(link.dataset.auto));
  });

  /* ---------- Encabezado ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Marca la sección actual en el menú
  const navLinks = $$(".nav__list a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["coleccion", "experiencia", "nosotros", "sucursales", "contacto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Menú móvil ---------- */
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.hidden = !open;
    document.body.classList.toggle("is-locked", open);
    document.body.classList.toggle("menu-open", open);
    if (open) header.classList.add("is-scrolled");
    else onScroll();
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 961px)").addEventListener?.("change", (e) => e.matches && setMenu(false));

  /* ---------- Hero ---------- */
  const hero = $(".hero");
  const slides = $$(".hero__slide");
  const dots = $$(".hero__dots button");
  const caption = $("#heroCaption");
  const SLIDE_MS = 7000;
  let current = 0;
  let timer = null;

  hero.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);

  const showSlide = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === current));
    dots.forEach((d, k) => {
      d.classList.remove("is-active");
      d.setAttribute("aria-selected", String(k === current));
    });
    void dots[current].offsetWidth; // reinicia la animación de la barra
    dots[current].classList.add("is-active");
    caption.classList.add("is-changing");
    setTimeout(() => {
      caption.textContent = slides[current].dataset.caption;
      caption.classList.remove("is-changing");
    }, 300);
  };
  const play = () => {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), SLIDE_MS);
  };
  dots.forEach((d, k) =>
    d.addEventListener("click", () => {
      showSlide(k);
      play();
    })
  );
  document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(timer) : play()));
  if (reduceMotion) hero.classList.add("is-paused");
  play();

  /* ---------- Contadores ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = num.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Animaciones de entrada ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    reveals.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 5) * 90}ms`;
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          cio.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      el.textContent = "0";
      cio.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Inventario ---------- */
  const grid = $("#carGrid");
  const count = $("#resultCount");
  const empty = $("#emptyState");
  const brandFilter = $("#brandFilter");
  const searchInput = $("#searchInput");
  const chips = $$(".chip");
  const formCar = $("#formCar");

  const ordenados = INV.map((a, i) => ({ a, i }))
    .sort((x, y) => Number(!!y.a.destacado) - Number(!!x.a.destacado) || x.i - y.i)
    .map(({ a }) => a);

  [...new Set(INV.map((a) => a.marca))]
    .sort((x, y) => x.localeCompare(y, "es"))
    .forEach((m) => brandFilter.add(new Option(m, m)));

  ordenados.forEach((a) => formCar.add(new Option(nombre(a) + (a.anio ? ` ${a.anio}` : ""), a.id)));

  const state = { cat: "todos", marca: "", q: "" };

  const precioHTML = (a) =>
    a.precio
      ? `<p class="card__price">Precio<strong>${mxn.format(a.precio)}</strong></p>`
      : `<p class="card__price">Precio a consultar</p>`;

  const cardHTML = (a, i) => {
    const meta = [a.anio, a.km != null ? `${num.format(a.km)} km` : null, spec(a, "Carrocería"), a.color].filter(
      (v) => v !== null && v !== undefined && v !== ""
    );
    const principal = (a.fotos && a.fotos[0]) || a.id;
    return `
      <li class="card" style="animation-delay:${Math.min(i, 8) * 55}ms">
        <div class="card__media">
          <img src="${foto(principal, true)}" srcset="${foto(principal, true)} 760w, ${foto(principal)} 1600w"
            sizes="(min-width: 1080px) 31vw, (min-width: 720px) 47vw, 100vw"
            alt="${esc(descripcionAuto(a))}" loading="lazy" decoding="async" width="760" height="570" />
          ${a.destacado ? '<span class="card__badge">Signature</span>' : ""}
        </div>
        <div class="card__body">
          <p class="card__brand">${esc(a.marca)}</p>
          <h3 class="card__title">${esc(a.modelo)}</h3>
          <ul class="card__meta">${meta.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
          <div class="card__foot">
            ${precioHTML(a)}
            <button class="card__open" type="button" data-id="${esc(a.id)}" aria-label="Ver ficha del ${esc(nombre(a))}">
              Ver ficha
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </li>`;
  };

  const render = () => {
    const q = normalize(state.q);
    const lista = ordenados.filter(
      (a) =>
        (state.cat === "todos" || a.categoria === state.cat) &&
        (!state.marca || a.marca === state.marca) &&
        (!q || normalize(`${a.marca} ${a.modelo} ${a.color} ${a.anio || ""}`).includes(q))
    );
    grid.innerHTML = lista.map(cardHTML).join("");
    empty.hidden = lista.length > 0;
    const n = lista.length;
    count.textContent = n ? `${n} ${n === 1 ? "unidad" : "unidades"} en exhibición` : "";
  };

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      state.cat = chip.dataset.cat;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      render();
    })
  );
  brandFilter.addEventListener("change", () => {
    state.marca = brandFilter.value;
    render();
  });
  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.q = searchInput.value;
      render();
    }, 140);
  });

  render();

  /* ---------- Ficha del vehículo ---------- */
  const modal = $("#carModal");
  const mImg = $("#modalImg");
  const mThumbs = $("#modalThumbs");
  let lastFocus = null;
  let modalCar = null;

  const setModalPhoto = (id, a) => {
    mImg.src = foto(id);
    mImg.alt = descripcionAuto(a);
    $$("button", mThumbs).forEach((b) => b.classList.toggle("is-active", b.dataset.foto === id));
  };

  const openCar = (id) => {
    const a = INV.find((x) => x.id === id);
    if (!a) return;
    modalCar = a;
    lastFocus = document.activeElement;
    const fotos = a.fotos && a.fotos.length ? a.fotos : [a.id];

    $("#modalBrand").textContent = a.marca;
    $("#modalTitle").textContent = a.modelo;
    $("#modalNote").textContent = a.nota || "";
    $("#modalPrice").innerHTML = `<small>Precio</small>${a.precio ? mxn.format(a.precio) : "A consultar"}`;

    const filas = [
      ["Año", a.anio],
      ["Kilometraje", a.km != null ? `${num.format(a.km)} km` : null],
      ["Color", a.color],
      ...(a.specs || []),
    ].filter(([, v]) => v !== null && v !== undefined && v !== "");
    $("#modalSpecs").innerHTML = filas.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

    mThumbs.innerHTML =
      fotos.length > 1
        ? fotos
            .map(
              (f, k) =>
                `<button type="button" data-foto="${esc(f)}" aria-label="Foto ${k + 1}"><img src="${foto(f, true)}" alt="" loading="lazy" /></button>`
            )
            .join("")
        : "";
    setModalPhoto(fotos[0], a);

    $("#modalWa").href = waLink(mensajeAuto(descripcionAuto(a)));

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.classList.add("is-locked");
    $("#modalClose").focus();
  };

  const closeModal = () => {
    if (typeof modal.close === "function") modal.close();
    else {
      modal.removeAttribute("open");
      modal.dispatchEvent(new Event("close"));
    }
  };

  modal.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); // clic en el fondo
  });
  $("#modalClose").addEventListener("click", closeModal);
  mThumbs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-foto]");
    if (b && modalCar) setModalPhoto(b.dataset.foto, modalCar);
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".card__open, .js-open-car");
    if (trigger) openCar(trigger.dataset.id);
  });

  $("#modalBook").addEventListener("click", () => {
    const a = modalCar;
    lastFocus = null;
    closeModal();
    if (a) formCar.value = a.id;
    $("#contacto").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(() => $("#leadForm input[name=nombre]").focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $("#leadForm");
  const formError = $("#formError");
  const dateInput = $("#formDate");
  const hoy = new Date();
  dateInput.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombreCliente = String(data.get("nombre") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const errores = [];

    form.nombre.classList.toggle("is-invalid", nombreCliente.length < 2);
    if (nombreCliente.length < 2) errores.push("tu nombre");
    const digitos = telefono.replace(/\D/g, "");
    form.telefono.classList.toggle("is-invalid", digitos.length < 10);
    if (digitos.length < 10) errores.push("un teléfono de 10 dígitos");

    if (errores.length) {
      formError.textContent = `Por favor escribe ${errores.join(" y ")}.`;
      formError.hidden = false;
      (nombreCliente.length < 2 ? form.nombre : form.telefono).focus();
      return;
    }
    formError.hidden = true;

    const auto = INV.find((a) => a.id === data.get("auto"));
    const fecha = data.get("fecha")
      ? new Date(`${data.get("fecha")}T12:00:00`).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
      : "Por confirmar";
    const mensaje = String(data.get("mensaje") || "").trim();

    const texto = [
      "Hola, SOHO Automotriz. Quisiera agendar una cita.",
      "",
      `• Nombre: ${nombreCliente}`,
      `• Teléfono: ${telefono}`,
      `• Auto de interés: ${auto ? descripcionAuto(auto) : "Aún no lo decido"}`,
      `• Sucursal: ${data.get("sucursal")}`,
      `• Fecha preferida: ${fecha}`,
      mensaje ? `• Mensaje: ${mensaje}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = waLink(texto);
    // Con "noopener" window.open siempre devuelve null, así que se corta el vínculo a mano.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  });

  ["nombre", "telefono"].forEach((n) =>
    form[n].addEventListener("input", () => {
      form[n].classList.remove("is-invalid");
    })
  );

  /* ---------- Pie ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
