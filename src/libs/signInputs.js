/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Sign Inputs
 */
const signInputs = (_transactionBuilder, _hdNode, _inputs) => {
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
    const amount = parseInt(input.satoshis)
    console.log('SIGNING AMOUNT', amount)

    /* Set vin (number). */
    // FIXME: This MUST be dynamic, to support NON-ZERO inputs for BOTH
    //        receiving and change accounts.
    //        eg. in the case of dividend payments, there would be
    //        MANY receivers and the index would rarely be ZERO.
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
export default signInputs
