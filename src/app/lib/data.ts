import type { League } from './types';

// This file is now mostly deprecated in favor of the Scorebat API service.
// We'll keep the leagues for now for potential filtering, but this could also come from an API.

export const leagues: League[] = [
  { id: 'eng-pl', name: 'Premier League' },
  { id: 'esp-liga', name: 'La Liga' },
  { id: 'ita-seriea', name: 'Serie A' },
  { id: 'ger-bundesliga', name: 'Bundesliga' },
  { id: 'fra-ligue1', name: 'Ligue 1' },
];
