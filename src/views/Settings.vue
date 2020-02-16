<template>
    <div>
        <Warning
            :class="{ active: showWarning }"
            v-on:confirm="destroyWallet"
            v-on:cancel="showWarning = false"
        >
            <h5>Destroy wallet?</h5>

            <p>
                Your transaction history will be cleared. If you have not backed up, you will permanently lose the tokens in your wallet.
            </p>
        </Warning>

        <Modal label="Settings" secondary>
            <Tabs :tabs="tabs" :tab="tab" v-on:tab-change="updateTab" />

            <main>
                <section v-if="tab === 'Basic'">
                    <label>Language</label>

                    <Dropdown value="United States" flag="United States" disabled />

                    <label>Currency</label>

                    <!-- FIXME: `countries[0]` assumes the wrong index for (default) country. -->
                    <Dropdown
                        :onSelect="changeCurrency"
                        :flag="cc.code(fiatCurrency).countries[0]"
                        :value="cc.code(fiatCurrency).currency"
                        :items="currencies" />

                    <hr />

                    <label class="inline">
                        <span>Dark mode</span>
                        <span>
                            <Toggle :on="darkMode" />
                        </span>
                    </label>

                    <p>Visual theme optimised for night time use</p>

                    <hr />

                    <label class="inline">
                        <span>Notifications</span>
                        <span>
                            <Toggle :disabled="disabledNotifications" :on="showNotifications" />
                        </span>
                    </label>

                    <p v-if="disabledNotifications">Notifications are blocked by your browser. Enable them in the browser settings and restart Spark.</p>
                    <p v-else>Show new and confirmed payment notifications</p>

                    <hr />
                </section>

                <section v-if="tab === 'Advanced'">
                    <label>Set node</label>
                    <input type="text" value="https://wallet2.iota.town:443" />
                </section>

                <div v-if="tab === 'Wallet'">
                    <section>
                        <article>
                            <svgicon icon="vault" width="54" height="54" :fill="false" :original="true"></svgicon>

                            <div>
                                <h6 class="dark">BACK UP WITH SEEDVAULT</h6>
                                <p>
                                    You can backup this wallet by exporting a seedvault. The exported SeedVault can then be imported into
                                    Trinity wallet.
                                </p>

                            </div>
                        </article>

                        <Button
                            @click.native="backup"
                            label="Create SeedVault" />
                    </section>

                    <Footer tooltip>
                        <article>
                            <svgicon icon="alarm" width="54" height="54" :fill="false" :original="true"></svgicon>

                            <div>
                                <h6>BURN YOUR WALLET</h6>
                                <p>
                                    You can destroy this wallet, but you will lose access to your tokens and transaction history.
                                    <br />
                                    Be sure to back up your wallet before proceeding, otherwise your tokens will be unrecoverable.
                                </p>
                            </div>
                        </article>

                        <Button
                            @click.native="showWarning = true"
                            warning
                            label="Destroy this wallet" />
                    </Footer>
                </div>
            </main>
        </Modal>
    </div>
</template>

<script>
/* Initialize vuex. */
import { mapActions } from 'vuex'

/* Import modules. */
import cc from 'currency-codes'

/* Import components. */
import { Button, Dropdown, Footer, Modal, Tabs, Toggle, Warning } from '@/components'

/* Import icons. */
import '@/compiled-icons/alarm'
import '@/compiled-icons/vault'

// import { Export, Button, Dropdown, Footer, Header, Icon, Tabs, Toggle, View, Warning } from '~/components'
// import { account, seed } from '~/lib/account'
// import { marketData } from '~/lib/market'
// import { darkMode, fiatCurrency, showNotifications } from '~/lib/app'

export default {
    components: {
        Button,
        Dropdown,
        Footer,
        Modal,
        Tabs,
        Toggle,
        Warning,
    },
    data: () => {
        return {
            cc: null,
            darkMode: null,
            fiatCurrency: null,
            showNotifications: null,

            tab: 'Basic',
            tabs: ['Basic', 'Wallet'],
            showWarning: false,
            showExport: false,
            disabledNotifications: null,
        }
    },
    computed: {
        currencies() {
            /* Initialize currencies. */
            // FIXME: Be sure to set the (default) country id, for currencies with
            //        multiple countries.
            // console.log('Decoded country list', cc.code('GBP'))
            const currencies = this.getCurrencies({
                'USD': 16, // United States Of America (The)
                'EUR': 0, // Andorra
                'GBP': 3, // United Kingdom Of Great Britain And Northern Ireland (The)
                'INR': 1, // India
                'AUD': 0, // Malaysia
                'CAD': 0, // Canada
                'SGD': 0, // Singapore
                'CHF': 1, // Switzerland
                'MYR': 0, // Malaysia
                'JPY': 0, // Japan
                'CNY': 0, // China
            })
            // console.log('CURRENCIES', currencies)
            // $: currencies = getCurrencies($marketData.rates)

            return currencies
        },
    },
    methods: {
        ...mapActions('system', [
            'setError',
            'setNotification',
        ]),

        ...mapActions('wallets', [
            'addNewSeed',
            'destroyWallet',
            'setMasterMnemonic',
            'setMasterSeed',
        ]),

        getCurrencies(_rates) {
            // console.log('GET CURRENCIES', _rates)

            if (!_rates) {
                return []
            }

            const result = Object.keys(_rates).map((item) => {
                /* Retrieve currency details. */
                const currencyData = cc.code(item)

                // console.log('GET ID', item, _rates[item])

                /* Set flag id. */
                const flagId = _rates[item]

                return {
                    label: currencyData.currency,
                    flag: currencyData.countries[flagId],
                    value: item
                }
            })

            result.sort((a, b) => (a.label > b.label ? 1 : -1))

            return result
        },

        changeCurrency(_currency) {
            console.log('CHANGE CURRENCY', _currency)
            // fiatCurrency.set(_currency)
        },

        /**
         * Update Tab
         */
        updateTab(_tab) {
            /* Update tab. */
            this.tab = _tab
        },

        async backup() {
            this.setError('This feature is coming soon')
        },

        async destroyWallet() {
            try {
                console.log('Destroying wallet')

                /* Request (total) wallet destruction. */
                this.destroyWallet()

                /* Set flag. */
                this.showWarning = false

                /* Display notification. */
                this.setNotification('Wallet has been destroyed')

                /* Load setup. */
                setTimeout(() => {
                    this.$router.push('setup')
                }, 3000)
            } catch (err) {
                console.error(err)

                /* Set error. */
                this.setError(err.message ? err.message.split(';')[0] : err)
            }
        },

    },
    created: function () {
        /* Initialize currency codes. */
        this.cc = cc

        // this.disabledNotifications = typeof Notification !== 'function' || Notification.permission === 'denied'
        this.disabledNotifications = false

        // FIXME: Add Vuex for state management.
        this.darkMode = false
        this.fiatCurrency = 'USD'

        // FIXME: We need to detect the user's compatibility.
        this.showNotifications = false
    },
    mounted: function () {
        //
    }
}
</script>

<style scoped>
main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

section {
    flex: 1;
    padding: 28px 20px;
}

hr {
    display: block;
    width: calc(100% + 40px);
    height: 1px;
    margin: 0 0 20px -20px;
    background: var(--hr);
}

p + hr {
    margin-top: 20px;
}

label.inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

main > p {
    font-size: 12px;
    margin-bottom: 24px;
}

article {
    display: flex;
    padding: 12px 15px 24px;
}

article icon {
    width: 110px;
    text-align: center;
}

article div {
    padding-left: 28px;
}

article p {
    font-size: 12px;
    line-height: 18px;
}
h5 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 22px;
}
p {
    line-height: 18px;
}

h6.dark {
    color: var(--fg);
}
</style>
