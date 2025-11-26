// API Client
const api = new SecurePulseAPI();

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll('nav a[data-page]');
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("mainNav");
  const loginBtn = document.getElementById("loginBtn");

  // Check if user is already logged in
  const token = localStorage.getItem('authToken');
  if (token) {
    loginBtn.textContent = 'Dashboard';
    loginBtn.onclick = () => window.location.href = 'dashboard.html';
  }

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
    if (token) {
      window.location.href = 'dashboard.html';
    } else {
      showAuthModal();
    }
  });

  // Add plan button listeners
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!token) {
        showAuthModal();
      } else {
        window.location.href = 'dashboard.html';
      }
    });
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

/* ----------------------------------
   AUTH MODAL
---------------------------------- */
function showAuthModal() {
  const modal = document.getElementById('authModal') || createAuthModal();
  modal.style.display = 'flex';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

function hideAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
}

function createAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 40px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
      <div style="display: flex; gap: 10px; margin-bottom: 30px;">
        <button onclick="switchAuthForm('login')" id="loginTab" class="auth-tab active" style="flex: 1; padding: 12px; border: none; background: #0066cc; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">Login</button>
        <button onclick="switchAuthForm('register')" id="registerTab" class="auth-tab" style="flex: 1; padding: 12px; border: none; background: #e0e0e0; color: #333; border-radius: 6px; cursor: pointer; font-weight: 600;">Register</button>
      </div>

      <form id="loginForm" onsubmit="handleLogin(event)">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
          <input type="email" id="loginEmail" placeholder="your@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1em; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Password</label>
          <input type="password" id="loginPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1em; box-sizing: border-box;">
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1em;">Login</button>
        <p id="loginError" style="color: #d32f2f; margin-top: 10px; font-size: 0.9em;"></p>
      </form>

      <form id="registerForm" onsubmit="handleRegister(event)" style="display: none;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Full Name</label>
          <input type="text" id="registerName" placeholder="Your name" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1em; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
          <input type="email" id="registerEmail" placeholder="your@email.com" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1em; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Password</label>
          <input type="password" id="registerPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1em; box-sizing: border-box;">
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1em;">Create Account</button>
        <p id="registerError" style="color: #d32f2f; margin-top: 10px; font-size: 0.9em;"></p>
      </form>

      <button onclick="hideAuthModal()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5em; cursor: pointer; color: #666;">×</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideAuthModal();
  });

  return modal;
}

function switchAuthForm(form) {
  document.getElementById('loginForm').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = form === 'register' ? 'block' : 'none';
  
  document.getElementById('loginTab').style.background = form === 'login' ? '#0066cc' : '#e0e0e0';
  document.getElementById('loginTab').style.color = form === 'login' ? 'white' : '#333';
  document.getElementById('registerTab').style.background = form === 'register' ? '#0066cc' : '#e0e0e0';
  document.getElementById('registerTab').style.color = form === 'register' ? 'white' : '#333';
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  try {
    errorEl.textContent = '';
    const response = await api.login(email, password);
    hideAuthModal();
    window.location.href = 'dashboard.html';
  } catch (error) {
    errorEl.textContent = 'Invalid email or password';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const errorEl = document.getElementById('registerError');

  try {
    errorEl.textContent = '';
    const response = await api.register(name, email, password);
    
    // Auto login after registration
    await api.login(email, password);
    hideAuthModal();
    window.location.href = 'dashboard.html';
  } catch (error) {
    errorEl.textContent = 'Registration failed. Email may already be in use.';
  }
}

