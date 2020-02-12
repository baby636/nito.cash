<template>
    <main>
        <svgicon icon="carnival" width="128" height="128" :fill="false" :original="true"></svgicon>

        <h1>
            Nito.cash
        </h1>

        <h2>
            Hush Your Money™
        </h2>

        <h3>
            (Developer Preview)
        </h3>

        <div>
            <svgicon icon="rocketman" width="194" height="242" :fill="false" :original="true"></svgicon>
        </div>

        <p>
            Launching soon
            <span>{{ '...'.substr(0, index) }}</span>
        </p>
  </main>
</template>

<script>
/* Import icons. */
import '@/compiled-icons/carnival'
import '@/compiled-icons/rocket'
import '@/compiled-icons/rocketman'

export default {
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
        },
    },
    mounted: function () {
        /* Start animation loop. */
        this.loop()

        /* Load setup. */
        setTimeout(() => {
            this.$router.push('setup')
        }, 3000)
    },
    beforeDestroy() {
        /* Cleanup animation frame. */
        cancelAnimationFrame(this.frame)
    }
}
</script>

<style scoped>
main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background: var(--primary);
    color: var(--primary-fg);
    padding: 66px 0 55px;
}

main h1 {
    text-align: center;
    font-size: 28px;
    line-height: 0px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4em;
}

main h2 {
    text-align: center;
    font-size: 14px;
    line-height: 0px;
    font-weight: 600;
    /* font-style: italic; */
    letter-spacing: 0.4em;
}

main h3 {
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    letter-spacing: 0.4em;
}

main p {
    text-align: left;
    width: 125px;
}

main p span {
    letter-spacing: 0.1em;
}

main div {
    height: 242px;
}

main div svg {
    height: 100%;
}

@media (max-height: 560px) {
    main {
        padding: 30px 0;
    }

    main div {
        height: 160px;
    }
}
</style>
