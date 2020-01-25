<template>
    <main>
        <svgicon icon="carnival" width="96" height="96" :fill="false" :original="true"></svgicon>

        <svgicon icon="rocketman" width="162" height="162" :fill="false" :original="true"></svgicon>

        <Footer class="tooltip">
            <article>
                <svgicon icon="fire" width="54" height="54" :fill="false" :original="true"></svgicon>
                <div>
                    <h6>Warning</h6>
                    <p>Spark is a low-security wallet intended for short-term use and to send small amounts of IOTA only.</p>
                </div>
            </article>
            <Button @click.native="setSeed" label="Generate wallet" />
        </Footer>
  </main>
</template>

<script>
/* Import components. */
import { Button } from '@/components'

/* Import icons. */
import '@/compiled-icons/fire'

export default {
    components: {
        Button
    },
    data: () => {
        return {
            bitbox: null,
            index: 0,
            frame: 0
        }
    },
    methods: {
        async setSeed() {
            try {
                console.log('SET THAT SEED!')
                // const secret = generateSeed()
                // await API.setSecret({ secret })
                // seed.set(secret)

                this.$router.push('dashboard')
            } catch (err) {
                console.error(err)
            }
        },

    },
    mounted: function () {
        console.log('SETUP LOADED!')
    }
}
</script>

<style scoped>
main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 60px 0 0;
    height: 100%;
}

@media only screen and (max-height: 600px) {
    main {
        padding-top: 40px;
    }
}

article {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}
article div {
    padding-left: 24px;
}

p {
    font-size: 12px;
    line-height: 18px;
}
</style>
