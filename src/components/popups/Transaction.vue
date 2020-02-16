<template>
    <Popup :active="active">
        <div v-if="tx">
            <section>
                <header :class="{ incoming: tx.incoming, pending: !tx.persistence }">
                    <h2>
                        <strong v-if="tx.persistence">You {{ tx.incoming ? 'received' : 'sent' }} {{tx.value.value}}</strong>
                        <strong v-else>{{ tx.incoming ? 'Receiving' : 'Sending' }} {{tx.value.value}}</strong>

                        <small>{{tx.value.unit}}</small>
                    </h2>

                    <small>{{tx.value.fiat}}</small>
                </header>

                <article>
                    <div class="date">{{ formatDate(tx.timestamp, 'long') }}</div>

                    <h5>Transaction Hash</h5>

                    <a :href="'https://explorer.bitcoin.com/bch/tx/' + tx.hash" target="_blank">
                        {{ tx.hash.slice(0, 10) }} ... {{ tx.hash.slice(-10) }}
                    </a>

                    <div v-if="tx.receiver">
                        <h5>Recipient</h5>
                        <p>{{tx.receiver}}</p>
                    </div>

                    <div v-if="tx.reference">
                        <h5>Reference</h5>
                        <p>{{tx.reference}}</p>
                    </div>

                    <footer>
                        <Button
                            @click.native="close"
                            label="Done" />
                    </footer>
                </article>
            </section>
        </div>
    </Popup>
</template>

<script>
/* Import popup manager. */
import Popup from './Popup'

/* Import components. */
import { Button } from '@/components'

export default {
    components: {
        Button,
        Popup,
    },
    props: {
        active: Boolean,
        txHash: String,
        tx: Object,
    },
    data: () => {
        return {
            //
        }
    },
    methods: {
        /**
         * Close (Transaction Details)
         */
        close() {
            /* Emit to parent. */
            this.$emit('close-details')
        },

        /**
         * Format Date
         *
         * TODO Consider switching to momentjs.
         */
        formatDate(_time, _type) {
            /* Define date (formatting) options. */
            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }

            /* Initialize date. */
            const date = new Date(_time * 1000)

            /* Select a (formatting) type. */
            switch (_type) {
                case 'long':
                    return `${date.toLocaleDateString(navigator.language, options)}, ${date.toLocaleTimeString(navigator.language)}`
                case 'short':
                    return date.toLocaleDateString(navigator.language, options)
                default:
                    return date.toLocaleTimeString(navigator.language)
            }
        },
    },
    created: function () {
        /* Setup escape key press. */
        document.onkeydown = evt => {
            /* Capture window event. */
            evt = evt || window.event

            /* Detect `escape` key. */
            if (evt.keyCode === 27) {
                /* Set flag. */
                this.close()
            }
        }
    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>
@keyframes slideIn {
    from {
        transform: translate(0, 3%);
    }
    to {
        transform: translate(0, 0);
    }
}

section {
    width: 100%;
    max-width: calc(var(--max-width) - 48px);
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 10px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
}

header {
    padding: 27px 0 26px;
    background: var(--secondary);
    color: var(--secondary-dark);
    border-radius: 10px 10px 0 0;
}

header.incoming {
    background: var(--trinary);
    color: var(--trinary-dark);
}

header.pending {
    background: var(--pending-header);
    color: var(--pending-dark);
}

header h2 {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
}

header h2 strong {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
}

header h2 small {
    font-size: 11px;
    float: left;
    line-height: 11px;
    margin: 1px 0 0 2px;
}

header > small {
    font-size: 11px;
    display: block;
    text-align: center;
}

article {
    padding: 24px;
    user-select: text;
    background: var(--list-bg);
    border-radius: 0 0 10px 10px;
}

article div .date {
    display: block;
    font-size: 11px;
    font-weight: 600;
    opacity: 0.5;
    margin-bottom: 18px;
}

h5 {
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 2px;
}

p,
a {
    display: block;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 18px;
}
a {
    color: var(--fg-link);
    cursor: pointer;
}

a:hover {
    color: var(--fg-hover);
}

footer {
    padding-top: 10px;
}
</style>
