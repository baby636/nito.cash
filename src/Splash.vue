<template>
    <div class="hello">
        <!-- <Icon icon="logo" primary /> -->
        <svgicon icon="carnival" width="128" height="128"></svgicon>
        <svgicon icon="rocket" width="64" height="64" color="#0f2"></svgicon>
        <!-- <img alt="Vue logo" src="@/assets/logo.png"> -->

        <h1>
            An IOTA Labs
            <br />
            experiment
        </h1>

        <div>
            <!-- <Rocketman /> -->
        </div>

        <p>
            Launching
            <span>{{ '...'.substr(0, index) }}</span>
        </p>
  </div>
</template>

<script>
/* Import components. */
// import Icon from '@/components/Icon.vue'
import '@/compiled-icons/carnival'
import '@/compiled-icons/rocket'

export default {
    components: {
        // Icon
    },
    data: () => {
        return {
            index: 0,
            frame: 0
        }
    },
    methods: {
        loop() {
            if (this.frame % 10 === 0) {
                this.index = this.index === 3 ? 0 : this.index + 1
            }
            this.frame = requestAnimationFrame(this.loop)
        }

    },
    mounted: function () {
        /* Start animation loop. */
        this.loop()

        // import { onMount } from 'svelte'
        //
        // import { Rocketman, Icon } from '~/components'
        //
        // let index = 0
        // let frame
        //
        //
        // onMount(() => {
        //     loop()
        //     return () => {
        //         cancelAnimationFrame(frame)
        //     }
        // })

    }
}
</script>

<style scoped>
.splash {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background: var(--primary);
    color: var(--primary-fg);
    padding: 66px 0 55px;
}

.splash h1 {
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4em;
}

.splash p {
    text-align: left;
    width: 85px;
}

.splash p span {
    letter-spacing: 0.1em;
}

.splash div {
    height: 242px;
}

.splash div svg {
    height: 100%;
}

@media (max-height: 560px) {
    .splash {
        padding: 30px 0;
    }

    .splash div {
        height: 160px;
    }
}
</style>
