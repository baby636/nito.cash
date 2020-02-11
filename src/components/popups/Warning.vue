<template>
    <Popup :active="active">
        <section>
            <header>
                <svgicon icon="alarm" width="54" height="54" :fill="false" :original="true"></svgicon>
            </header>

            <section />

            <article>
                <slot />
            </article>

            <footer>
                <Button
                    @click.native="$emit('confirm')"
                    label="Yes, destroy wallet"
                    warning />

                <Button
                    @click.native="$emit('cancel')"
                    label="Cancel"
                    blank />
            </footer>
        </section>
    </Popup>
</template>

<script>
// import { error, backupReminder } from '~/lib/app'

/* Import components. */
import { Button } from '@/components'

/* Import popup manager. */
import Popup from './Popup'

export default {
    components: {
        Button,
        Popup,
    },
    props: {
        active: Boolean,
    },
    data: () => {
        return {
            // active: null,
        }
    },
    methods: {
        //
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
    width: 100%;
    max-width: calc(var(--max-width) - 48px);
    transform: translate(-50%, -50%);
    background: var(--list-bg);
    border-radius: 10px;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

header {
    padding: 20px 0;
    background: var(--warning);
    text-align: center;
    border-radius: 10px 10px 0 0;
}

article {
    padding: 36px 24px;
}

footer {
    display: flex;
    height: 158px;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 24px 12px;
}
</style>
