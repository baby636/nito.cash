/* Import libraries. */
// import telr from '../../api/telr'

/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/* Set websocket endpoint. */
const ENDPOINT = 'https://ws.bitcoin.com'

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
    /**
     * Update Tickers
     */
    async updateTickers ({ commit }) {
        console.info('Updating price tickers..')

        /* Retrieve current price. */
        const current = await bitbox.Price.current('usd')
        console.info('Current BCH/USD price', current)

        /* Commit price to tickers. */
        commit('updateTickers', current)
    },

    /**
     * Initialize Websocket
     */
    async initSocket() {
        /* Initialize socket connection. */
        const socket = new bitbox.Socket({
            callback: () => {
                console.log('connected')
            }, wsURL: ENDPOINT
        })

        socket.listen('blocks', (message) => {
            console.log(message)
        })
    },

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
