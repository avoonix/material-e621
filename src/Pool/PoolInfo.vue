<template>
    <v-fade-transition mode="out-in">
        <div v-if="pool" key="content">
            <v-card color="transparent" elevation="0" style="max-width: 50vw;">
                <v-card-title class="flex-column align-baseline">
                    <span style="line-height: initial">{{ pool.name }}</span>
                    <small class="text-caption" style="line-height: initial;">
                        {{ pool.post_count }} Posts &bull; created by {{ pool.creator_name }}
                    </small>
                </v-card-title>
                <v-card-text style="max-height: 20vh; overflow-y: auto;">
                    <DText :text="pool.description || 'No description'" />
                </v-card-text>
            </v-card>
        </div>
        <div v-else-if="loading">
            <AppLogo type="loader" />
        </div>
    </v-fade-transition>
</template>

<script lang="ts">
import AppLogo from "@/App/AppLogo.vue";
import DText from "@/Parser/DText.vue";
import { useUrlStore } from "@/services";
import type { Pool } from "@/worker/api";
import { getApiService } from "@/worker/services";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    props: {
        poolId: {
            type: Number,
            required: true,
        }
    },
    setup(props, context) {
        const urlStore = useUrlStore();
        const pool = ref<Pool>();
        const loading = ref(false);
        const getInfo = async () => {
            try {
                loading.value = true;
                const service = await getApiService();
                pool.value = await service.getPool({
                    id: props.poolId,
                    baseUrl: urlStore.e621Url,
                });
            } catch (err) {
                console.log(err); // TODO: display to user?
                loading.value = false;
            }
        };
        onMounted(() => {
            getInfo();
        });
        return {
            pool,
            loading
        };
    },
    components: { DText, AppLogo }
});
</script>
