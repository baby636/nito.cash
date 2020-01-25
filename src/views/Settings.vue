<template>
    <Modal label="Settings" secondary>
        hi there!
    </Modal>
</template>

<script>
/* Import components. */
import { Modal } from '@/components'

/* Import icons. */
import '@/compiled-icons/fire'

export default {
    components: {
        Modal
    },
    data: () => {
        return {
            //
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
    display: flex;
    flex-direction: column;
}

section {
    flex: 1;
    padding: 28px 20px;
}

hr {
    display: block;
    width: calc(100% + 40px);
    height: 1px;
    margin: 0 0 20px -20px;
    background: var(--hr);
}

p + hr {
    margin-top: 20px;
}

label.inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

main > p {
    font-size: 12px;
    margin-bottom: 24px;
}

article {
    display: flex;
    padding: 12px 15px 24px;
}

article icon {
    width: 110px;
    text-align: center;
}

article div {
    padding-left: 28px;
}

article p {
    font-size: 12px;
    line-height: 18px;
}
h5 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 22px;
}
p {
    line-height: 18px;
}

h6.dark {
    color: var(--fg);
}
</style>
