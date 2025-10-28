import type { MutationTree } from 'vuex'
import type { RaceState, RoundResult } from '../../types'
import type { RaceHorse } from '@/components/RaceTrack'

export const mutations: MutationTree<RaceState> = {
  SET_RACE_RUNNING(state, isRunning: boolean) {
    state.isRaceRunning = isRunning
  },

  TOGGLE_RACE(state) {
    state.isRaceRunning = !state.isRaceRunning
  },

  SET_RACE_HORSES(state, horses: RaceHorse[]) {
    state.raceHorses = horses
  },

  SET_CURRENT_ROUND(state, round: number) {
    state.currentRound = round
  },

  INCREMENT_ROUND(state) {
    if (state.currentRound < state.rounds.length) {
      state.currentRound++
    }
  },

  SET_PROGRAM_GENERATED(state, generated: boolean) {
    state.programGenerated = generated
  },

  SET_RACE_STARTED(state, started: boolean) {
    state.raceStarted = started
  },

  SET_CURRENT_ROUND_COMPLETED(state, completed: boolean) {
    state.currentRoundCompleted = completed
  },

  ADD_ROUND_RESULT(state, result: RoundResult) {
    state.roundResults.push(result)
  },

  RESET_ROUND_POSITIONS(state) {
    for (const horse of state.raceHorses) {
      horse.position = 0
    }
  },

  CLEAR_ROUND_RESULTS(state) {
    state.roundResults = []
  },

  RESET_ALL(state) {
    state.raceHorses = []
    state.currentRound = 1
    state.isRaceRunning = false
    state.programGenerated = false
    state.raceStarted = false
    state.currentRoundCompleted = false
    state.roundResults = []
  },

  UPDATE_ALL_HORSES_POSITIONS(state) {
    const currentRound = state.rounds[state.currentRound - 1]
    if (!currentRound) return

    const baseDistance = 1200 // Base distance for speed calculation
    const distanceMultiplier = currentRound.distance / baseDistance

    for (const horse of state.raceHorses) {
      if (horse.position < 100) {
        // Calculate speed based on condition (0-100)
        // Higher condition = faster speed
        // Speed ranges from 0.5 to 2.5 units per tick
        // Adjust speed based on distance (longer races are proportionally slower)
        const baseSpeed = 0.5 + (horse.condition / 100) * 2
        const adjustedSpeed = baseSpeed / Math.sqrt(distanceMultiplier)
        horse.position = Math.min(100, horse.position + adjustedSpeed)
      }
    }
  },
}
