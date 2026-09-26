/*
 * ============================================================
 * GAME NIGHT CONFIGURATION
 * ============================================================
 * This is the only file you normally need to edit.
 *
 * 1. Add/edit games in the "games" array.
 * 2. Add/edit game nights in the "gameNights" array.
 * 3. Put your Google Form URL in each game's "rsvp" field.
 *
 * Dates must use YYYY-MM-DD.
 * ============================================================
 */

const games = [
    {
        id: "root",
        name: "Root",
        genre: "Asymmetric Strategy",
        players: "2–4",
        time: "60–90 min",
        description: "A woodland strategy game where each faction has completely different abilities, goals, and play styles."
    },
    {
        id: "dune-imperium",
        name: "Dune: Imperium",
        genre: "Deck Building",
        players: "1–4",
        time: "60–120 min",
        description: "Combine deck building and worker placement as rival factions compete for control of Arrakis."
    },
    {
        id: "wingspan",
        name: "Wingspan",
        genre: "Engine Building",
        players: "1–5",
        time: "40–70 min",
        description: "Build a wildlife preserve and attract birds with powerful combinations of food, eggs, and abilities."
    },
    {
        id: "codenames",
        name: "Codenames",
        genre: "Word / Party",
        players: "4+",
        time: "15–30 min",
        description: "Give clever one-word clues to help your team identify the right agents without hitting the assassin."
    },
    {
        id: "ticket-to-ride",
        name: "Ticket to Ride",
        genre: "Route Building",
        players: "2–5",
        time: "30–60 min",
        description: "Collect cards and claim railway routes across the map while trying to complete your secret destinations."
    },
    {
        id: "spirit-island",
        name: "Spirit Island",
        genre: "Cooperative Strategy",
        players: "1–4",
        time: "90–150 min",
        description: "Work together as powerful spirits defending an island from invading colonists."
    }
];

const gameNights = [
    {
        date: "2026-10-06",
        time: "7:00 PM",
        location: "The usual place",
        games: ["root", "dune-imperium"],
        rsvp: "https://forms.google.com/"
    },
    {
        date: "2026-10-13",
        time: "7:00 PM",
        location: "The usual place",
        games: ["wingspan", "codenames"],
        rsvp: "https://forms.google.com/"
    },
    {
        date: "2026-10-20",
        time: "7:00 PM",
        location: "The usual place",
        games: ["spirit-island", "ticket-to-ride"],
        rsvp: "https://forms.google.com/"
    },
    {
        date: "2026-10-27",
        time: "7:00 PM",
        location: "The usual place",
        games: ["root", "codenames", "wingspan"],
        rsvp: "https://forms.google.com/"
    }
];

/* ============================================================
   Everything below this point generates the page automatically.
   ============================================================ */

const gameMap = Object.fromEntries(games.map(game => [game.id, game]));

let displayedMonth = new Date();
displayedMonth.setDate(1);

let selectedDate = null;

const formatDate = (dateString, options = {}) => {
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat("en-US", options).format(date);
};

const getNightForDate = (dateString) =>
    gameNights.find(night => night.date === dateString);

const getUpcomingNights = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...gameNights]
        .filter(night => new Date(`${night.date}T23:59:59`) >= today)
        .sort((a, b) => a.date.localeCompare(b.date));
};

function renderNextNight() {
    const container = document.getElementById("next-night");
    const upcoming = getUpcomingNights();

    if (!upcoming.length) {
        container.innerHTML = `
            <div class="empty-state">
                No upcoming game nights are scheduled yet.
            </div>
        `;
        return;
    }

    const night = upcoming[0];
    const gameNames = night.games
        .map(id => gameMap[id]?.name || id)
        .map(name => `<span class="game-pill">${name}</span>`)
        .join("");

    container.innerHTML = `
        <div class="next-card">
            <div>
                <p class="eyebrow">NEXT GAME NIGHT</p>
                <h2>${formatDate(night.date, { weekday: "long", month: "long", day: "numeric" })}</h2>
                <div class="next-date">${night.time} · ${night.location}</div>
                <div class="next-games">${gameNames}</div>
            </div>
            <a class="rsvp-button" href="${night.rsvp}" target="_blank" rel="noopener">
                RSVP →
            </a>
        </div>
    `;
}

function renderCalendar() {
    const grid = document.getElementById("calendar-grid");

    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthTitle = formatDate(
        `${year}-${String(month + 1).padStart(2, "0")}-01`,
        { month: "long", year: "numeric" }
    );

    document.querySelector("#calendar + *");
    document.querySelector(".section-heading h2").textContent = `Game Night Calendar — ${monthTitle}`;

    const today = new Date();
    const todayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    let html = "";

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const night = getNightForDate(dateString);
        const isToday = dateString === todayString;

        html += `
            <div class="calendar-day ${isToday ? "today" : ""}">
                <div class="day-number">${day}</div>
                ${
                    night
                    ? `
                        <a
                            class="calendar-event ${selectedDate === dateString ? "selected" : ""}"
                            href="#selected-night"
                            data-date="${dateString}"
                        >
                            <div class="event-title">🎲 Game Night</div>
                            <div class="event-time">${night.time}</div>
                        </a>
                    `
                    : ""
                }
            </div>
        `;
    }

    grid.innerHTML = html;

    grid.querySelectorAll(".calendar-event").forEach(event => {
        event.addEventListener("click", () => {
            selectedDate = event.dataset.date;
            renderCalendar();
            renderSelectedNight(selectedDate);
        });
    });
}

function renderSelectedNight(dateString) {
    const container = document.getElementById("selected-night");
    const night = getNightForDate(dateString);

    if (!night) {
        container.innerHTML = "";
        return;
    }

    const gameNames = night.games
        .map(id => gameMap[id]?.name || id)
        .join(", ");

    container.innerHTML = `
        <div class="selected-card">
            <p class="eyebrow">SELECTED GAME NIGHT</p>
            <h3>${formatDate(night.date, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            })}</h3>
            <div class="muted">${night.time} · ${night.location}</div>
            <p class="games-list"><strong>Games:</strong> ${gameNames}</p>
            <a class="rsvp-button" href="${night.rsvp}" target="_blank" rel="noopener">
                RSVP for this night →
            </a>
        </div>
    `;
}

function renderGames() {
    const grid = document.getElementById("game-grid");
    document.getElementById("game-count").textContent =
        `${games.length} game${games.length === 1 ? "" : "s"}`;

    if (!games.length) {
        grid.innerHTML = `<div class="empty-state">No games have been added yet.</div>`;
        return;
    }

    grid.innerHTML = games.map(game => `
        <article class="game-card">
            <div>
                <h3>${game.name}</h3>
                <p class="game-description">${game.description}</p>
            </div>
            <div class="game-meta">
                <div class="meta-item">
                    <span class="meta-label">Genre</span>
                    <span class="meta-value">${game.genre}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Players</span>
                    <span class="meta-value">${game.players}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Play Time</span>
                    <span class="meta-value">${game.time}</span>
                </div>
            </div>
        </article>
    `).join("");
}

document.getElementById("prev-month").addEventListener("click", () => {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);
    renderCalendar();
});

document.getElementById("today-month").addEventListener("click", () => {
    displayedMonth = new Date();
    displayedMonth.setDate(1);
    renderCalendar();
});

renderNextNight();
renderCalendar();
renderGames();
