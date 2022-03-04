<template>
  <v-data-table disable-sort :headers="headers" :items="shortcuts" class="secondary">
    <template #top>
      <div class="pa-2">
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" block v-bind="attrs" v-on="on">
              New Shortcut
            </v-btn>
          </template>
          <v-card color="secondary">
            <v-card-title>
              <span>{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      :items="actions"
                      v-model="editedItem.action"
                      label="Action"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.sequence"
                      label="Recorded sequence"
                      readonly
                    />
                  </v-col>
                  <v-col cols="12">
                    <keyboard-shortcut-recorder
                      @recorded="editedItem.sequence = $event"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="close">Cancel</v-btn>
              <v-btn color="primary" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card color="secondary">
            <v-card-title>
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="closeDelete">
                Cancel
              </v-btn>
              <v-btn color="primary" text @click="deleteItemConfirm">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <template #item.buttons="{ item }">
      <v-btn icon @click="editItem(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon @click="deleteItem(item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { shortcutService } from "@/services/ShortcutService";
import { Action, Shortcut } from "@/services/types";
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  watch,
} from "@vue/composition-api";
import { clone } from "lodash";
import KeyboardShortcutRecorder from "./KeyboardShortcutRecorder.vue";

export default defineComponent({
  props: {},
  components: { KeyboardShortcutRecorder },
  setup(props, context) {
    const headers = [
      { text: "Action", value: "action" },
      { text: "Sequence", value: "sequence" },
      { text: "", value: "buttons", align: "end" },
    ];
    const shortcuts = computed(() => shortcutService.shortcuts);
    const editedItem = ref<Shortcut>({ action: "go_to_posts", sequence: "" });
    const defaultItem: Shortcut = { action: "go_to_posts", sequence: "" };
    const dialog = ref(false);
    const dialogDelete = ref(false);
    const editedIndex = ref(-1);
    const formTitle = computed(() =>
      editedIndex.value === -1 ? "New Item" : "Edit Item",
    );
    watch(dialog, () => dialog.value || close());
    watch(dialogDelete, () => dialogDelete.value || closeDelete());
    const editItem = (item: Shortcut) => {
      editedIndex.value = shortcuts.value.indexOf(item);
      editedItem.value = clone(item);
      dialog.value = true;
    };
    const deleteItem = (item: Shortcut) => {
      editedIndex.value = shortcuts.value.indexOf(item);
      editedItem.value = clone(item);
      dialogDelete.value = true;
    };
    const deleteItemConfirm = () => {
      shortcutService.deleteShortcut(editedIndex.value);
      closeDelete();
    };
    const close = async () => {
      dialog.value = false;
      await nextTick();
      editedItem.value = clone(defaultItem);
      editedIndex.value = -1;
    };
    const closeDelete = async () => {
      dialogDelete.value = false;
      await nextTick();
      editedItem.value = clone(defaultItem);
      editedIndex.value = -1;
    };
    const save = () => {
      if (editedIndex.value > -1) {
        shortcutService.updateShortcut(editedIndex.value, editedItem.value);
      } else {
        shortcutService.addShortcut(clone(editedItem.value));
      }
      close();
    };

    const actions: Action[] = [
      "go_to_posts",
      "go_to_settings",
      "focus_search",
      "fullscreen_exit",
      "fullscreen_next_post",
      "fullscreen_previous_post",
    ];

    return {
      headers,
      shortcuts,
      editedItem,
      defaultItem,
      dialog,
      dialogDelete,
      editedIndex,
      formTitle,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      closeDelete,
      save,
      actions,
    };
  },
});
</script>
