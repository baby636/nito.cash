<template>
    <Popup active>
        <section>
            <header>Backup your wallet</header>

            <article>
                <div class="animation">
                    <Animation type="president" />
                </div>

                <p>If you use your browser in Incognito mode, or your browser cache is reset, you can lose your funds.</p>

                <p>
                    <strong>Would you like to backup your wallet now?</strong>
                </p>
            </article>

            <footer>
                <Button onClick={onDeny} label="No" double />
                <Button onClick={onConfirm} label="Yes" double />
            </footer>
        </section>
    </Popup>
</template>

<script>
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
        showExport: Boolean,
    },
    data: () => {
        return {
            // active: null,
        }
    },
    methods: {
        onConfirm() {
            // showExport = true
            // backupReminder.set(false)
        },

        onDeny() {
            // backupReminder.set(false)
        }
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
