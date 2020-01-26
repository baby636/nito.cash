<template>
    <button :class="classObject">
        {{ loading ? loadingLabel : label }}
    </button>
</template>

<script>
export default {
    props: {
        label: String,
        loadingLabel: String,

        blank: Boolean,
        disabled: Boolean,
        double: Boolean,
        list: Boolean,
        loading: Boolean,
        secondary: Boolean,
        small: Boolean,
        warning: Boolean,
    },
    data: () => {
        return {
            // loadingLabel: '',
        }
    },
    computed: {
        classObject: function () {
            return {
                blank: this.blank,
                disabled: this.disabled,
                double: this.double,
                list: this.list,
                loading: this.loading,
                secondary: this.secondary,
                small: this.small,
                warning: this.warning,
            }
        }
    },

}
</script>

<style scoped>
button {
    display: block;
    width: 100%;
    height: 54px;
    background: var(--primary);
    color: var(--primary-fg);
    font-size: 14px;
    font-weight: 700;
    border-radius: 30px;
}

@media only screen and (max-height: 600px) {
    button {
        height: 48px;
    }
}

button:hover {
    background: var(--primary-hover);
}

button.secondary {
    background: var(--secondary);
    color: var(--secondary-fg);
}
button.secondary:hover {
    background: var(--secondary-hover);
}

button.warning {
    background: var(--warning);
    color: var(--warning-fg);
}
button.warning:hover {
    background: var(--warning-hover);
}

button.small {
    height: 45px;
    font-size: 13px;
}

button.double {
    border-radius: 30px 0 0 30px;
}

button.loading {
    pointer-events: none;
}

button.double + button.double {
    border-radius: 0 30px 30px 0;
    border-left: 1px solid var(--bg);
}
button.disabled {
    pointer-events: none;
    opacity: 0.5;
}
button.blank {
    background: none;
    border: 1px solid var(--fg);
    color: var(--fg);
}
</style>
