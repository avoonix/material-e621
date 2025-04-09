<template>
    <v-tooltip location="bottom">
        <template #activator="{ props }">
            <span v-bind="props">{{ relativeDate }}</span>
        </template>
        <span>{{ absoluteDate }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        value: {
            type: String,
            required: true,
        }
    },
    setup(props, context) {
        const date = computed(() => parseISO(props.value));
        const relativeDate = computed(() =>
            formatDistanceToNow(date.value, { addSuffix: true }),
        );
        const absoluteDate = computed(() => format(date.value, "PP p"));
        return {
            relativeDate,
            absoluteDate,
        };
    },
});
</script>
