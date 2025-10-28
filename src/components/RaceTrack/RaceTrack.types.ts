import type { Horse } from '../HorseList'

export interface RaceHorse extends Horse {
  lane: number
}

export interface RaceTrackProps {
  horses: RaceHorse[]
  currentRound: number
  currentDistance: number
}
