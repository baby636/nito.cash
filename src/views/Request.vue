<template>
    <main>
        Request
    </main>
</template>

<script>
/* Import components. */
// import { Button, Footer } from '@/components'

/* Import icons. */
// import '@/compiled-icons/fire'

export default {
    components: {
        // Button,
        // Footer
    },
    data: () => {
        return {
            // bitbox: null,
            // index: 0,
            // frame: 0
        }
    },
    methods: {
        //
    },
    mounted: function () {
        //
    }
}
</script>

<style scoped>
main {
    flex: 1;
    padding: 40px 20px 0;
}

icon {
    display: block;
    height: 120px;
    margin: -10px auto 5px;
}

@media only screen and (max-height: 600px) {
    icon {
        height: 80px;
    }
}

p {
    text-align: center;
    margin-bottom: 20px;
}

h5 {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 14px;
    text-align: center;
}
h3 {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 26px;
}
h3 strong {
    font-size: 28px;
    line-height: 28px;
    font-weight: 600;
}
h3 small {
    font-size: 13px;
    line-height: 14px;
    font-weight: 600;
    margin: 0 8px 1px 2px;
}
</style>
