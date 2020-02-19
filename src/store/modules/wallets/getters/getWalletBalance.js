/* Import libraries. */
import formatValue from '@/libs/formatValue'

/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
* Get (Total) Wallet Balance
*
* Retrieves the current (total) wallet balance.
*
* NOTE: Optional (market price) parameter is used to calculate fiat value,
*       and return a "formatted" value package.
*/
const getWalletBalance = (state, getters, rootState) => async (_marketPrice) => {
    // console.log('GET WALLET BALANCE (market price)', _marketPrice)

    /* Initialize receiving (account) addresses. */
    const allReceiving = [getters.getWalletAddress]
    console.log('GET WALLET BALANCE (allReceiving)', allReceiving)

    /* Initialize change (account) addresses. */
    const allChange = [getters.getChangeAddress]
    console.log('GET WALLET BALANCE (allChange)', allChange)

    console.log('GET WALLET BALANCE (receiving accounts)', state.receivingAccounts)
    console.log('GET WALLET BALANCE (change accounts)', state.changeAccounts)

    /* Set ALL accounts. */
    const allAccounts = [
        ...allReceiving,
        ...allChange,
    ]
    console.log('GET WALLET BALANCE (all accounts)', allAccounts)

    try {
        /* Retrieve (ALL) account(s) details. */
        const details = await bitbox.Address.details(allAccounts)
        // console.log('ALL ACCOUNTS DETAILS', JSON.stringify(details, null, 4))

        /* Initialize balance. */
        let balance = 0

        /* Set balance (in satoshis). */
        if (rootState.profile.useUnconfirmed) {
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

        /* Validate market price. */
        if (_marketPrice) {
            /* Format balance (for display). */
            // TODO: Support additional currencies.
            const formattedBalance = formatValue(balance, _marketPrice, 'USD')
            console.log('FORMATTED BALANCE', JSON.stringify(formattedBalance, null, 4))

            /* Return (formatted) balance. */
            return formattedBalance
        } else {
            /* Return (satoshi) balance. */
            return balance
        }
    } catch (err) {
        console.error(err)
    }
}

/* Export module. */
export default getWalletBalance
