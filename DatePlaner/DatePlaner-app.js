import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { firebaseConfig } from "./DatePlaner-firebase-config.js";

const dateTypes = [
  "Movie Night",
  "Essen gehen",
  "Gemeinsam kochen",
  "Gym",
  "Naturspaziergang",
  "Schwimmen",
  "Therme",
  "Picknick",
  "Museum",
  "Kaffee & Kuchen",
  "Sternenhimmel",
  "Brettspiele",
  "Konzert",
  "Brunch",
  "Roadtrip mini",
  "Wellness zuhause"
];

const savedLoginKey = "date-planner-login";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const state = {
  userName: "",
  roomName: "",
  roomKey: "",
  roomRef: null,
  data: {
    availability: [],
    ideas: [],
    places: []
  },
  selectedPlace: null,
  unsubscribe: null,
  currentMonth: new Date()
};

const els = {
  loginView: document.querySelector("#loginView"),
  plannerView: document.querySelector("#plannerView"),
  loginForm: document.querySelector("#loginForm"),
  userName: document.querySelector("#userName"),
  roomName: document.querySelector("#roomName"),
  roomPassword: document.querySelector("#roomPassword"),
  modeHint: document.querySelector("#modeHint"),
  roomLabel: document.querySelector("#roomLabel"),
  syncBadge: document.querySelector("#syncBadge"),
  logoutButton: document.querySelector("#logoutButton"),
  availabilityForm: document.querySelector("#availabilityForm"),
  dateInput: document.querySelector("#dateInput"),
  startInput: document.querySelector("#startInput"),
  endInput: document.querySelector("#endInput"),
  moodInput: document.querySelector("#moodInput"),
  noteInput: document.querySelector("#noteInput"),
  availabilityList: document.querySelector("#availabilityList"),
  matchCalendar: document.querySelector("#matchCalendar"),
  matchList: document.querySelector("#matchList"),
  monthLabel: document.querySelector("#monthLabel"),
  prevMonthButton: document.querySelector("#prevMonthButton"),
  nextMonthButton: document.querySelector("#nextMonthButton"),
  deletePastButton: document.querySelector("#deletePastButton"),
  dateIdeaForm: document.querySelector("#dateIdeaForm"),
  typeInput: document.querySelector("#typeInput"),
  datePlanDateInput: document.querySelector("#datePlanDateInput"),
  datePlanStartInput: document.querySelector("#datePlanStartInput"),
  datePlanEndInput: document.querySelector("#datePlanEndInput"),
  matchSuggestionList: document.querySelector("#matchSuggestionList"),
  placeInput: document.querySelector("#placeInput"),
  mapsSearchButton: document.querySelector("#mapsSearchButton"),
  mapPreview: document.querySelector("#mapPreview"),
  detailsInput: document.querySelector("#detailsInput"),
  favoritePlaces: document.querySelector("#favoritePlaces"),
  saveFavoriteButton: document.querySelector("#saveFavoriteButton"),
  ideaList: document.querySelector("#ideaList"),
  placeList: document.querySelector("#placeList")
};

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayIso() {
  return localDateKey(new Date());
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function minutes(value) {
  const [hours, mins] = String(value || "00:00").split(":").map(Number);
  return (hours * 60) + mins;
}

function timeFromMinutes(value) {
  const hours = Math.floor(value / 60).toString().padStart(2, "0");
  const mins = (value % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}

function mapsEmbedUrl(place) {
  return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
}

function normalizePlace(place) {
  if (typeof place === "string") {
    return { id: uid(), name: place, userName: "Unbekannt", createdAt: todayIso(), mapsUrl: mapsUrl(place) };
  }
  return {
    id: place.id || uid(),
    name: place.name || place.address || "Ort ohne Namen",
    address: place.address || "",
    mapsUrl: place.mapsUrl || mapsUrl(place.name || place.address || ""),
    userName: place.userName || "Unbekannt",
    createdAt: place.createdAt || todayIso()
  };
}

function normalizeIdea(idea) {
  return {
    ...idea,
    status: idea.status || "open",
    statusBy: idea.statusBy || "",
    statusAt: idea.statusAt || ""
  };
}

function normalizeData(data) {
  return {
    availability: Array.isArray(data?.availability) ? data.availability : [],
    ideas: Array.isArray(data?.ideas) ? data.ideas.map(normalizeIdea) : [],
    places: Array.isArray(data?.places) ? data.places.map(normalizePlace) : []
  };
}

function statusLabel(status) {
  if (status === "accepted") return "Angenommen";
  if (status === "rejected") return "Abgelehnt";
  return "Offen";
}

function statusClass(status) {
  if (status === "accepted") return "status-accepted";
  if (status === "rejected") return "status-rejected";
  return "status-open";
}

function acceptedDateEntries() {
  return state.data.ideas
    .filter((idea) => idea.status === "accepted" && idea.date && idea.start && idea.end)
    .map((idea) => ({
      id: `accepted-${idea.id}`,
      ideaId: idea.id,
      kind: "accepted-date",
      date: idea.date,
      start: idea.start,
      end: idea.end,
      userName: "Fixes Date",
      mood: idea.type,
      note: [idea.place, idea.details].filter(Boolean).join(" · ")
    }));
}

function currentPlacePayload() {
  const typedName = els.placeInput.value.trim();
  if (state.selectedPlace && state.selectedPlace.name === typedName) return state.selectedPlace;
  if (!typedName) return null;
  return { name: typedName, address: "", mapsUrl: mapsUrl(typedName) };
}

function saveLogin() {
  localStorage.setItem(savedLoginKey, JSON.stringify({
    userName: state.userName,
    roomName: state.roomName,
    roomKey: state.roomKey
  }));
}

function getSavedLogin() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedLoginKey) || "null");
    if (!saved?.userName || !saved?.roomName || !saved?.roomKey) return null;
    return saved;
  } catch {
    return null;
  }
}

function clearSavedLogin() {
  localStorage.removeItem(savedLoginKey);
}

function setView(isLoggedIn) {
  els.loginView.classList.toggle("is-hidden", isLoggedIn);
  els.plannerView.classList.toggle("is-hidden", !isLoggedIn);
}

async function ensureRoom() {
  await signInAnonymously(auth);
  state.roomRef = doc(db, "datePlannerRooms", state.roomKey);
  const snap = await getDoc(state.roomRef);
  if (!snap.exists()) {
    await setDoc(state.roomRef, {
      availability: [],
      ideas: [],
      places: [],
      updatedAt: serverTimestamp()
    });
    return { availability: [], ideas: [], places: [] };
  }
  return normalizeData(snap.data());
}

async function persist(patch) {
  state.data = normalizeData({ ...state.data, ...patch });
  render();
  await setDoc(state.roomRef, {
    ...state.data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function cleanupPastData(silent = true) {
  const today = todayIso();
  const upcoming = state.data.availability.filter((item) => !item.date || item.date >= today);
  const removed = state.data.availability.length - upcoming.length;
  if (!removed) {
    if (!silent) setStatus("Keine vergangenen Zeiten zum Löschen gefunden.");
    return;
  }
  await persist({ availability: upcoming });
  if (!silent) setStatus(`${removed} vergangene Einträge gelöscht.`);
}

function setStatus(message) {
  els.modeHint.textContent = message;
}

async function openPlanner({ userName, roomName, roomKey }) {
  state.userName = userName.trim();
  state.roomName = roomName.trim();
  state.roomKey = roomKey;
  setStatus("Verbinde mit Firebase...");

  state.data = await ensureRoom();
  await cleanupPastData(true);

  if (state.unsubscribe) state.unsubscribe();
  state.unsubscribe = onSnapshot(state.roomRef, (snap) => {
    if (!snap.exists()) return;
    state.data = normalizeData(snap.data());
    render();
  });

  saveLogin();
  els.roomLabel.textContent = `${state.roomName} · ${state.userName}`;
  els.syncBadge.textContent = "Firebase live";
  setStatus("");
  setView(true);
  render();
}

function render() {
  renderAvailability();
  renderMatchCalendar();
  renderMatches();
  renderDateMatchSuggestions();
  renderIdeas();
  renderPlaces();
}

function computeMatches() {
  const byDate = state.data.availability.reduce((groups, item) => {
    if (!item.date || !item.start || !item.end) return groups;
    groups[item.date] = groups[item.date] || [];
    groups[item.date].push(item);
    return groups;
  }, {});

  const matches = [];
  Object.entries(byDate).forEach(([date, items]) => {
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const first = items[i];
        const second = items[j];
        if (first.userName === second.userName) continue;
        const start = Math.max(minutes(first.start), minutes(second.start));
        const end = Math.min(minutes(first.end), minutes(second.end));
        if (start < end) {
          matches.push({
            id: `${first.id}-${second.id}`,
            date,
            start: timeFromMinutes(start),
            end: timeFromMinutes(end),
            people: [...new Set([first.userName, second.userName])],
            moods: [first.mood, second.mood].filter(Boolean)
          });
        }
      }
    }
  });

  return matches.sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
}

function matchesByDate() {
  return computeMatches().reduce((groups, match) => {
    groups[match.date] = groups[match.date] || [];
    groups[match.date].push(match);
    return groups;
  }, {});
}

function acceptedDatesByDate() {
  return acceptedDateEntries().reduce((groups, item) => {
    groups[item.date] = groups[item.date] || [];
    groups[item.date].push(item);
    return groups;
  }, {});
}

function renderMatchCalendar() {
  const matches = matchesByDate();
  const acceptedDates = acceptedDatesByDate();
  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();
  const monthName = state.currentMonth.toLocaleDateString("de-AT", { month: "long", year: "numeric" });
  els.monthLabel.textContent = monthName;

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const cells = [];

  weekdays.forEach((day) => cells.push(`<div class="calendar-weekday">${day}</div>`));

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);
    const key = localDateKey(cellDate);
    const dayMatches = matches[key] || [];
    const dayAcceptedDates = acceptedDates[key] || [];
    const isCurrentMonth = cellDate.getMonth() === month;
    const isToday = key === todayIso();
    const label = dayMatches.length
      ? `<span class="calendar-dot">${dayMatches.length}</span>`
      : dayAcceptedDates.length
        ? `<span class="calendar-dot plan-dot">✓</span>`
        : "";

    cells.push(`
      <button class="calendar-day ${isCurrentMonth ? "" : "is-muted"} ${isToday ? "is-today" : ""} ${dayMatches.length ? "has-match" : ""} ${dayAcceptedDates.length ? "has-plan" : ""}"
        type="button"
        data-action="select-calendar-day"
        data-date="${key}">
        <span>${cellDate.getDate()}</span>
        ${label}
      </button>
    `);
  }

  els.matchCalendar.innerHTML = cells.join("");
}

function renderMatches(filterDate = "") {
  const today = todayIso();
  const matches = computeMatches().filter((item) => item.date >= today && (!filterDate || item.date === filterDate));

  if (!matches.length) {
    els.matchList.innerHTML = `<div class="empty-state">Noch keine Überschneidungen. Sobald beide Zeiten am selben Tag eintragen, erscheint hier der gemeinsame Slot.</div>`;
    return;
  }

  els.matchList.innerHTML = matches.map((match) => `
    <article class="item match-item">
      <div class="item-main">
        <div>
          <p class="item-title">${escapeHtml(match.date)} · ${escapeHtml(match.start)}-${escapeHtml(match.end)}</p>
          <p class="item-meta">${escapeHtml(match.people.join(" & "))}</p>
        </div>
        <span class="tag match-tag">Match</span>
      </div>
      ${match.moods.length ? `<p class="item-note">Stimmung: ${escapeHtml(match.moods.join(" / "))}</p>` : ""}
    </article>
  `).join("");
}

function renderDateMatchSuggestions() {
  const selectedDate = els.datePlanDateInput.value;
  const today = todayIso();
  const matches = computeMatches().filter((match) => match.date >= today && (!selectedDate || match.date === selectedDate));

  if (!matches.length) {
    els.matchSuggestionList.innerHTML = `<div class="suggestion-empty">Keine Überschneidung für diesen Tag.</div>`;
    return;
  }

  els.matchSuggestionList.innerHTML = matches.map((match) => `
    <button class="slot-suggestion" type="button" data-action="use-match-slot" data-date="${escapeHtml(match.date)}" data-start="${escapeHtml(match.start)}" data-end="${escapeHtml(match.end)}">
      <strong>${escapeHtml(match.date)} · ${escapeHtml(match.start)}-${escapeHtml(match.end)}</strong>
      <span>${escapeHtml(match.people.join(" & "))}</span>
    </button>
  `).join("");
}
function renderAvailability() {
  const today = todayIso();
  const items = [...state.data.availability, ...acceptedDateEntries()]
    .filter((item) => !item.date || item.date >= today)
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));

  if (!items.length) {
    els.availabilityList.innerHTML = `<div class="empty-state">Noch keine zukünftigen Zeiten eingetragen.</div>`;
    return;
  }

  els.availabilityList.innerHTML = items.map((item) => `
    <article class="item">
      <div class="item-main">
        <div>
          <p class="item-title">${escapeHtml(item.date)} · ${escapeHtml(item.start)}-${escapeHtml(item.end)}</p>
          <p class="item-meta">${escapeHtml(item.userName)} · ${escapeHtml(item.mood)}</p>
        </div>
        <span class="tag ${item.kind === "accepted-date" ? "status-accepted" : ""}">${escapeHtml(item.kind === "accepted-date" ? "Fix" : item.mood)}</span>
      </div>
      ${item.note ? `<p class="item-note">${escapeHtml(item.note)}</p>` : ""}
      <div class="item-actions">
        ${item.kind === "accepted-date"
          ? `<button class="small-button" type="button" data-action="focus-idea" data-id="${item.ideaId}">Zum Vorschlag</button>`
          : `<button class="small-button danger" type="button" data-action="delete-availability" data-id="${item.id}">Löschen</button>`}
      </div>
    </article>
  `).join("");
}

function renderIdeas() {
  if (!state.data.ideas.length) {
    els.ideaList.innerHTML = `<div class="empty-state">Noch keine Date-Vorschläge gespeichert.</div>`;
    return;
  }

  els.ideaList.innerHTML = [...state.data.ideas].reverse().map((item) => {
    const placeLabel = item.place || item.placeName || "Ort offen";
    const url = item.mapsUrl || mapsUrl(placeLabel);
    const dateLabel = item.date && item.start && item.end ? `${item.date} · ${item.start}-${item.end}` : "Zeit offen";
    const status = item.status || "open";
    return `
      <article class="item" data-idea-id="${escapeHtml(item.id)}">
        <div class="item-main">
          <div>
            <p class="item-title">${escapeHtml(item.type)}</p>
            <p class="item-meta">${escapeHtml(dateLabel)} · ${escapeHtml(placeLabel)} · von ${escapeHtml(item.userName)}</p>
          </div>
          <span class="tag ${statusClass(status)}">${escapeHtml(statusLabel(status))}</span>
        </div>
        ${item.details ? `<p class="item-note">${escapeHtml(item.details)}</p>` : ""}
        <div class="item-actions">
          ${placeLabel !== "Ort offen" ? `<a class="small-button" href="${escapeHtml(url)}" target="_blank" rel="noopener">Maps</a>` : ""}
          ${status !== "accepted" ? `<button class="small-button success" type="button" data-action="accept-idea" data-id="${item.id}">Annehmen</button>` : ""}
          ${status !== "rejected" ? `<button class="small-button warning" type="button" data-action="reject-idea" data-id="${item.id}">Ablehnen</button>` : ""}
          ${status !== "open" ? `<button class="small-button" type="button" data-action="open-idea" data-id="${item.id}">Wieder öffnen</button>` : ""}
          <button class="small-button danger" type="button" data-action="delete-idea" data-id="${item.id}">Löschen</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderPlaces() {
  els.favoritePlaces.innerHTML = state.data.places
    .map((place) => `<option value="${escapeHtml(place.name)}"></option>`)
    .join("");

  if (!state.data.places.length) {
    els.placeList.innerHTML = `<div class="empty-state">Lieblingsorte erscheinen hier.</div>`;
    return;
  }

  els.placeList.innerHTML = state.data.places.map((place) => `
    <article class="item place-item">
      <div>
        <p class="item-title">${escapeHtml(place.name)}</p>
        <p class="item-meta">${escapeHtml(place.address || "gespeichert von " + place.userName)}</p>
      </div>
      <div class="item-actions">
        <button class="small-button" type="button" data-action="use-place" data-place-id="${escapeHtml(place.id)}">Nutzen</button>
        <a class="small-button" href="${escapeHtml(place.mapsUrl)}" target="_blank" rel="noopener">Maps</a>
        <button class="small-button danger" type="button" data-action="delete-place" data-id="${place.id}">Löschen</button>
      </div>
    </article>
  `).join("");
}

function renderMapPreview() {
  const payload = currentPlacePayload();
  if (!payload) {
    els.mapPreview.innerHTML = `<span>Ort eingeben und mit Maps öffnen.</span>`;
    return;
  }

  els.mapPreview.innerHTML = `<iframe title="Maps Vorschau" loading="lazy" src="${escapeHtml(mapsEmbedUrl(payload.name))}"></iframe>`;
}

function setupDateTypes() {
  els.typeInput.innerHTML = dateTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");
}

async function updateIdeaStatus(id, status) {
  await persist({
    ideas: state.data.ideas.map((idea) => idea.id === id
      ? { ...idea, status, statusBy: state.userName, statusAt: todayIso() }
      : idea)
  });
}

async function addPlace(placeInput) {
  const payload = typeof placeInput === "string" ? { name: placeInput.trim(), mapsUrl: mapsUrl(placeInput.trim()) } : placeInput;
  if (!payload?.name) return;
  const exists = state.data.places.some((place) => place.name.toLowerCase() === payload.name.toLowerCase());
  if (exists) return;
  await persist({
    places: [...state.data.places, {
      id: uid(),
      name: payload.name,
      address: payload.address || "",
      mapsUrl: payload.mapsUrl || mapsUrl(payload.name),
      userName: state.userName,
      createdAt: todayIso()
    }]
  });
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userName = els.userName.value.trim();
  const roomName = els.roomName.value.trim();
  const password = els.roomPassword.value;
  const roomKey = await sha256(`${roomName.toLowerCase()}::${password}`);

  try {
    await openPlanner({ userName, roomName, roomKey });
  } catch (error) {
    console.error(error);
    setStatus("Anmeldung fehlgeschlagen. Prüfe Firebase Authentication und Firestore Rules.");
  }
});

els.logoutButton.addEventListener("click", () => {
  if (state.unsubscribe) state.unsubscribe();
  state.unsubscribe = null;
  clearSavedLogin();
  setView(false);
  els.roomPassword.value = "";
});

for (const input of [els.startInput, els.endInput]) {
  input.addEventListener("input", () => els.endInput.setCustomValidity(""));
}

els.availabilityForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const start = minutes(els.startInput.value);
  const end = minutes(els.endInput.value);
  if (end <= start) {
    els.endInput.setCustomValidity("Bis muss nach Von liegen.");
    els.endInput.reportValidity();
    return;
  }
  els.endInput.setCustomValidity("");

  const item = {
    id: uid(),
    userName: state.userName,
    date: els.dateInput.value,
    start: els.startInput.value,
    end: els.endInput.value,
    mood: els.moodInput.value,
    note: els.noteInput.value.trim(),
    createdAt: todayIso()
  };

  await persist({ availability: [...state.data.availability, item] });
  els.availabilityForm.reset();
  els.dateInput.value = todayIso();
  els.startInput.value = "18:00";
  els.endInput.value = "21:00";
});

els.dateIdeaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const place = currentPlacePayload();
  const item = {
    id: uid(),
    userName: state.userName,
    type: els.typeInput.value,
    date: els.datePlanDateInput.value,
    start: els.datePlanStartInput.value,
    end: els.datePlanEndInput.value,
    place: place?.name || "",
    address: place?.address || "",
    mapsUrl: place?.mapsUrl || (place?.name ? mapsUrl(place.name) : ""),
    details: els.detailsInput.value.trim(),
    createdAt: todayIso(),
    status: "open",
    statusBy: "",
    statusAt: ""
  };

  await persist({ ideas: [...state.data.ideas, item] });
  if (place) await addPlace(place);
  els.dateIdeaForm.reset();
  els.datePlanDateInput.value = todayIso();
  state.selectedPlace = null;
  renderMapPreview();
  renderDateMatchSuggestions();
});

els.datePlanDateInput.addEventListener("change", () => {
  renderDateMatchSuggestions();
});

els.datePlanStartInput.addEventListener("change", () => {
  renderDateMatchSuggestions();
});

els.datePlanEndInput.addEventListener("change", () => {
  renderDateMatchSuggestions();
});

els.placeInput.addEventListener("input", () => {
  state.selectedPlace = null;
  renderMapPreview();
});

els.mapsSearchButton.addEventListener("click", () => {
  const payload = currentPlacePayload();
  if (!payload) {
    els.placeInput.focus();
    return;
  }
  window.open(payload.mapsUrl || mapsUrl(payload.name), "_blank", "noopener");
});

els.saveFavoriteButton.addEventListener("click", async () => {
  await addPlace(currentPlacePayload());
});

els.deletePastButton.addEventListener("click", async () => {
  await cleanupPastData(false);
});

els.prevMonthButton.addEventListener("click", () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
  renderMatchCalendar();
  renderMatches();
});

els.nextMonthButton.addEventListener("click", () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
  renderMatchCalendar();
  renderMatches();
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action, id, placeId, date } = target.dataset;
  if (action === "delete-availability") {
    await persist({ availability: state.data.availability.filter((item) => item.id !== id) });
  }
  if (action === "delete-idea") {
    await persist({ ideas: state.data.ideas.filter((item) => item.id !== id) });
  }
  if (action === "accept-idea") {
    await updateIdeaStatus(id, "accepted");
  }
  if (action === "reject-idea") {
    await updateIdeaStatus(id, "rejected");
  }
  if (action === "open-idea") {
    await updateIdeaStatus(id, "open");
  }
  if (action === "focus-idea") {
    document.querySelector(`[data-idea-id="${CSS.escape(id)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  if (action === "delete-place") {
    await persist({ places: state.data.places.filter((item) => item.id !== id) });
  }
  if (action === "use-place") {
    const place = state.data.places.find((item) => item.id === placeId);
    if (!place) return;
    state.selectedPlace = place;
    els.placeInput.value = place.name;
    els.placeInput.focus();
    renderMapPreview();
  }
  if (action === "select-calendar-day") {
    els.datePlanDateInput.value = date;
    renderMatches(date);
    renderDateMatchSuggestions();
  }
  if (action === "use-match-slot") {
    els.datePlanDateInput.value = date;
    els.datePlanStartInput.value = target.dataset.start;
    els.datePlanEndInput.value = target.dataset.end;
    renderDateMatchSuggestions();
    els.dateIdeaForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

async function boot() {
  setupDateTypes();
  els.dateInput.value = todayIso();
  els.startInput.value = "18:00";
  els.endInput.value = "21:00";
  els.datePlanDateInput.value = todayIso();
  renderMapPreview();
  renderDateMatchSuggestions();

  const saved = getSavedLogin();
  if (!saved) return;
  els.userName.value = saved.userName;
  els.roomName.value = saved.roomName;
  try {
    await openPlanner(saved);
  } catch (error) {
    console.error(error);
    clearSavedLogin();
    setStatus("Gespeicherter Login konnte nicht geladen werden. Bitte neu anmelden.");
  }
}

boot();






