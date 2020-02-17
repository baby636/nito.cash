/* Import libraries. */
// import telr from '../../api/telr'

/* Initialize state. */
const state = {
    error: null,
    notification: null,
}

/* Getters. */
const getters = {
    //
}

/* Actions. */
const actions = {
    setError ({ commit }, _error) {
        /* Commit error message. */
        commit('setError', _error)

        /* Set automatic dismiss delay. */
        setTimeout(() => {
            commit('setError', null)
        }, 3000)
    },

    setNotification ({ commit }, _notification) {
        /* Commit notification message. */
        commit('setNotification', _notification)

        /* Set automatic dismiss delay. */
        setTimeout(() => {
            commit('setNotification', null)
        }, 3000)
    },
}

/* Mutations. */
const mutations = {
    /**
     * Set Error Message
     */
    setError (state, _error) {
        /* Update error message. */
        state.error = _error
    },

    /**
     * Set Notification
     */
    setNotification (state, _notification) {
        /* Update notification message. */
        state.notification = _notification
    },
}

/* Export. */
// NOTE: We DO NOT namespace here to allow for global use of `dispatch`.
export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations
}
