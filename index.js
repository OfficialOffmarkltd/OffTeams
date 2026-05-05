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
          "Wilfrid: Work with anyone to finalize offmark Roadmap ",
          "Kyrian: Deliver the task management system ",
          "Tochi: Sales and Marketing research as applied to Offmark ",
          "Perfect: Work with Ike to create a functional account for Offmark ",
          "Ikechukwu: Tailor down the roles and draft how each position applies to Offmark ",
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

 //  NAVIGATION
const topbarMeta = {
  meetings: { title: "Meetings", sub: "Schedule & minutes" },
  calendar:  { title: "Calendar", sub: "Events" },
  archive:   { title: "Archive", sub: "" },
  profile:   { title: "Profile", sub: "" },
  deliverables:   {title: "Tasks", sub: ""},
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
  { year: 2026, month: 4,  day: 30, label: "GD",    type: "meeting"  },
  { year: 2026, month: 5,  day: 1,  label: "RFD",     type: "Meeting"    },
  // { year: 2026, month: 5,  day: 6,  label: "",         type: "meeting"  },
  // { year: 2026, month: 5,  day: 14, label: "",      type: "event"    },
  // { year: 2026, month: 5,  day: 20, label: "",     type: "deadline" },
  // { year: 2026, month: 6,  day: 3,  label: "",     type: "event"    },
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



const FOUNDERS = [
  {id:"ike", name:"Ike",    initials:"OI", color:"#6366f1", bg:"#eef2ff"},
  {id:"kiki",name:"Kyrian",   initials:"OK", color:"#0891b2", bg:"#ecfeff"},
  {id:"perfect",name:"Perfect", initials:"OP", color:"#059669", bg:"#ecfdf5"},
  {id:"kamsi",name:"Wilfrid",   initials:"OW", color:"#d97706", bg:"#fffbeb"},
  {id:"tochi",name:"Somtochi", initials:"US", color:"#dc2626", bg:"#fef2f2"},
];

const TASKS = [
  {id:1, name:"Deliver the task management system",        owner:"kiki",   tag:"dev",  done:true},
  {id:2, name:"Perform Sales and Marketing research, and how it applies to Offmark",      owner:"tochi", tag:"research/strategy",        done:false},
  {id:3, name:"Work with anyone to provide actionable steps from the roadmap",        owner:"kamsi",  tag:"design",    done:true},
  {id:4, name:"Create Offmark Bank account with Ike",      owner:"perfect",  tag:"finance",   done:true},
  // {id:5, name:"Tailor down Offmark Co-founder roles ",    owner:"ike",  tag:"strategy",     done:false},
  {id:6, name:"Draft Co-founder Roles definition as pertaining to Offmark",      owner:"ike", tag:"strategy",        done:true},
  // {id:7, name:"Register company with CAC",       owner:"chidi", tag:"legal",      done:false},
  // {id:8, name:"Create pitch deck v1",            owner:"kemi",  tag:"funding",    done:false},
  // {id:9, name:"Write technical architecture doc",owner:"tunde", tag:"dev",        done:false},
  // {id:10,name:"Map out go-to-market plan",       owner:"ade",   tag:"strategy",   done:false},
  // {id:11,name:"Draft IP assignment agreements",  owner:"chidi", tag:"legal",      done:false},
  // {id:12,name:"Set up analytics & error tracking",owner:"ade",  tag:"dev",        done:false},
  // {id:13,name:"Launch landing page",             owner:"bisi",  tag:"design",     done:false},
  // {id:14,name:"Open business bank account",      owner:"chidi", tag:"legal",      done:false},
  // {id:15,name:"Identify first 50 beta users",   owner:"kemi",  tag:"growth",     done:false},
];

const SECTIONS = [
  {label:"Completed",  filter: t => t.done},
  {label:"In progress",filter: t => !t.done},
];

const founderMap = Object.fromEntries(FOUNDERS.map(f=>[f.id,f]));

function checkSVG(){
  return `<svg class="check-icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="1.5,5.5 4,8 8.5,2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderCard(task){
  const f = founderMap[task.owner];
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const avatarStyle = isDark
    ? `background:${f.color}22;color:${f.color}`
    : `background:${f.bg};color:${f.color}`;
  return `
  <div class="task-card${task.done?' done':''}" data-id="${task.id}">
    <div class="task-top">
      <div class="task-check">${checkSVG()}</div>
      <span class="task-name">${task.name}</span>
    </div>
    <div class="task-footer">
      <div class="owner-pill">
        <div class="avatar" style="${avatarStyle}">${f.initials}</div>
        <span class="owner-name">${f.name}</span>
      </div>
      <span class="task-tag">${task.tag}</span>
    </div>
  </div>`;
}

function renderLegend(){
  const el = document.getElementById('legend');
  el.innerHTML = FOUNDERS.map(f=>`
    <div class="legend-item">
      <div class="legend-dot" style="background:${f.color}"></div>
      <span>${f.name}</span>
    </div>`).join('');
}

function renderStats(){
  const total = TASKS.length;
  const done = TASKS.filter(t=>t.done).length;
  const pct = Math.round(done/total*100);
  const byOwner = {};
  TASKS.filter(t=>!t.done).forEach(t=>{byOwner[t.owner]=(byOwner[t.owner]||0)+1});
  const busiest = FOUNDERS.reduce((a,f)=>((byOwner[f.id]||0)>(byOwner[a]||0)?f.id:a), FOUNDERS[0].id);
  document.getElementById('prog-bar').style.width = pct+'%';
  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card"><div class="stat-label">Total</div><div class="stat-val">${total}</div></div>
    <div class="stat-card"><div class="stat-label">Done</div><div class="stat-val">${done}</div></div>
    <div class="stat-card"><div class="stat-label">Remaining</div><div class="stat-val">${total-done}</div></div>
    <div class="stat-card"><div class="stat-label">Complete</div><div class="stat-val">${pct}%</div></div>`;
}

function renderSections(){
  const container = document.getElementById('sections-container');
  container.innerHTML = SECTIONS.map(s=>{
    const tasks = TASKS.filter(s.filter);
    if(!tasks.length) return '';
    return `<div class="section">
      <div class="section-label">${s.label} · ${tasks.length}</div>
      <div class="task-grid">${tasks.map(renderCard).join('')}</div>
    </div>`;
  }).join('');
}

function render(){
  renderLegend();
  renderStats();
  renderSections();
}

render();
