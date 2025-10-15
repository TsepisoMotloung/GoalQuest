import { Match } from '../types';

export const formatMatchTime = (match: Match): string => {
  if (match.status === 'Live' && match.minute) {
    return `${match.minute}'`;
  }
  
  const matchDate = new Date(match.date);
  const now = new Date();
  const isToday = matchDate.toDateString() === now.toDateString();
  
  if (isToday) {
    return matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const getMatchStats = (match: Match) => {
  const team1Stats = match.team1.stats || {};
  const team2Stats = match.team2.stats || {};
  
  return {
    possession: {
      team1: team1Stats.possession || 0,
      team2: team2Stats.possession || 0,
    },
    shots: {
      team1: team1Stats.shots || 0,
      team2: team2Stats.shots || 0,
    },
    shotsOnTarget: {
      team1: team1Stats.shotsOnTarget || 0,
      team2: team2Stats.shotsOnTarget || 0,
    },
    cards: {
      team1: {
        yellow: team1Stats.yellowCards || 0,
        red: team1Stats.redCards || 0,
      },
      team2: {
        yellow: team2Stats.yellowCards || 0,
        red: team2Stats.redCards || 0,
      },
    },
  };
};

export const getMatchStatus = (match: Match): {
  label: string;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
} => {
  switch (match.status) {
    case 'Live':
      return { label: 'LIVE', variant: 'destructive' };
    case 'Completed':
      return { label: 'FT', variant: 'secondary' };
    case 'Scheduled':
      return { label: 'Scheduled', variant: 'outline' };
    case 'Postponed':
      return { label: 'Postponed', variant: 'outline' };
    case 'Cancelled':
      return { label: 'Cancelled', variant: 'outline' };
    default:
      return { label: match.status, variant: 'outline' };
  }
};

export const getLatestEvent = (match: Match) => {
  if (!match.events || match.events.length === 0) return null;
  return match.events[match.events.length - 1];
};

export const getMatchOdds = (match: Match) => {
  if (!match.odds) return null;
  const { team1Win, draw, team2Win } = match.odds;
  
  const total = team1Win + draw + team2Win;
  const probability = {
    team1: Math.round((team1Win / total) * 100),
    draw: Math.round((draw / total) * 100),
    team2: Math.round((team2Win / total) * 100),
  };
  
  return {
    odds: { team1Win, draw, team2Win },
    probability,
  };
};

export const formatOdds = (odds: number): string => {
  return odds.toFixed(2);
};