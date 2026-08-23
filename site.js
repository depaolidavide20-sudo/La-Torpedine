(() => {
  const languageButtons = document.querySelectorAll("[data-lang-button]");
  const bookingModal = document.querySelector("[data-booking-modal]");
  const menuModal = document.querySelector("[data-menu-modal]");
  const modal = document.querySelector("[data-booking-modal]");
  const openButtons = document.querySelectorAll("[data-booking-open]");
  const closeButtons = document.querySelectorAll("[data-booking-close]");
  const form = document.querySelector("[data-booking-form]");
  const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
  const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

  const setPageLocked = () => {
    const anyOpen = [bookingModal, menuModal].some((target) => target && !target.hidden);
    document.body.classList.toggle("booking-is-open", anyOpen);
  };

  const applyLanguage = (language) => {
    const nextLanguage = language === "en" ? "en" : "it";
    document.documentElement.lang = nextLanguage;

    document.querySelectorAll("[data-it][data-en]").forEach((node) => {
      const value = nextLanguage === "en" ? node.getAttribute("data-en") : node.getAttribute("data-it");
      if (value) {
        node.innerHTML = value;
      }
    });

    document.querySelectorAll("[data-placeholder-it][data-placeholder-en]").forEach((node) => {
      const value =
        nextLanguage === "en"
          ? node.getAttribute("data-placeholder-en")
          : node.getAttribute("data-placeholder-it");
      if (value && "placeholder" in node) {
        node.placeholder = value;
      }
    });

    languageButtons.forEach((button) => {
      const isActive = button.getAttribute("data-lang-button") === nextLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.torpedineCurrentLanguage = nextLanguage;
    window.torpedineApplyLanguage = applyLanguage;
    window.localStorage.setItem("torpedine-language", nextLanguage);
  };

  const initialLanguage = window.localStorage.getItem("torpedine-language") === "en" ? "en" : "it";
  applyLanguage(initialLanguage);
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-lang-button")));
  });

  if (!modal || !form) {
    return;
  }

  const openPanel = (target, focusSelector = "input, button") => {
    if (!target) {
      return;
    }
    target.hidden = false;
    setPageLocked();
    applyLanguage(window.torpedineCurrentLanguage);
    const firstInput = target.querySelector(focusSelector);
    if (firstInput) {
      firstInput.focus({ preventScroll: true });
    }
  };

  const closePanel = (target) => {
    if (!target) {
      return;
    }
    target.hidden = true;
    setPageLocked();
  };

  openButtons.forEach((button) => button.addEventListener("click", () => openPanel(modal)));
  closeButtons.forEach((button) => button.addEventListener("click", () => closePanel(modal)));
  menuOpenButtons.forEach((button) =>
    button.addEventListener("click", () => openPanel(menuModal, "button")),
  );
  menuCloseButtons.forEach((button) =>
    button.addEventListener("click", () => closePanel(menuModal)),
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel(modal);
      closePanel(menuModal);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const getValue = (key) => String(formData.get(key) || "").trim();
    const note = getValue("notes");
    const messageLines = [
      "Ciao Osteria La Torpedine, vorrei prenotare un tavolo.",
      "Nome: " + getValue("name"),
      "Telefono: " + getValue("phone"),
      "Data: " + getValue("date"),
      "Orario: " + getValue("time"),
      "Persone: " + getValue("guests"),
    ];

    if (note) {
      messageLines.push("Note: " + note);
    }

    window.open(
      "https://wa.me/393534832176?text=" + encodeURIComponent(messageLines.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
    closePanel(modal);
  });
})();