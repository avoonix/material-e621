<template>
    <v-tooltip bottom>
        <template #activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ relativeDate }}</span>
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
