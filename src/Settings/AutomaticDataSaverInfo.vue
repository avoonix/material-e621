<template>
  <div>
    <p>
      "Automatic" uses <code>navigator.connection</code>, which is currently not
      properly supported by most browsers. It falls back to medium quality
      images if not supported.
    </p>
    <ul>
      <li>Bluetooth or cellular: low</li>
      <li>Ethernet or wifi: high</li>
      <li>Everything else: medium</li>
    </ul>
    <p>
      Current connection type:
      <span
        :class="dataSaverInfo.typeSupported ? 'success--text' : 'error--text'"
        :title="dataSaverInfo.typeSupported ? 'Supported' : 'Not supported'"
        >{{ dataSaverInfo.type }}</span
      >
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useDataSaverInfo } from "@/misc/util/dataSaver";

export default defineComponent({
  props: {},
  setup(props, context) {
    const { dataSaverInfo } = useDataSaverInfo();
    return {
      dataSaverInfo,
    };
  },
});
</script>
