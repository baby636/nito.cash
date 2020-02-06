/* Import modules. */
const numeral = require('numeral')

/**
 * Format BCH value to value units and calculate market value.
 */
export default (satoshis, marketPrice, units) => {
    // let value = getIotas(iotas, units, marketPrice)
    let value = satoshis

    let unit = 'sats'

    let fiat = ((satoshis / 100000000) * marketPrice.value)
    fiat = numeral(fiat).format('$0,0.00[00]') + ' ' + marketPrice.currency

    // const fiat = !marketPrice
    //     ? '-'
    //     : (marketPrice.value * (value / 1000000)).toLocaleString('en-US', {
    //           style: 'currency',
    //           currency: marketPrice.currency,
    //           minimumFractionDigits: 2,
    //           maximumFractionDigits: 5
    //       })

    /* Adjust value and unit (based on size of balance). */
    switch (true) {
    case value < 100:
        break
    case value < 100000:
        value /= 100
        unit = 'bits'
        break
    case value < 100000000:
        value /= 100000
        unit = 'mBCH'
        break
    default:
        value /= 100000000
        unit = 'BCH'
        break
    }

    /* Rounded value (based on decimal value). */
    // TODO: Run more display tests to decide if we're keeping the rounding.
    //       2-decimal places is ideal for "primary" displays.
    //       4-decimal places is acceptable for "secondary" displays.
    const rounded = Math.round(value * 10) / 10 +
        (Math.round(value * 10) / 10 === value ? '' : '+')

    /* Return (formatted) value. */
    return {
        value,
        rounded,
        unit,
        fiat
    }
}
