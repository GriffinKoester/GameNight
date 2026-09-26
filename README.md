# Weekly Game Night

A simple static game-night scheduler designed for GitHub Pages.

## Files

- `index.html` — page structure
- `style.css` — styling and responsive layout
- `script.js` — game and game-night data plus calendar logic

## Setup

1. Create a GitHub repository.
2. Upload the three files.
3. Edit `script.js`.
4. Add your games to the `games` array.
5. Add your scheduled nights to the `gameNights` array.
6. Replace each placeholder Google Forms URL with your actual form URL.
7. Enable GitHub Pages in the repository settings.

## Adding a game

Add an object to the `games` array:

```javascript
{
    id: "my-game",
    name: "My Game",
    genre: "Strategy",
    players: "2–4",
    time: "60–90 min",
    description: "A short description of the game."
}
```

The `id` should be unique.

## Scheduling a game night

Add an object to the `gameNights` array:

```javascript
{
    date: "2026-11-03",
    time: "7:00 PM",
    location: "The usual place",
    games: ["my-game"],
    rsvp: "https://docs.google.com/forms/..."
}
```

The date format is `YYYY-MM-DD`.

The values in `games` must match the `id` of a game in the `games` array.

## Google Forms

The site does not communicate with Google Forms directly. The RSVP button simply opens your Google Form in a new tab.

This means the site requires no backend, database, server, API key, or login system.
