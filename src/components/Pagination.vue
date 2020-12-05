<template>
  <div v-if="enabled">
    <template v-for="(page, index) in pages">
      <v-btn
        :loading="page.loading"
        :disabled="page.disabled"
        v-if="!page.delimiter"
        :key="page.icon"
        :color="page.active ? 'primary' : 'secondary'"
        icon
        @click="page.onClick"
      >
        <span :is="page.icon.length ? 'v-icon' : 'span'">{{ page.icon }}</span>
      </v-btn>
      <v-btn disabled icon v-else :key="index + '_delimiter'">...</v-btn>
    </template>
  </div>
</template>

<script>
import { GETTERS, ACTIONS } from "../store/constants";
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    enabled() {
      return this.$store.getters[GETTERS.IS_PAGINATED_MODE];
    },
    pages() {
      let pages = [];

      const maxShownPageRange = 9;

      const shownPageRange = Math.min(maxShownPageRange, this.maxPages);

      let start;
      let end;

      start = this.currentPage - Math.floor(shownPageRange / 2);
      if (start <= 0) start = 0;
      end = start + shownPageRange - 1;
      if (end < shownPageRange) end = shownPageRange;
      if (end >= this.maxPages) start = this.maxPages - shownPageRange + 1;
      start = Math.max(start, 1);
      end = Math.min(end, start + shownPageRange - 1);
      const showFirst = start > 1;
      const showLast = end < this.maxPages;

      pages.push({
        icon: "mdi-chevron-left",
        active: false,
        onClick: () => {
          if (this.currentPage > 1) this.currentPage--;
        },
        disabled: this.currentPage == 1,
      });
      if (showFirst) {
        pages.push({
          icon: 1,
          active: false,
          onClick: () => {
            this.currentPage = 1;
          },
        });
        pages.push({
          delimiter: true,
        });
        start += 2;
      }
      if (showLast) {
        end -= 2;
      }
      for (let i = start; i <= end; i++) {
        pages.push({
          icon: i,
          active: i === this.currentPage,
          loading: this.loading && i === this.currentPage,
          onClick: () => {
            this.currentPage = i;
          },
        });
      }
      if (showLast) {
        pages.push({
          delimiter: true,
        });
        pages.push({
          icon: this.maxPages,
          active: false,
          onClick: () => {
            this.currentPage = this.maxPages;
          },
        });
      }
      pages.push({
        icon: "mdi-chevron-right",
        active: false,
        onClick: () => {
          if (this.currentPage < this.maxPages) {
            this.currentPage++;
          } else if (this.currentPage == this.maxPages) {
            this.currentPage = this.maxPages + 1;
            this.$emit("load-posts");
          }
        },
        disabled:
          this.currentPage == this.maxPages &&
          (this.$store.getters.noResults || this.loading),
      });
      if (this.loading) {
        pages = pages.map((page) => ({
          ...page,
          disabled: page.icon != this.currentPage,
        }));
      }
      return pages;
    },
    currentPage: {
      get() {
        return this.$store.getters[GETTERS.GET_CURRENT_PAGE_NUMBER];
      },
      set(val) {
        this.$store.dispatch(ACTIONS.SET_CURRENT_PAGE_NUMBER, val);
      },
    },
    maxPages() {
      return this.$store.getters[GETTERS.GET_MAX_PAGE_NUMBER];
    },
  },
};
</script>

<style lang="stylus"></style>
