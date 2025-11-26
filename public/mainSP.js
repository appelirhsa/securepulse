document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll('nav a[data-page]');
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("mainNav");
  const loginBtn = document.getElementById("loginBtn");

  /* ----------------------------------
     HIDE NAVBAR ON SCROLL
  ---------------------------------- */
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (current > lastScroll && current > 80) {
      // scrolling down
      navbar.classList.add("hidden");
    } else {
      // scrolling up
      navbar.classList.remove("hidden");
    }

    lastScroll = current <= 0 ? 0 : current;
  });

  /* ----------------------------------
     MOBILE MENU
  ---------------------------------- */
  mobileMenuBtn?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  /* ----------------------------------
     LOGIN BUTTON
  ---------------------------------- */
  loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Login coming soon! Redirecting to dashboard...");
    window.location.href = "dashboard.html";
  });

  /* ----------------------------------
     PAGE SWITCHING (SPA-LIKE)
  ---------------------------------- */
  const currentPage = location.hash.replace("#", "") || "home";

  navLinks.forEach(link => {
    const page = link.getAttribute("data-page");

    if (page === currentPage) link.classList.add("active");

    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-page");

      if (document.getElementById(target)) {
        e.preventDefault();

        document.querySelectorAll("main > section")
          .forEach(sec => (sec.style.display = "none"));

        document.getElementById(target).style.display = "block";

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        history.pushState(null, null, "#" + target);

        if (window.innerWidth <= 600) {
          navMenu.classList.remove("active");
        }
      }
    });
  });

  // Show correct section on load
  if (document.getElementById(currentPage)) {
    document.querySelectorAll("main > section")
      .forEach(sec => (sec.style.display = "none"));

    document.getElementById(currentPage).style.display = "block";
  }
});

