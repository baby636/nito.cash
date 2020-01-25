<template>
    <div class="setup">
        <!-- <Icon icon="logo-spark" /> -->

        <!-- <Berny size={162} /> -->

        <!-- <Footer tooltip> -->
            <!-- <article> -->
                <!-- <Icon icon="warning" warning /> -->
                <div>
                    <h6>Warning</h6>
                    <p>Spark is a low-security wallet intended for short-term use and to send small amounts of IOTA only.</p>
                </div>
            <!-- </article> -->
            <!-- <Button onClick={setSeed} label="Generate wallet" /> -->
        <!-- </Footer> -->

        <!-- <svgicon icon="carnival" width="128" height="128" :fill="false" :original="true"></svgicon>

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
        </p> -->
  </div>
</template>

<script>
// import API from '~/lib/api'
// import { generateSeed } from '~/lib/helpers'
// import { seed } from '~/lib/account'

// import { Berny, Button, Footer, Icon } from '~/components'

/* Import modules. */
// import { BITBOX } from 'bitbox-sdk'

/* Import components. */
// import '@/compiled-icons/carnival'
// import '@/compiled-icons/rocket'
// import '@/compiled-icons/rocketman'

export default {
    components: {
        // Icon
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
