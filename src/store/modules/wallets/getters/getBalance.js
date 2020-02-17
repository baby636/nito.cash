/* Import libraries. */
import formatValue from '@/libs/formatValue'

/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
* Get Balance
*
* NOTE: This function will accept ANY wallet address to retrieve the
*       current balance (based on "supplied" market price).
*/
const getBalance = (state, getters, rootState) => async (_marketPrice) => {
    /* Set address. */
    const address = getters.getAddress

    /* Set (change) address. */
    const changeAddress = getters.getChangeAddress

    console.log('GET BALANCE (address)', address)
    console.log('GET BALANCE (change address)', changeAddress)
    // console.log('GET BALANCE (market price)', _marketPrice)

    console.log('GET BALANCE (receiving accounts)', state.receivingAccounts)
    console.log('GET BALANCE (change accounts)', state.changeAccounts)

    try {
        /* Retrieve address details. */
        const details = await bitbox.Address.details([
            address,
            changeAddress,
        ])
        // console.log('ADDRESS DETAILS', JSON.stringify(details, null, 4))

        /* Initialize balance. */
        let balance = 0

        /* Set balance (in satoshis). */
        if (rootState.profile.showUnconfirmed) {
            details.forEach((address) => {
                /* Both confirmed and unconfirmed. */
                balance += (address.balanceSat + address.unconfirmedBalanceSat)
            })
        } else {
            details.forEach((address) => {
                /* Confirmed ONLY. */
                balance += address.balanceSat
            })
        }

        /* Format balance (for display). */
        const formattedBalance = formatValue(balance, _marketPrice, 'USD')
        console.log('FORMATTED BALANCE', JSON.stringify(formattedBalance, null, 4))

        /* Return (formatted) balance. */
        return formattedBalance
    } catch(error) {
        console.error(error)
    }
}

/* Export module. */
export default getBalance
