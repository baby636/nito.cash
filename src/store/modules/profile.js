/* Import libraries. */
import nito from '../../api/nito'

/* Initialize state. */
const state = {
    profile: {
        appStarts: 0,

        showUnconfirmed: true
    }
}

/* Getters. */
const getters = {}

/* Actions. */
const actions = {
    getAllProducts ({ commit }) {
        nito.getProfile(_profile => {
            commit('setProfile', _profile)
        })
    }
}

/* Mutations. */
const mutations = {
    /* Set profile. */
    setProfile (state, _profile) {
        state.profile = _profile
    },

    /* Increment number of application starts. */
    incrementAppStarts (state) {
        /* Increment. */
        state.profile.appStarts++
    }
}

/* Export. */
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
