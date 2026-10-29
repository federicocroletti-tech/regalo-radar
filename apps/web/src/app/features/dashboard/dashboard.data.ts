import type { DashboardListing } from './dashboard.model';

export const DEMO_LISTINGS: readonly DashboardListing[] = [
  {
    id: 'demo-1',
    title: 'Tavolino in legno da ritirare',
    category: 'Casa',
    location: 'Milano · esempio',
    receivedLabel: 'Ricevuto 8 min fa',
    priorityScore: 92,
    status: 'NEW',
  },
  {
    id: 'demo-2',
    title: 'Libri per bambini, ritiro gratuito',
    category: 'Libri',
    location: 'Monza · esempio',
    receivedLabel: 'Ricevuto 24 min fa',
    priorityScore: 81,
    status: 'NEW',
  },
  {
    id: 'demo-3',
    title: 'Lampada da tavolo',
    category: 'Casa',
    location: 'Milano · esempio',
    receivedLabel: 'Ricevuto 1 ora fa',
    priorityScore: 64,
    status: 'OPENED',
  },
  {
    id: 'demo-4',
    title: 'Giacca invernale',
    category: 'Abbigliamento',
    location: 'Pavia · esempio',
    receivedLabel: 'Ricevuto 3 ore fa',
    priorityScore: 38,
    status: 'IGNORED',
  },
];
