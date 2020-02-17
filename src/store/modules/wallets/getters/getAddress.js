/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Get Address
 */
const getAddress = (state) => {
    /* Initialize seed buffer. */
    const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
    // console.log('SEED BUFFER', seedBuffer)

    const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
    // console.log('HD NODE', hdNode)

    /* Set change. */
    // FIXME: This must be derived.
    const change = 0

    /* Set address index. */
    // FIXME: This must be derived.
    const addressIndex = 0

    /* Initialize child node. */
    const childNode = hdNode.derivePath(
        `${state.derivationPath.bch}/${change}/${addressIndex}`)

    const address = bitbox.HDNode.toCashAddress(childNode)
    console.log('ADDRESS', address)

    /* Return address. */
    return address
}

/* Export module. */
export default getAddress
