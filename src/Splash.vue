<template>
    <div class="splash">
        <svgicon icon="carnival" width="160" height="160" :fill="false" :original="true"></svgicon>

        <h1>
            Nito.cash
            <br />
            alpha
            <br />
            <em>(still in dev)</em>
        </h1>

        <div>
            <svgicon icon="rocketman" width="194" height="242" :fill="false" :original="true"></svgicon>
        </div>

        <p>
            Launching
            <span>{{ '...'.substr(0, index) }}</span>
        </p>
  </div>
</template>

<script>
/* Import components. */
import '@/compiled-icons/carnival'
import '@/compiled-icons/rocket'
import '@/compiled-icons/rocketman'

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
    }
}
</script>

<style scoped>
/* .splash {
    --primary: #3569d7;
    --primary-fg: #fff;
} */

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
