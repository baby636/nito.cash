<template>
    <Popup active>
        <section>
            <header>Hey! You have money waiting</header>

            <article>
                <div class="animation">
                    <Animation type="receive" />
                </div>

                <p>
                    You currently have <strong>$0.00</strong> in crypto waiting to be imported into your wallet.
                </p>

                <p>
                    <strong>Would you like to import that money now?</strong>
                </p>
            </article>

            <footer>
                <Button @click.native="close" label="No" double />
                <Button @click.native="confirm" label="Yes" double />
            </footer>
        </section>
    </Popup>
</template>

<script>
/* Initialize vuex. */
import { mapActions } from 'vuex'

/* Import popup manager. */
import Popup from './Popup'

/* Import components. */
import { Animation, Button } from '@/components'

export default {
    components: {
        Animation,
        Button,
        Popup,
    },
    props: {
        // showImport: Boolean,
    },
    data: () => {
        return {
            // active: null,
        }
    },
    methods: {
        ...mapActions('system', [
            'setError',
            'setNotification',
        ]),

        /**
         * Confirm (Wallet Import)
         */
        confirm() {
            console.log('TODO: Process import of seed wallet.')

            // TODO: Process import of seed wallet.
            this.setNotification('Wallet funds imported successfully!')

            /* Emit to parent. */
            this.$emit('close-import')
        },

        /**
         * Close (Wallet Import)
         */
        close() {
            console.log('CLOSING..')

            /* Emit to parent. */
            this.$emit('close-import')
        },
    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>
section {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(100% - 48px);
    max-width: calc(var(--max-width) - 48px);
    transform: translate(-50%, -50%);
    background: var(--list-bg);
    border-radius: 10px;
}

header {
    padding: 20px 0;
    background: var(--warning);
    color: var(--warning-fg);
    text-align: center;
    border-radius: 10px 10px 0 0;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
}

.animation {
    display: block;
    height: 140px;
    margin-bottom: 30px;
}

article {
    padding: 36px 24px 0;
}

p {
    text-align: center;
    margin-bottom: 20px;
}

p strong {
    font-weight: 600;
}

footer {
    display: flex;
    padding: 0 24px 24px;
}
</style>
