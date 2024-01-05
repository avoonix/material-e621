<template>
    <v-list class="secondary cool-list">
        <p class="mx-3">Posts per row</p>
        <v-list-item v-for="(option, index) in postsPerRowOptions" :key="index" @click="onSelectionChange(option)">
            <v-list-item-action v-if="selectedPostsPerRow === option">
                <v-icon>mdi-check</v-icon>
            </v-list-item-action>
            <v-list-item-title style="text-align: end;" class="text-subtitle-2">
                {{ option }}
            </v-list-item-title>

        </v-list-item>
    </v-list>
</template>

<style scoped lang="scss">
.cool-list {
    min-width: 9rem;
}
</style>
  
<script lang="ts">
import { ref } from "vue"
export default {
    setup() {
        const selectedPostsPerRow = ref<"Automatic" | number>(1)
        return {
            selectedPostsPerRow
        }
    },
    data() {
        return {
            postsPerRowOptions: ["Automatic", 1, 2, 3, 4],
        };
    },
    methods: {
        onSelectionChange(value: number | string) {
            this.selectedPostsPerRow = typeof value === "string" ? value == "Automatic" ? value : 1 : value;
            console.log(`GridSize: onSelectionChange(${value})`);
            this.$emit('selection-changed', value);
        },
    },
};
</script>
  