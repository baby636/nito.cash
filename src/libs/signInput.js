/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Sign Input
 */
const signInput = (_transactionBuilder, _hdNode, _inputs) => {
    /* Set input. */
// TEMP: FOR DEVELOPMENT PURPOSES ONLY
    const input = _inputs[0]
    console.log('ADDRESS (of input)', input.address)

    /* Initialize child node. */
    const childNode = _hdNode.derivePath(input.path)

    /* Set keypair. */
    const keyPair = bitbox.HDNode.toKeyPair(childNode)
    console.log('KEYPAIR', keyPair)

    /* Set (signing) amount. */
// TEMP: FOR DEVELOPMENT PURPOSES ONLY
    const amount = parseInt(input.satoshis)
    console.log('SIGNING AMOUNT', amount)

    /* Set vin (number). */
    // FIXME: This MUST be dynamic, to support multiple inputs from the
    //        SAME receiving account (address).
    //        ALSO, consider the possiblity of a "refund" to a "change" account.
    const vin = 0

    /* Initialize redeemscript. */
    // TODO: Find out WHY the hell we need this here??
    let redeemScript

    /* Sign the transaction input(s). */
    // FIXME: Allow for multipe inputs.
    _transactionBuilder.sign(
        vin,
        keyPair,
        redeemScript,
        _transactionBuilder.hashTypes.SIGHASH_ALL,
        amount,
        _transactionBuilder.signatureAlgorithms.SCHNORR
    )
}

/* Export module. */
export default signInput
