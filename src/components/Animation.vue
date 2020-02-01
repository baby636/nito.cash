<template>
    <div id="container"></div>
</template>

<script>
export default {
    props: {
        type: String,
    },
    data: () => {
        return {
            animation: null,
        }
    },
    mounted: async function () {
        /* Initialize lottie. */
        const lottie = await import('lottie-web')

        /* Initialize animation data. */
        let animationData = null

        /* Select (animation) type. */
        switch (this.type) {
            case 'loading':
                animationData = await import('./animations/loading.json')
                break
            case 'receive':
                animationData = await import('./animations/receive.json')
                break
            case 'pay':
                animationData = await import('./animations/pay.json')
                break
            case 'pay-error':
                animationData = await import('./animations/pay-error.json')
                break
            case 'pay-ok':
                animationData = await import('./animations/pay-ok.json')
                break
            default:
                animationData = await import('./animations/president.json')
                break
        }

        /* Initialize DOM element that will contain the animation. */
        const container = document.getElementById('container')

        /* Build (animation) options. */
        const options = {
            container,
            renderer: 'svg',
            animationData,
            loop: true,
            autoplay: true
        }

        /* Load animation. */
        lottie.loadAnimation(options)

        // return () => {
        //     animation && animation.destroy()
        // }
    },
}
</script>

<style scoped>
div {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
