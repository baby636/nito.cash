<template>
    <textarea
        placeholder="Recipient address"
        :value="address"
        v-on:input="$emit('input', $event.target.value)"
    />
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
    /* height: 86px; */
    /* text-transform: uppercase; */
}
</style>
