<template>
    <Modal label="Settings" secondary>
        <Tabs :tabs="tabs" :tab="tab" />

        <main>
            <section v-if="tab === 'Basic'">
                <label>Language</label>

                <!-- <Dropdown value="English" flag="United Kingdom" disabled /> -->

                <label>Currency</label>

                <!-- <Dropdown
                    onSelect={changeCurrency}
                    flag={cc.code($fiatCurrency).countries[0]}
                    value={cc.code($fiatCurrency).currency}
                    items={currencies} /> -->

                <hr />

                <label class="inline">
                    <span>Dark mode</span>
                    <span>
                        <!-- <Toggle on={darkMode} /> -->
                    </span>
                </label>

                <p>Visual theme optimised for night time use</p>

                <hr />

                <label class="inline">
                    <span>Notifications</span>
                    <span>
                        <!-- <Toggle disabled={disabledNotifications} on={showNotifications} /> -->
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
                        <icon>
                            <Icon icon="seedvault" />
                        </icon>
                        <div>
                            <h6 class="dark">BACK UP WITH SEEDVAULT</h6>
                            <p>
                                You can backup this wallet by exporting a seedvault. The exported SeedVault can then be imported into
                                Trinity wallet.
                            </p>

                        </div>
                    </article>
                    <Button
                        onClick={() => {
                            showExport = true
                        }}
                        label="Create SeedVault" />
                </section>

                <Footer tooltip>
                    <article>
                        <icon>
                            <Icon icon="warning" warning />
                        </icon>
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
                        onClick={() => {
                            showWarning = true
                        }}
                        warning
                        label="Destroy this wallet" />
                </Footer>
            </div>
        </main>
    </Modal>
</template>

<script>
/* Import components. */
import { Button, Footer, Modal, Tabs } from '@/components'

/* Import icons. */
import '@/compiled-icons/fire'

// import cc from 'currency-codes'

// import { Export, Button, Dropdown, Footer, Header, Icon, Tabs, Toggle, View, Warning } from '~/components'
// import { account, seed } from '~/lib/account'
// import { marketData } from '~/lib/market'
// import { darkMode, fiatCurrency, showNotifications } from '~/lib/app'

export default {
    components: {
        Button,
        Footer,
        Modal,
        Tabs,
    },
    data: () => {
        return {
            tab: 'Basic',
            tabs: ['Basic', 'Wallet'],
            showWarning: false,
            showExport: false,
            disabledNotifications: null,
        }
    },
    methods: {
        getCurrencies(_rates) {
            console.log('GET CURRENCIES')
            if (!_rates) {
                return []
            }

            const result = Object.keys(_rates).map((item) => {
                const currencyData = cc.code(item)

                return {
                    label: currencyData.currency,
                    flag: currencyData.countries[0],
                    value: item
                }
            })

            result.sort((a, b) => (a.label > b.label ? 1 : -1))

            return result
        },

        changeCurrency(_currency) {
            console.log('CHANGE CURRENCY')
            fiatCurrency.set(_currency)
        },

        async destroyWallet() {
            try {
                console.log('DESTROY WALLET')
                // const { generatePersistenceID } = await import('@iota/persistence')
                // const { trytesToTrits } = await import('@iota/converter')
                //
                // const dbID = generatePersistenceID(trytesToTrits($seed))
                //
                // if ($account) {
                //     $account.stop()
                // }
                //
                // const deleteRequest = window.indexedDB.deleteDatabase(dbID)
                //
                // deleteRequest.onsuccess = () => {
                //     localStorage.clear()
                //     sessionStorage.clear()
                //     location.hash = ''
                //     location.reload()
                // }
            } catch (err) {
                console.log(err)
            }
        },

    },
    mounted: function () {
        // $: currencies = getCurrencies($marketData.rates)

        // this.disabledNotifications = typeof Notification !== 'function' || Notification.permission === 'denied'
        this.disabledNotifications = false
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
