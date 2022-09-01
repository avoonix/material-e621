<template>
  <div ref="resultDiv" />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  watchEffect,
} from "vue";
import * as d3 from "d3";

export default defineComponent({
  props: {
    wordPositions: {
      type: Array as PropType<any[]>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    const resultDiv = ref<HTMLDivElement>();
    watchEffect(() => {
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      if (!resultDiv.value) {
        return;
      }
      resultDiv.value.innerHTML = "";

      d3.select(resultDiv.value)
        .append("svg")
        .attr("width", props.width)
        .attr("height", props.height)
        .append("g")
        .attr(
          "transform",
          "translate(" + props.width / 2 + "," + props.height / 2 + ")",
        )
        .selectAll("text")
        .data(props.wordPositions)
        .enter()
        .append("text")
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .style("font-family", "sans-serif")
        .style("opacity", 1)
        .attr("text-anchor", "middle")
        .attr("transform", function (d: any) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        // .style("fill", function(t) {
        //         // return fill(t.text)
        //         return t.length < 6 ? "red": "blue"
        //     })
        .attr("fill", (d) => color(d.text))

        .text(function (d: any) {
          return d.text;
        });
    });

    return {
      resultDiv,
    };
  },
});
</script>

<style scoped>
div :deep(svg) {
  outline: 1px solid rgba(0, 0, 0, 0.3);
}
</style>
