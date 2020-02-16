/* Import libraries. */
// import telr from '../../api/telr'

/* Initialize state. */
const state = {
    // NOTE: This is a 24-word (BIP-39) phrase, which can be generated from
    //       the `masterSeed` or imported from an existing wallet.
    masterMnemonic: null,

    // NOTE: This is a 32-byte seed, which can be generated randomly,
    //       or by importing from an existing wallet.
    masterSeed: null,

    // NOTE: Based on (BIP-44) derivation paths.
    //       (m / purpose' / coin_type' / account' / change / address_index)
    derivationPath: {
        bch: `m/44'/145'/0'`,
        slp: `m/44'/245'/0'`,
        slpr: `m/44'/2450'/0'`,
        eth: `m/44'/60'/0'`,
    },

    // NOTE: Seeds may be imported from UUIDs embedded in the url,
    //       as a querystring (https://nito.cash?<uuid>).
    importedSeeds: [],

    // NOTE: A list of ALL active "receiver" account indexes.
    activeAccounts: [0],

    // NOTE: A list of ALL active "change" account indexes.
    changeAccounts: [0],
}

/* Getters. */
const getters = {
    /**
     * Receiving Account
     *
     * Returns the current (next active) receiving account.
     *
     * NOTE: This account MUST be currently "unfunded".
     */
    receivingAccount: (state, getters) => {
console.log('WHAT ARE STORE (GETTERS)', getters)
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    },

    /**
     * Active Accounts
     *
     * Returns (addresses for) ALL active accounts.
     */
    activeAccounts: (state) => {
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    },

    /**
     * Change Accounts
     *
     * Returns (addresses for) ALL (in-use) change accounts.
     */
    changeAccounts: (state) => {
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    }
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
        /* Validate new seed (for duplicates). */
        if (state.importedSeeds.includes(_seed)) {
            console.log(_seed, 'has already been added to this wallet')
        } else {
            console.log('Adding new seed to wallet', _seed)

            /* Commit new seed to wallet. */
            commit('addNewSeed', _seed)
        }
    },

    setMasterMnemonic ({ commit }, _mnemonic) {
        console.log('Setting master wallet mnemonic', _mnemonic)

        /* Commit wallet's master mnemonic. */
        commit('setMasterMnemonic', _mnemonic)
    },

    setMasterSeed ({ commit }, _seed) {
        console.log('Setting master wallet seed', _seed)

        /* Commit wallet's master seed. */
        commit('setMasterSeed', _seed)
    },

    destroyWallet ({ commit }) {
        console.log('Destroying wallet')

        /* Commit wallet's destruction. */
        commit('destroyWallet')
    },
}

/* Mutations. */
const mutations = {
    /**
     * Add New (Imported) Seed
     *
     * New seeds are typically imported from BCH sponsors.
     * eg. https://nito.cash?47a49dfe-2fe4-4343-b81e-947580f243f0
     *     will generate a new seed `47a49dfe-2fe4-4343-b81e-947580f243f0`
     */
    addNewSeed (state, _seed) {
        /* Add NEW "imported" seed to pool. */
        state.importedSeeds.push(_seed)
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

    /**
     * Destroy Wallet
     *
     * This will completely destory the user's wallet,
     * as well as ALL imported seeds.
     */
    destroyWallet (state) {
        /* Destory master mnemonic. */
        state.masterMnemonic = null

        /* Destory master seed. */
        state.masterSeed = null

        /* Reset all (imported) seeds. */
        state.importedSeeds = []

        /* Reset active accounts (address) index. */
        state.activeAccounts = [0]

        /* Reset change (address) index. */
        state.changeAccounts = [0]
    },
}

/* Export. */
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
