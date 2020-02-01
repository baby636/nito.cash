<template>
    <textarea :value={{address}} />
</template>

<script>
export default {
    props: {
        address: String,
    }
}
</script>

<style scoped>
textarea {
    height: 86px;
    text-transform: uppercase;
}
</style>
