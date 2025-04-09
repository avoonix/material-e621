<template>
  <div>
    <v-card class="mb-2" color="secondary">
      <v-card-title> All buttons (drag to add/remove) </v-card-title>
      <v-card-text>
        <draggable :model-value="availableButtons" :group="{ name: 'post-button-editor', pull: 'clone', put: true }"
          :sort="false" class="trash-container" :item-key="identity">
          <template #item="{ element: button }">
            <post-button :type="button" />
          </template>
        </draggable>
      </v-card-text>
    </v-card>
    <v-card class="mb-2" color="secondary">
      <v-card-title> Post buttons </v-card-title>
      <v-card-text>
        <draggable v-model="postButtonsComputed" :group="{ name: 'post-button-editor', pull: true, put: true }"
          @add="postButtonsComputed = handleSort(postButtonsComputed)($event)" :item-key="identity">
          <template #item="{ element: button }">
            <post-button class="trashable" :type="button" />
          </template>
        </draggable>
      </v-card-text>
    </v-card>
    <v-card class="mb-2" color="secondary">
      <v-card-title> Fullscreen buttons </v-card-title>
      <v-card-text>
        <draggable v-model="fullscreenButtonsComputed" :group="{ name: 'post-button-editor', pull: true, put: true }"
          @add="
            fullscreenButtonsComputed = handleSort(fullscreenButtonsComputed)(
              $event,
            )
            " :item-key="identity">
          <template #item="{ element: button }">
            <post-button class="trashable" :type="button" />
          </template>
        </draggable>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title> Details buttons </v-card-title>
      <v-card-text>
        <draggable v-model="detailsButtonsComputed" :group="{ name: 'post-button-editor', pull: true, put: true }" @add="
          detailsButtonsComputed = handleSort(detailsButtonsComputed)($event)
          " :item-key="identity">
          <template #item="{ element: button }">
            <post-button class="trashable" :type="button" />
          </template>
        </draggable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import PostButton from "@/Post/PostButton.vue";
import type { ButtonType } from "@/services/types";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";
import Draggable from "vuedraggable";


export default defineComponent({
  components: {
    Draggable,
    PostButton,
  },
  props: {
    availableButtons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
    postButtons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
    fullscreenButtons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
    detailsButtons: {
      type: Array as PropType<ButtonType[]>,
      required: true,
    },
  },
  setup(props, context) {
    const postButtonsComputed = computed<ButtonType[]>({
      get() {
        return props.postButtons;
      },
      set(value) {
        context.emit("update:post-buttons", value);
      },
    });
    const fullscreenButtonsComputed = computed<ButtonType[]>({
      get() {
        return props.fullscreenButtons;
      },
      set(value) {
        context.emit("update:fullscreen-buttons", value);
      },
    });
    const detailsButtonsComputed = computed<ButtonType[]>({
      get() {
        return props.detailsButtons;
      },
      set(value) {
        context.emit("update:details-buttons", value);
      },
    });

    const handleSort = (list: ButtonType[]) => (event: any) => {
      const droppedElement = list[event.newIndex];
      return list.filter(
        (item, idx) => !(item === droppedElement && event.newIndex !== idx),
      ); // remove old duplicates
    };

const identity = (item: ButtonType) => item;

    return {
      postButtonsComputed,
      fullscreenButtonsComputed,
      handleSort,
      detailsButtonsComputed,
      identity,
    };
  },
});
</script>

<style scoped>
.trash-container .trashable {
  color: red;
}
</style>
