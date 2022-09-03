<template>
    <v-row>
        <v-col cols="12" lg="3" md="4" sm="6" :key="idx" v-for="(metric, idx) in metrics">
            <v-card color="secondary">
                <v-card-title class="text-h3">
                    {{ formatValue(metric.value) }}
                </v-card-title>
                <v-card-text>
                    {{ metric.display }}
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { IMetric } from "@/worker/DashboardService";
import { defineComponent, PropType } from "vue";
import { round } from "@/misc/util/round";

export default defineComponent({
    props: {
        metrics: {
            type: Array as PropType<IMetric[]>,
            required: true,
        }
    },
    setup(props, context) {
        const formatValue = (value: number) => {
            if(value > 1_000_000) {
                return `${round(value/1_000_000)}M`
            }
            if(value > 1_000) {
                return `${round(value/1_000)}K`
            }
            return value;
        }
        return {
            formatValue
        };
    },
});
</script>
