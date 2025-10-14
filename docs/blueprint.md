# **App Name**: GoalQuest

## Core Features:

- Live Match Feed: Display a list of live football matches with current scores, time, and status, filterable by league and searchable by team, updating in near real-time using WebSocket or fallback polling.
- Match Page: Detailed match view including scoreline, time, venue, competition, team lineups, event timeline (goals, cards, substitutions), and embedded ScoreBat video highlights.
- Highlights Page: Aggregate latest video highlights (global or filtered by league/team) from ScoreBat.
- Prediction Tool: Show pre-match probabilities (win/draw/lose) generated from the AI model, providing insight into match outcomes using a tool. Offer potential betting suggestion, integrating odds from API-Football (optional).
- Editorial Highlights CMS: Minimal CMS for uploading highlight text, pinning videos, moderating AI-generated predictions and insights.
- SEO Optimization: Implement per-match canonical pages with structured data (JSON-LD for SportsEvent), fast meta rendering via server-side rendered HTML and accessible URLs for matches, leagues, and teams.

## Style Guidelines:

- Primary color: Saturated green (#4CAF50) to evoke the excitement and vibrancy of the game.
- Background color: Light, desaturated green (#F1F8E9), close to the primary color, creates a subtle, pleasant backdrop.
- Accent color: Blue (#2196F3) for interactive elements, such as buttons and links.  Provides excellent contrast against the green background and attracts user attention.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines, paired with 'Inter' (sans-serif) for body text. 'Space Grotesk' provides a computerized, techy feel that evokes sport, while 'Inter' ensures body text is highly readable.
- Code font: 'Source Code Pro' for displaying API endpoints and data structures.
- Desktop: 2-column layout – left timeline and score, right video/highlights and live stats. Mobile: Stacked layout with sticky header showing match score.
- Use sports-themed icons, such as soccer balls, whistles, and timers.
- Use smooth transitions and subtle animations on score updates and event triggers for engagement.