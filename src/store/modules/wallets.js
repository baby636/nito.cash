/* Import libraries. */
import telr from '../../api/telr'

/* Initialize state. */
const state = {
    masterMnemonic: null,
    masterSeed: null,
    // items: [],
    seeds: [],
    // checkoutStatus: null
}

/* Getters. */
const getters = {
    // wallets: (state, getters, rootState) => {
    //     return state.items.map(({ id, quantity }) => {
    //         const product = rootState.products.all.find(product => product.id === id)
    //         return {
    //             title: product.title,
    //             price: product.price,
    //             quantity
    //         }
    //     })
    // },

    // totalBalance: (state, getters) => {
    //     return getters.cartProducts.reduce((total, product) => {
    //         return total + product.price * product.quantity
    //     }, 0)
    // },
}

/* Actions. */
const actions = {
    addNewSeed ({ commit, state }, _seed) {
        console.info('Adding new seed to wallet pool', _seed)

        /* Commit new seed to wallet. */
        commit('addNewSeed', _seed)
    },

    setMasterMnemonic ({ commit, state }, _mnemonic) {
        console.info('Setting master wallet mnemonic', _mnemonic)

        /* Commit wallet's master mnemonic. */
        commit('setMasterMnemonic', _mnemonic)
    },

    setMasterSeed ({ commit, state }, _seed) {
        console.info('Setting master wallet seed', _seed)

        /* Commit wallet's master seed. */
        commit('setMasterSeed', _seed)
    },

    // checkout ({ commit, state }, products) {
    //     const savedCartItems = [...state.items]
    //     commit('setCheckoutStatus', null)
    //     // empty cart
    //     commit('setCartItems', { items: [] })
    //     shop.buyProducts(
    //         products,
    //         () => commit('setCheckoutStatus', 'successful'),
    //         () => {
    //             commit('setCheckoutStatus', 'failed')
    //             // rollback to the cart saved before sending the request
    //             commit('setCartItems', { items: savedCartItems })
    //         }
    //     )
    // },

    // addProductToCart ({ state, commit }, product) {
    //     commit('setCheckoutStatus', null)
    //
    //     if (product.inventory > 0) {
    //         const cartItem = state.items.find(item => item.id === product.id)
    //
    //         if (!cartItem) {
    //             commit('pushProductToCart', { id: product.id })
    //         } else {
    //             commit('incrementItemQuantity', cartItem)
    //         }
    //
    //         // remove 1 item from stock
    //         commit('products/decrementProductInventory', { id: product.id }, { root: true })
    //     }
    // }
}

/* Mutations. */
const mutations = {
    /**
     * Add New Seed
     *
     * New seeds are typically added from Sponsors.
     * eg. https://nito.cash?47a49dfe-2fe4-4343-b81e-947580f243f0
     *     will generate a new seed `47a49dfe-2fe4-4343-b81e-947580f243f0`
     */
    addNewSeed (state, _seed) {
        // FIXME First validate exists, prevent duplicates.
        state.seeds.push(_seed)
    },

    /**
     * Set Master Mnemonic
     *
     * This is the user's primary mnemonic phrase.
     *
     * BIP-39 will be used to split the 24-word mnemonic phrase:
     *   1. 12 words will be sent to user's primary email.
     *   2. 6 words will be sent to user's secondary (and/or social) email(s).
     *   3. 6 words will be sent to Nito cloud server (managed by Modenero).
     */
    setMasterMnemonic (state, _mnemonic) {
        /* Update master seed. */
        state.masterMnemonic = _mnemonic
    },

    /**
     * Set Master Seed
     *
     * This is the user's primary (private key) seed.
     */
    setMasterSeed (state, _seed) {
        /* Update master seed. */
        state.masterSeed = _seed
    },

    // incrementItemQuantity (state, { id }) {
    //     const cartItem = state.items.find(item => item.id === id)
    //     cartItem.quantity++
    // },

    // setCartItems (state, { items }) {
    //     state.items = items
    // },

    // setCheckoutStatus (state, status) {
    //     state.checkoutStatus = status
    // },
}

/* Export. */
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
