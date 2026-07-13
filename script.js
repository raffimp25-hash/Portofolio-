/* ================================================================
   0. PAKSA SCROLL KE ATAS SAAT DIREfresh (Anti nyangkut di Memo's)
   ================================================================ */
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

/* ================================================================
   1. SAKELAR THEME (KLIK LOGO LANGSUNG GANTI MODE)
   ================================================================ */
const logoToggle = document.getElementById("logoToggle");
if (logoToggle) {
  const currentSavedTheme = localStorage.getItem("portfolio-theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentSavedTheme);

  logoToggle.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    let nextTheme = activeTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

/* ================================================================
   2. NAVBAR LOGIC & MOBILE MENU
   ================================================================ */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
  detectActiveSection();
});

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-item");

function detectActiveSection() {
  let currentSectionId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 160) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href") === `#${currentSectionId}`) {
      item.classList.add("active");
    }
  });
}

/* ================================================================
   3. API CUACA MALANG (REAL TIME)
   ================================================================ */
const WEATHER_API_KEY = "MASUKKAN_API_KEY_ANDA_DI_SINI";
const WEATHER_CITY = "Malang,ID";
const WEATHER_ICON_MAP = {
  "01": "☀️",
  "02": "⛅",
  "03": "☁️",
  "04": "☁️",
  "09": "🌧️",
  10: "🌦️",
  11: "⛈️",
  13: "❄️",
  50: "🌫️",
};

async function fetchMalangWeather() {
  const tempEl = document.getElementById("weatherTemp");
  const iconEl = document.getElementById("weatherIcon");

  const dbIconEl = document.getElementById("dbWeatherIcon");
  const dbStatusEl = document.getElementById("dbWeatherStatus");
  const dbTempEl = document.getElementById("dbWeatherTemp");
  const dbHumidityEl = document.getElementById("dbWeatherHumidity");
  const dbWindEl = document.getElementById("dbWeatherWind");
  const dbTimeEl = document.getElementById("dbWeatherTime");

  const now = new Date();
  const timeString = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (WEATHER_API_KEY === "MASUKKAN_API_KEY_ANDA_DI_SINI") {
    if (tempEl) tempEl.textContent = "27°C";
    if (iconEl) iconEl.textContent = "⛅";

    if (dbTempEl) dbTempEl.textContent = "27";
    if (dbIconEl) dbIconEl.textContent = "⛅";
    if (dbStatusEl) dbStatusEl.textContent = "Cerah Berawan";
    if (dbHumidityEl) dbHumidityEl.textContent = "74%";
    if (dbWindEl) dbWindEl.textContent = "12 km/h";
    if (dbTimeEl) dbTimeEl.textContent = timeString;
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(WEATHER_CITY)}&units=metric&lang=id&appid=${WEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil data cuaca");
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6);
    const statusText = data.weather[0].description;
    const iconCode = data.weather[0].icon.substring(0, 2);
    const chosenIcon = WEATHER_ICON_MAP[iconCode] || "⛅";

    if (tempEl) tempEl.textContent = `${temp}°C`;
    if (iconEl) iconEl.textContent = chosenIcon;

    if (dbTempEl) dbTempEl.textContent = temp;
    if (dbIconEl) dbIconEl.textContent = chosenIcon;
    if (dbStatusEl)
      dbStatusEl.textContent =
        statusText.charAt(0).toUpperCase() + statusText.slice(1);
    if (dbHumidityEl) dbHumidityEl.textContent = `${humidity}%`;
    if (dbWindEl) dbWindEl.textContent = `${windSpeed} km/h`;
    if (dbTimeEl) dbTimeEl.textContent = timeString;
  } catch (err) {
    console.error("Weather widget error:", err);
    if (tempEl) tempEl.textContent = "--°C";
    if (iconEl) iconEl.textContent = "⚠️";
    if (dbTempEl) dbTempEl.textContent = "--";
    if (dbStatusEl) dbStatusEl.textContent = "Gagal memuat data";
  }
}
fetchMalangWeather();
setInterval(fetchMalangWeather, 10 * 60 * 1000);

/* ================================================================
   4. EFEK KETIK (TYPING EFFECT)
   ================================================================ */
const TYPING_TEXTS = [
  "Frontend Developer.",
  "UI/UX Enthusiast.",
  "Pemecah masalah visual.",
  "Pembelajar seumur hidup.",
];
const typingEl = document.getElementById("typing-line");
let twIndex = 0,
  twChar = 0,
  twDeleting = false;

function typeLoop() {
  if (!typingEl) return;
  const current = TYPING_TEXTS[twIndex];
  if (!twDeleting) {
    twChar++;
    typingEl.textContent = current.substring(0, twChar);
    if (twChar === current.length) {
      twDeleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    twChar--;
    typingEl.textContent = current.substring(0, twChar);
    if (twChar === 0) {
      twDeleting = false;
      twIndex = (twIndex + 1) % TYPING_TEXTS.length;
    }
  }
  setTimeout(typeLoop, twDeleting ? 45 : 85);
}
typeLoop();

/* ================================================================
   5. SCROLL REVEAL (INI YANG BIKIN KONTEN MUNCUL!)
   ================================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // Hanya dijalankan 1 kali saat muncul
      }
    });
  },
  { threshold: 0.1 },
); // 0.1 artinya muncul saat 10% elemen terlihat di layar

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

/* ================================================================
   6. PROGRESS BAR ANIMASI
   ================================================================ */
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector(".progress-fill");
        if (fill) fill.style.width = fill.dataset.percent + "%";
        progressObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll(".progress-row")
  .forEach((el) => progressObserver.observe(el));

/* ================================================================
   7. TILT 3D EFFECT KARTU
   ================================================================ */
const tiltElements = document.querySelectorAll(
  ".timeline-card, .c-card, .weather-board-card",
);
tiltElements.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y / rect.height - 0.5) * -6;
    const rotateY = (x / rect.width - 0.5) * 6;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
  });
});

/* ================================================================
   8. MEMO'S STACKED GALLERY LOGIC
   ================================================================ */
const memoItems = document.querySelectorAll(".memo-item");
const memoPrev = document.getElementById("memoPrev");
const memoNext = document.getElementById("memoNext");
const memoCurrentDisplay = document.getElementById("memoCurrent");
let currentMemoIndex = 0;

if (memoItems.length > 0) {
  function updateMemoDisplay(index) {
    if (index < 0) {
      currentMemoIndex = memoItems.length - 1;
    } else if (index >= memoItems.length) {
      currentMemoIndex = 0;
    } else {
      currentMemoIndex = index;
    }

    memoItems.forEach((item) => item.classList.remove("active"));
    memoItems[currentMemoIndex].classList.add("active");
    if (memoCurrentDisplay)
      memoCurrentDisplay.textContent = currentMemoIndex + 1;
  }

  // INI YANG WAJIB DIGANTI 👇
  if (memoPrev) {
    memoPrev.addEventListener("click", (e) => {
      e.preventDefault();
      updateMemoDisplay(currentMemoIndex - 1);
    });
  }

  if (memoNext) {
    memoNext.addEventListener("click", (e) => {
      e.preventDefault();
      updateMemoDisplay(currentMemoIndex + 1);
    });
  }
}

/* ================================================================
   9. TAHUN OTOMATIS DI FOOTER
   ================================================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
