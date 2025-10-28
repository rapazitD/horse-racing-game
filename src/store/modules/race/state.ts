import type { RaceState } from '../../types'

export const state: RaceState = {
  raceHorses: [],
  isRaceRunning: false,
  currentRound: 1,
  rounds: [
    { roundNumber: 1, distance: 1200 },
    { roundNumber: 2, distance: 1400 },
    { roundNumber: 3, distance: 1600 },
    { roundNumber: 4, distance: 1800 },
    { roundNumber: 5, distance: 2000 },
    { roundNumber: 6, distance: 2200 }
  ],
  programGenerated: false,
  raceStarted: false,
  currentRoundCompleted: false,
  roundResults: [],
  resultTabs: []
}
