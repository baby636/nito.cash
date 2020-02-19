/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Get Wallet Address
 *
 * Returns the next avaialble "receiving" (account) address,
 * for the specified wallet type.
 *
 * TODO: Add support for ALL wallet types: BAI, BCH, DAI, NITO
 */
const getWalletAddress = (state) => {
    console.log('GET WALLET ADDRESS (state)', state)

    /* Initialize seed buffer. */
    const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
    // console.log('SEED BUFFER', seedBuffer)

    const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
    // console.log('HD NODE', hdNode)

    /* Set current (account) index. */
    const currentIndex = state.receivingAccounts.bch.current

    /* Set change. */
    // NOTE: BIP-32 path levels specify this will be `0` for receiving accounts.
    //       (https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels)
    const change = 0

    /* Initialize child node. */
    const childNode = hdNode.derivePath(
        `${state.derivationPath.bch}/${change}/${currentIndex}`)

    const address = bitbox.HDNode.toCashAddress(childNode)
    console.log('WALLET ADDRESS', address)

    /* Return address. */
    return address
}

/* Export module. */
export default getWalletAddress
