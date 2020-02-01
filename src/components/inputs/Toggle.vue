<template>
    <div class="toggle"
        @click="update"
        :class="{ disabled }">
        <div class="knob" :class="{ active }" />
    </div>
</template>

<script>
export default {
    props: {
        disabled: Boolean,
        on: Boolean,
    },
    data: () => {
        return {
            selectedPos: null,
        }
    },
    computed: {
        active: function () {
            return this.selectedPos !== null ? this.selectedPos : this.on
        }
    },
    methods: {
        update() {
            /* Initialize selected position (if necessary). */
            if (this.selectedPos === null) {
                this.selectedPos = this.on
            }

            /* Toggle position. */
            this.selectedPos = !this.selectedPos
        }
    },

}
</script>

<style scoped>
.toggle {
    display: block;
    position: relative;
    width: 41px;
    height: 23px;
    border-radius: 23px;
    background: var(--box-bg);
    cursor: pointer;
}

.toggle.disabled {
    pointer-events: none;
}

.knob,
.toggle.disabled .knob.active {
    position: absolute;
    top: 2px;
    left: 2px;
    height: 19px;
    width: 19px;
    border-radius: 19px;
    background: var(--primary);
    opacity: 0.2;
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.knob.active {
    left: 20px;
    opacity: 1;
}
</style>
