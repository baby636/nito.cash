/* Import libraries. */
import telr from '../../api/telr'

/* Initialize state. */
const state = {
    error: null,
    notification: null,
}

/* Getters. */
const getters = {
    // cartProducts: (state, getters, rootState) => {
    //     return state.items.map(({ id, quantity }) => {
    //         const product = rootState.products.all.find(product => product.id === id)
    //         return {
    //             title: product.title,
    //             price: product.price,
    //             quantity
    //         }
    //     })
    // },

    // cartTotalPrice: (state, getters) => {
    //     return getters.cartProducts.reduce((total, product) => {
    //         return total + product.price * product.quantity
    //     }, 0)
    // }
}

/* Actions. */
const actions = {
    setError ({ commit, state }, _error) {
        console.info('Setting error message', _error)

        /* Commit error message. */
        commit('setError', _error)

        /* Set automatic dismiss delay. */
        setTimeout(() => {
            commit('setError', null)
        }, 3000)

    },

    setNotification ({ commit, state }, _notification) {
        console.info('Setting notification message', _notification)

        /* Commit notification message. */
        commit('setNotification', _notification)
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

    // pushProductToCart (state, { id }) {
    //     state.items.push({
    //         id,
    //         quantity: 1
    //     })
    // },

    // incrementItemQuantity (state, { id }) {
    //     const cartItem = state.items.find(item => item.id === id)
    //     cartItem.quantity++
    // },

    // setCartItems (state, { items }) {
    //     state.items = items
    // },

    // setCheckoutStatus (state, status) {
    //     state.checkoutStatus = status
    // }
}

/* Export. */
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
