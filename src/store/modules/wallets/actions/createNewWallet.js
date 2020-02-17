/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Create New Wallet
 */
const createNewWallet = ({ commit }) => {
    console.info('Creating a NEW wallet..')

    try {
        /* Initialize walletMasterSeed. */
        // let walletMasterSeed = null

        /* Generate walletMasterSeed from random bytes. */
        // TODO: !!! WARNING !!! WARNING !!! WARNING !!!
        //       We MUST properly evaluate ANY and ALL weaknesses with
        //       using randomBytes via a ("mobile") web browser.
        const masterSeed = bitbox.Crypto.randomBytes(32)

        /* Set new master (private) key to wallet.. */
        commit('setMasterSeed', masterSeed)

        /**
         * Create mnemonic wordlist using BIP-39.
         * (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
         *
         * Available languages are:
         *   01. English
         *   02. Japanese
         *   03. Korean
         *   04. Spanish
         *   05. Chinese (Simplified)
         *   06. Chinese (Traditional)
         *   07. French
         *   08. Italian
         *   09. Czech
         */
        const language = bitbox.Mnemonic.wordLists().english

        /* Initialize mnemonic. */
        const mnemonic = bitbox.Mnemonic
            .fromEntropy(masterSeed.toString('hex'), language)
        // console.log('MNEMONIC', mnemonic)

        // TODO: Save partial key to Nito cloud.

        /* Set new master (private) key to wallet.. */
        commit('setMasterMnemonic', mnemonic)

        /* Initialize wallet history. */
        commit('setWalletHistory', [])

        /**
         * (Wallet) Accounts Model
         *
         * active: Index of all "active" accounts (containing UXTOs).
         * current: Index of the current "unused/receiving" account.
         */
        const accountsModel = {
            /* BAI (stablecoin) */
            bai: {
                active: [],
                current: 0,
            },

            /* Bitcoin Cash */
            bch: {
                active: [],
                current: 0,
            },

            /* DAI (stablecoin) */
            dai: {
                active: [],
                current: 0,
            },

            /* Nito (privacy) */
            nito: {
                active: [],
                current: 0,
            },
        }
        console.log('WALLET ACCOUNTS MODEL', accountsModel)

        /* Initialize receiving accounts. */
        commit('setReceivingAccounts', {
            start: 0,
            end: 0,
        })

        /* Initialize change accounts. */
        commit('setChangeAccounts', {
            start: 0,
            end: 0,
        })

        /* Initialize imported (wallet) seeds. */
        commit('setImportedSeeds', [])
    } catch (err) {
        console.error(err)
    }
}

/* Export module. */
export default createNewWallet
