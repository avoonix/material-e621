import { useTheme } from 'vuetify';
import { computed, onMounted, watch } from 'vue';
import { useAppearanceStore } from '@/services';

export const useSyncedTheme = () => {
    const vuetifyTheme = useTheme();
    const appearance = useAppearanceStore();

    const theme = computed(() => appearance.theme);

    const applyTheme = () => {
        vuetifyTheme.themes.value.dark.colors.primary = theme.value.primary;
        vuetifyTheme.themes.value.light.colors.primary = theme.value.primary;
        vuetifyTheme.themes.value.dark.colors.secondary = theme.value.secondary;
        vuetifyTheme.themes.value.light.colors.secondary = theme.value.secondary;
        vuetifyTheme.themes.value.dark.colors.accent = theme.value.accent;
        vuetifyTheme.themes.value.light.colors.accent = theme.value.accent;
        vuetifyTheme.global.name.value = theme.value.dark ? "dark" : "light";
    };

    watch(
        () => theme,
        () => {
            applyTheme();
        },
        { deep: true, immediate: true }
    );

    onMounted(() => {
        applyTheme();
    });
}
