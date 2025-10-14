import type { Team, League, Match, Highlight } from './types';

export const leagues: League[] = [
  { id: 'eng-pl', name: 'Premier League' },
  { id: 'esp-liga', name: 'La Liga' },
  { id: 'ita-seriea', name: 'Serie A' },
];

export const teams: { [key: string]: Team } = {
  mu: { id: 'mu', name: 'Manchester Utd', logoId: 'team-logo-mu' },
  chelsea: { id: 'chelsea', name: 'Chelsea', logoId: 'team-logo-chelsea' },
  liv: { id: 'liv', name: 'Liverpool', logoId: 'team-logo-liv' },
  mc: { id: 'mc', name: 'Manchester City', logoId: 'team-logo-mc' },
  ars: { id: 'ars', name: 'Arsenal', logoId: 'team-logo-ars' },
  th: { id: 'th', name: 'Tottenham', logoId: 'team-logo-th' },
};

export const matches: Match[] = [
  {
    id: 'match-1',
    team1: teams['mu'],
    team2: teams['chelsea'],
    score1: 2,
    score2: 1,
    status: 'Live',
    minute: 78,
    league: leagues[0],
    venue: 'Old Trafford',
    date: '2024-10-26T19:00:00Z',
    team1Lineup: {
        starting: [{ name: 'A. Onana', position: 'GK' }, { name: 'D. Dalot', position: 'DF' }, { name: 'H. Maguire', position: 'DF' }, { name: 'L. Martinez', position: 'DF' }, { name: 'L. Shaw', position: 'DF' }, { name: 'Casemiro', position: 'MF' }, { name: 'B. Fernandes', position: 'MF' }, { name: 'M. Mount', position: 'MF' }, { name: 'Antony', position: 'FW' }, { name: 'M. Rashford', position: 'FW' }, { name: 'R. Hojlund', position: 'FW' }],
        substitutes: [{ name: 'S. Amrabat', position: 'MF' }, { name: 'A. Garnacho', position: 'FW' }]
    },
    team2Lineup: {
        starting: [{ name: 'R. Sanchez', position: 'GK' }, { name: 'M. Gusto', position: 'DF' }, { name: 'A. Disasi', position: 'DF' }, { name: 'T. Silva', position: 'DF' }, { name: 'L. Colwill', position: 'DF' }, { name: 'M. Caicedo', position: 'MF' }, { name: 'E. Fernandez', position: 'MF' }, { name: 'C. Gallagher', position: 'MF' }, { name: 'R. Sterling', position: 'FW' }, { name: 'N. Jackson', position: 'FW' }, { name: 'M. Mudryk', position: 'FW' }],
        substitutes: [{ name: 'C. Palmer', position: 'FW' }, { name: 'N. Madueke', position: 'FW' }]
    },
    events: [
      { minute: 15, type: 'goal', team: 'team1', player: 'M. Rashford', detail: 'Assist by B. Fernandes' },
      { minute: 35, type: 'yellow-card', team: 'team2', player: 'M. Caicedo' },
      { minute: 55, type: 'goal', team: 'team2', player: 'R. Sterling' },
      { minute: 68, type: 'substitution', team: 'team1', player: 'A. Garnacho', detail: 'In for Antony' },
      { minute: 72, type: 'goal', team: 'team1', player: 'A. Garnacho' },
      { minute: 85, type: 'red-card', team: 'team2', player: 'C. Gallagher' },
    ],
  },
  {
    id: 'match-2',
    team1: teams['liv'],
    team2: teams['mc'],
    score1: 1,
    score2: 1,
    status: 'HT',
    minute: 45,
    league: leagues[0],
    venue: 'Anfield',
    date: '2024-10-27T15:30:00Z',
    team1Lineup: {
        starting: [],
        substitutes: []
    },
    team2Lineup: {
        starting: [],
        substitutes: []
    },
    events: [
        { minute: 22, type: 'goal', team: 'team2', player: 'E. Haaland' },
        { minute: 45, type: 'goal', team: 'team1', player: 'M. Salah', detail: 'Penalty' },
    ],
  },
  {
    id: 'match-3',
    team1: teams['ars'],
    team2: teams['th'],
    score1: 0,
    score2: 0,
    status: 'Upcoming',
    minute: 0,
    league: leagues[0],
    venue: 'Emirates Stadium',
    date: '2024-10-28T20:00:00Z',
    team1Lineup: {
        starting: [],
        substitutes: []
    },
    team2Lineup: {
        starting: [],
        substitutes: []
    },
    events: [],
  },
    {
    id: 'match-4',
    team1: {id: 'rm', name: 'Real Madrid', logoId: 'team-logo-th'}, // using other logo for demo
    team2: {id: 'bar', name: 'Barcelona', logoId: 'team-logo-ars'}, // using other logo for demo
    score1: 3,
    score2: 2,
    status: 'FT',
    minute: 90,
    league: leagues[1],
    venue: 'Santiago Bernabeu',
    date: '2024-10-25T18:00:00Z',
    team1Lineup: {
        starting: [],
        substitutes: []
    },
    team2Lineup: {
        starting: [],
        substitutes: []
    },
    events: [
      { minute: 10, type: 'goal', team: 'team2', player: 'R. Lewandowski' },
      { minute: 40, type: 'goal', team: 'team1', player: 'V. Junior' },
      { minute: 65, type: 'goal', team: 'team1', player: 'J. Bellingham' },
      { minute: 82, type: 'goal', team: 'team2', player: 'F. de Jong' },
      { minute: 92, type: 'goal', team: 'team1', player: 'Rodrygo' },
    ],
  },
];

export const highlights: Highlight[] = [
  { id: 'hl-1', title: 'Rashford\'s Opener vs Chelsea', thumbnailId: 'highlight-thumb-1', league: 'Premier League', date: '2024-10-26', matchId: 'match-1' },
  { id: 'hl-2', title: 'Garnacho\'s Incredible Solo Goal', thumbnailId: 'highlight-thumb-2', league: 'Premier League', date: '2024-10-26', matchId: 'match-1' },
  { id: 'hl-3', title: 'Salah Penalty Levels the score', thumbnailId: 'highlight-thumb-3', league: 'Premier League', date: '2024-10-27', matchId: 'match-2' },
  { id: 'hl-4', title: 'Haaland Finishes Superb Counter-Attack', thumbnailId: 'highlight-thumb-4', league: 'Premier League', date: '2024-10-27', matchId: 'match-2' },
  { id: 'hl-5', title: 'Bellingham with a Last Minute Winner', thumbnailId: 'highlight-thumb-5', league: 'La Liga', date: '2024-10-25', matchId: 'match-4' },
  { id: 'hl-6', title: 'Gallagher Red Card for a late tackle', thumbnailId: 'highlight-thumb-6', league: 'Premier League', date: '2024-10-26', matchId: 'match-1' },
];
