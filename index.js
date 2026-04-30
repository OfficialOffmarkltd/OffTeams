const DATA = {
    meetings: {
        minutes: [
        {
        title:     "Weekly Check In",
        date:      "Tuesday, April 28, 2026",
        attendees: ["Ikechukwu O.(CEO)", "Wilfrid O.(CTO)", "Perfect O.(CFO)", "Kyrian O.(COO)"],
        agenda: [
          "Pillar One Roadmap priorities",
          "Role Definition",
          "Genesis Design Approach",
          "Fashion Show for Hard Launch",
        ],
        decisions: [
          "Focus On particular clothing set for each series",
          "Fashion show and Platform Launch on hard launch",
          "Roadmap to be fleshed out by Wilfrid",
        ],
        actions: [
          "Wilfrid: Work with anyone to finalize offmark Roadmap ⏳",
          "Kyrian: Deliver the task management system ✅",
          "Tochi: Sales and Marketing research as applied to Offmark ⏳",
          "Perfect: Work with Ike to create a functional account for Offmark ⏳",
          "Ikechukwu: Tailor down the roles and draft how each position applies to Offmark ⏳",
        ],
        notes: "The N20k contributions from co-founders starts next month",
      },

    ],
    }
}


// ——— MEETINGS ———
function buildMeetings() {

  // Minutes
  document.getElementById("minutes-list").innerHTML = DATA.meetings.minutes.map((m, i) => `
    <div class="minute-item">
      <div class="mi-header" onclick="toggleMinute(${i})">
        <div class="mi-left">
          <div class="mi-title">${esc(m.title)}</div>
          <div class="mi-date">${esc(m.date)}</div>
        </div>
        <span class="mi-toggle" id="mi-toggle-${i}">▾</span>
      </div>
      <div class="mi-body" id="mi-body-${i}">
        <div class="mi-section-title">Attendees</div>
        <div class="mi-attendees">${m.attendees.map(esc).join(" &nbsp;·&nbsp; ")}</div>

        <div class="mi-section-title">Agenda</div>
        <ul class="mi-list">${m.agenda.map(a=>`<li>${esc(a)}</li>`).join("")}</ul>

        <div class="mi-section-title">Decisions</div>
        ${m.decisions.map(d=>`<div class="mi-decision">${esc(d)}</div>`).join("")}

        <div class="mi-section-title">Action items</div>
        ${m.actions.map(a=>`<div class="mi-action-item">${esc(a)}</div>`).join("")}

        ${m.notes ? `<div class="mi-section-title">Notes</div><p class="mi-text">${esc(m.notes)}</p>` : ""}
      </div>
    </div>`).join("");
}

function toggleMinute(i) {
  const body    = document.getElementById("mi-body-"+i);
  const toggle  = document.getElementById("mi-toggle-"+i);
  const isOpen  = body.classList.contains("open");
  body.classList.toggle("open", !isOpen);
  toggle.classList.toggle("open", !isOpen);
}


/* =============================================================
   CONFIG — change password here
============================================================= */
const CONFIG = {
  password: "offmark2026",       // ← change this in your editor
  inactivityMinutes: 15,         // lock after N minutes of inactivity
};

/* =============================================================
   SESSION KEY — persists unlock state across refreshes
   but clears when tab is closed (sessionStorage behavior)
============================================================= */
const SESSION_KEY = "offmark_unlocked";

/* =============================================================
   LOCK / UNLOCK LOGIC
============================================================= */
let inactivityTimer = null;

function isUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function unlock() {
  sessionStorage.setItem(SESSION_KEY, "true");
  document.getElementById("lock-screen").classList.add("hidden");
  resetInactivityTimer();
  bindActivityListeners();
}

function lockPlatform(reason) {
  sessionStorage.removeItem(SESSION_KEY);
  const lockEl = document.getElementById("lock-screen");
  lockEl.classList.remove("hidden");
  const reasonEl = document.getElementById("lock-reason");
  if (reason === "inactivity") {
    reasonEl.textContent = "Platform locked due to 15 minutes of inactivity.";
  } else {
    reasonEl.textContent = "";
  }
  clearTimeout(inactivityTimer);
}

function tryUnlock() {
  const input = document.getElementById("pw-input");
  const error = document.getElementById("pw-error");
  if (input.value === CONFIG.password) {
    input.value = "";
    input.classList.remove("error");
    error.classList.remove("show");
    unlock();
  } else {
    input.classList.add("error");
    error.classList.add("show");
    input.value = "";
    input.focus();
  }
}

function togglePw() {
  const inp = document.getElementById("pw-input");
  inp.type = inp.type === "password" ? "text" : "password";
}

document.getElementById("pw-input").addEventListener("keydown", e => {
  if (e.key === "Enter") tryUnlock();
});

/* =============================================================
   INACTIVITY TIMER
============================================================= */
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    lockPlatform("inactivity");
  }, CONFIG.inactivityMinutes * 60 * 1000);
}

function bindActivityListeners() {
  ["mousemove","keydown","click","scroll","touchstart"].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
}

/* =============================================================
   INIT — check session on load
============================================================= */
window.addEventListener("load", () => {
  updateTopbarDate();
  buildCalendar();
  buildMeetings();
  if (isUnlocked()) {
    document.getElementById("lock-screen").classList.add("hidden");
    resetInactivityTimer();
    bindActivityListeners();
  }
});

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
} // very important

/* =============================================================
   NAVIGATION
============================================================= */
const topbarMeta = {
  meetings: { title: "Meetings", sub: "Schedule & minutes" },
  calendar:  { title: "Calendar", sub: "Events & scheduled milestones" },
  archive:   { title: "Archive", sub: "Company documents & files" },
  profile:   { title: "Profile", sub: "Company  profiles" },
  deliverables:{title: "Deliverables", sub: "Team Tasks"},
};

function navigate(pageId, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("page-" + pageId).classList.add("active");
  if (btn) btn.classList.add("active");
  const meta = topbarMeta[pageId] || {};
  document.getElementById("topbar-title").textContent = meta.title || pageId;
  document.getElementById("topbar-sub").textContent = meta.sub || "";
  
}
function handleSidebarCollapse() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  
  if (window.innerWidth <= 900 && !sidebar.classList.contains("collapsed")) {
    sidebar.classList.add("collapsed");
  } else if (window.innerWidth > 900 && sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
  }
}
// Run on load
document.addEventListener("DOMContentLoaded", handleSidebarCollapse);
// Run on resize
window.addEventListener("resize", handleSidebarCollapse);


/* =============================================================
   SIDEBAR TOGGLE
============================================================= */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

/* =============================================================
   TOPBAR DATE
============================================================= */
function updateTopbarDate() {
  const now = new Date();
  document.getElementById("topbar-date").textContent = now.toLocaleDateString("en-NG", {
    weekday: "short", year: "numeric", month: "short", day: "numeric"
  });
}

/* =============================================================
   ARCHIVE SEARCH FILTER
============================================================= */
function filterArchive() {
  const q = document.getElementById("archive-search").value.toLowerCase();
  const files = document.querySelectorAll("#files-list .archive-file");
  let visible = 0;
  files.forEach(f => {
    const name = f.getAttribute("data-filename") || "";
    const match = !q || name.toLowerCase().includes(q) || f.textContent.toLowerCase().includes(q);
    f.style.display = match ? "" : "none";
    if (match) visible++;
  });
  document.getElementById("file-count-tag").textContent = visible + " file" + (visible !== 1 ? "s" : "");
}

/* =============================================================
   CALENDAR
============================================================= */
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-indexed

/* 
  CALENDAR EVENT DATA — add events as objects with:
  { year, month (1-12), day, label, type: 'event'|'meeting'|'deadline' }
*/
const CALENDAR_EVENTS = [
  { year: 2026, month: 4,  day: 29, label: "Investor Sync",    type: "meeting"  },
  { year: 2026, month: 5,  day: 1,  label: "Workers' Day",     type: "event"    },
  { year: 2026, month: 5,  day: 6,  label: "Demo Day",         type: "meeting"  },
  { year: 2026, month: 5,  day: 14, label: "Beta Launch",      type: "event"    },
  { year: 2026, month: 5,  day: 20, label: "Board Review",     type: "deadline" },
  { year: 2026, month: 6,  day: 3,  label: "Team Offsite",     type: "event"    },
];

function buildCalendar() {
  const grid = document.getElementById("cal-grid");
  const label = document.getElementById("cal-month-label");
  const today = new Date();

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay  = new Date(calYear, calMonth + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun

  label.textContent = firstDay.toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  const headers = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let html = headers.map(d => `<div class="cal-day-header">${d}</div>`).join("");

  // leading blanks
  for (let i = 0; i < startDow; i++) {
    html += `<div class="cal-day other-month"></div>`;
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    const evts = CALENDAR_EVENTS.filter(e => e.year === calYear && e.month === calMonth + 1 && e.day === d);
    const evtHtml = evts.map(e => `<div class="cal-event type-${e.type}">${e.label}</div>`).join("");
    html += `<div class="cal-day${isToday ? " today" : ""}"><div class="cal-day-num">${d}</div>${evtHtml}</div>`;
  }

  // trailing blanks
  const endDow = lastDay.getDay();
  for (let i = endDow + 1; i < 7; i++) {
    html += `<div class="cal-day other-month"></div>`;
  }

  grid.innerHTML = html;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  buildCalendar();
}