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
        id: "pandemic",
        name: "Pandemic",
        genre: "Co-op resource management",
        players: "2–4",
        time: "30-45 min",
        description: "Collaborate with your teammates to erradicate diseases before they destroy humanity",
        bgg_url: "https://boardgamegeek.com/boardgame/30549/pandemic"
    },
    {
        id: "wingspan",
        name: "Wingspan",
        genre: "Engine Building",
        players: "1–5",
        time: "40–70 min",
        description: "Build a wildlife preserve and attract birds with powerful combinations of food, eggs, and abilities.",
        bgg_url: "https://boardgamegeek.com/boardgame/266192/wingspan"
    },
    {
        id: "codenames",
        name: "Codenames",
        genre: "Word / Party",
        players: "4+",
        time: "15–30 min",
        description: "Give clever one-word clues to help your team identify the right agents without hitting the assassin.",
        bgg_url: "https://boardgamegeek.com/boardgame/178900/codenames"
    },
    {
        id: "feed-the-kraken",
        name: "Feed The Kraken",
        genre: "Social Deduction",
        players: "2–5",
        time: "45 - 90 min",
        description: "Crews of pirates and sailors fight to steer their ship in the right direction, while a hidden cult of The Kraken try to (literally) overthrow the crew ",
        bgg_url: "https://boardgamegeek.com/boardgame/271601/feed-the-kraken"
    },
    {
        id: "sheriff-of-nottingham",
        name: "Sheriff of Nottingham",
        genre: "Social Deduction",
        players: "3-5",
        time: "60 min",
        description: "Players act as merchants trying to bring their wares (and sometimes contraband) into the city of Nottingham, and the Sheriff decides who gets passed the gate. Bribery, lying, and smuggling are all encouraged",
        bgg_url: "https://boardgamegeek.com/boardgame/157969/sheriff-of-nottingham"
    },
    {
        id: "rebel-princess",
        name: "Rebel Princess",
        genre: "Trick Taking Card Game",
        players: "3-6",
        time: "20-30 min",
        description: "A Princess themed trick taking game that adds a twist to Hearts. Each princess has special abilities to disrupt rounds and add unique rules to each round",
        bgg_url: "https://boardgamegeek.com/boardgame/381249/rebel-princess"
    },
    {
        id: "cockroach-poker",
        name: "Cockroach Poker",
        genre: "Bluffing Card Game",
        players: "2-6",
        time: "20 min",
        description: "A bluffing game where players hand out cards to each other and try and trick each other into collecting a set of the same type of card",
        bgg_url: "https://boardgamegeek.com/boardgame/11971/cockroach-poker"
    },
    {
        id: "jackbox-games",
        name: "Jackbox Party Games",
        genre: "online party games",
        players: "2-6",
        time: "10 min",
        description: "Quiplash, Trivia Murder Party, and more games played from your phone",
        bgg_url: "https://www.jackboxgames.com/"
    }
];

const gameNights = [
    {
        date: "2026-10-06",
        time: "7:30 PM",
        location: "The usual place",
        games: ["pandemic", "cockroach-poker"],
        rsvp: "https://forms.gle/XzySQcypvDurVce37"
    },
    {
        date: "2026-10-13",
        time: "7:30 PM",
        location: "The usual place",
        games: ["wingspan", "codenames"],
        rsvp: "https://forms.gle/tZZ81HMNxT7SycNC6"
    },
    {
        date: "2026-10-20",
        time: "7:30 PM",
        location: "The usual place",
        games: ["jackbox-games"],
        rsvp: "https://forms.gle/TBhKMTR62TECqS5p9"
    },
    {
        date: "2026-10-27",
        time: "7:30 PM",
        location: "The usual place",
        games: ["feed-the-kraken"],
        rsvp: "https://forms.gle/2NxbsyAk6BNNf97w5"
    }
];

/* ============================================================
   Everything below this point generates the page automatically.
   ============================================================ */

const gameMap = Object.fromEntries(games.map(game => [game.id, game]));
const gameToURL = Object.fromEntries(games.map(game => [game.id, bgg_url]));


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
                            <div class="event-title">Game Night</div>
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
                <a href="${game.bgg_url}">More Info <\a>
                <
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
