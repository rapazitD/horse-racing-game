import type { ActionTree } from 'vuex'
import type { RaceState, RootState, RoundResult } from '../../types'

let raceInterval: ReturnType<typeof setInterval> | null = null
let raceStartTime = 0

export const actions: ActionTree<RaceState, RootState> = {
  // startRace({ commit }) {
  //   commit('SET_RACE_RUNNING', true)
  // },

  // pauseRace({ commit }) {
  //   commit('SET_RACE_RUNNING', false)
  // },

  toggleRace({ commit, state }) {
    commit('TOGGLE_RACE')

    if (state.isRaceRunning) {
      const allHorsesFinished =
        state.raceHorses.length > 0 && state.raceHorses.every((horse) => horse.position >= 100)

      if (allHorsesFinished || !state.raceStarted) {
        commit('RESET_ROUND_POSITIONS')
      }

      if (!state.raceStarted) {
        commit('SET_RACE_STARTED', true)
      }

      raceStartTime = Date.now()

      raceInterval = setInterval(() => {
        commit('UPDATE_ALL_HORSES_POSITIONS')

        // Check if all horses finished (reached position 100)
        const allFinished = state.raceHorses.every((horse) => horse.position >= 100)
        if (allFinished && raceInterval) {
          clearInterval(raceInterval)
          raceInterval = null
          commit('SET_RACE_RUNNING', false)
          commit('SET_CURRENT_ROUND_COMPLETED', true)

          // Save round results
          const currentRound = state.rounds[state.currentRound - 1]
          if (currentRound) {
            const finishTime = (Date.now() - raceStartTime) / 1000

            // Sort horses by position to determine finish order
            const sortedHorses = [...state.raceHorses].sort((a, b) => {
              // If both finished, compare by who reached 100 first (earlier in the race)
              return b.condition - a.condition
            })

            const result: RoundResult = {
              roundNumber: currentRound.roundNumber,
              distance: currentRound.distance,
              horses: sortedHorses.map((horse, index) => ({
                lane: horse.lane,
                name: horse.name,
                condition: horse.condition,
                colorCode: horse.colorCode,
                finishPosition: index + 1,
                finishTime: finishTime * (1 + index * 0.05), // Slight time variation
              })),
            }

            commit('ADD_ROUND_RESULT', result)
          }
        }
      }, 100)
    } else if (raceInterval) {
      // Pause the race
      clearInterval(raceInterval)
      raceInterval = null
    }
  },

  nextRound({ commit, state }) {
    if (state.currentRound < state.rounds.length) {
      commit('INCREMENT_ROUND')
      commit('SET_CURRENT_ROUND_COMPLETED', false)
    }
  },

  // resetRace({ commit }) {
  //   if (raceInterval) {
  //     clearInterval(raceInterval)
  //     raceInterval = null
  //   }
  //   commit('RESET_ALL')
  // },

  async generateProgram({ commit, dispatch, rootState }) {
    commit('CLEAR_ROUND_RESULTS')
    commit('SET_RACE_STARTED', false)

    await dispatch('horse/generateHorses', 20, { root: true })

    const horses = rootState.horse.horses.slice(0, 10)
    const raceHorses = horses.map((horse, index) => ({
      ...horse,
      position: 0,
      lane: index + 1,
    }))
    commit('SET_RACE_HORSES', raceHorses)
    commit('SET_PROGRAM_GENERATED', true)
    commit('SET_CURRENT_ROUND', 1)
    commit('RESET_ROUND_POSITIONS')
  },
}
