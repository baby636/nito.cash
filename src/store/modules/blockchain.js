/* Import libraries. */
import telr from '../../api/telr'

/* Initialize BITBOX. */
const bitbox = new BITBOX()

/* Initialize state. */
const state = {
    tickers: {
        BCH: {
            USD: 0.00,
        }
    }
}

/* Getters. */
const getters = {
    //
}

/* Actions. */
const actions = {
    async updateTickers ({ commit, state }) {
        console.info('Updating tickers..')

        /* Retrieve current price. */
        const current = await bitbox.Price.current('usd')
        console.log('CURRENT PRICE', current)

        /* Commit price to tickers. */
        commit('updateTickers', current)
    }
}

/* Mutations. */
const mutations = {
    /**
     * Set BCH (USD) Price
     */
    updateTickers (state, _price) {
        /* Set ticker. */
        state.tickers.BCH.USD = _price
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
