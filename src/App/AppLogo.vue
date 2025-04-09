<template>
  <div :style="{ height: `${size}px` }">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1000 1000"
      class="margin-auto"
      :class="{ loader: type === 'loader' }"
      :style="{ height: `${size}px` }"
    >
      <g class="tail" v-if="type === 'face'">
        <path
          xmlns="http://www.w3.org/2000/svg"
          d=" M 308.007 656.85 C 198.645 661.181 42.723 608.124 25.398 484.686 C 8.074 361.247 113.473 295.197 111.123 250.802 C 108.773 206.408 23.333 203.333 18.463 179.338 C 13.084 152.836 63.296 93.798 217.053 133.861 C 370.809 173.924 349.153 329.846 317.752 400.228 C 286.351 470.609 206.225 600.544 317.752 624.366 C 429.28 648.187 417.369 652.518 308.007 656.85 Z "
          fill="rgb(5, 55, 98)"
        />
      </g>
      <!-- Hexagon -->
      <path
        class="background"
        d=" M 239.872 955.336 L 144.901 790.843 L 49.931 626.349 L 144.901 461.856 L 239.872 297.362 L 429.812 297.362 L 619.753 297.362 L 714.724 461.856 L 809.694 626.349 L 714.724 790.843 L 619.753 955.336 L 429.812 955.336 L 239.872 955.336 Z "
        fill="rgb(0,84,159)"
        stroke-width="0"
        stroke="rgb(0,0,0)"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="3"
      />
      <g class="left-ear">
        <path
          d=" M 344.426 247.609 C 368.342 156.557 463.339 32.253 504.37 45.664 C 545.4 59.074 560.33 190.23 551.859 269.302 C 495.701 239.048 418.81 233.211 344.426 247.609 Z "
          fill="rgb(232, 49, 253)"
          stroke-width="0"
          stroke="rgb(0,0,0)"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="3"
        />
        <path
          d=" M 405.593 124.155 C 378.619 162.224 354.815 208.054 344.426 247.609 C 418.81 233.211 495.701 239.048 551.859 269.302 C 553.14 257.343 553.886 244.192 554.077 230.426 C 533.387 185.878 478.135 145.04 405.593 124.155 Z "
          fill="rgb(255, 205, 241)"
          stroke-width="0"
          stroke="rgb(0,0,0)"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="3"
        />
      </g>
      <g class="right-ear">
        <path
          d=" M 693.808 355.851 C 776.514 316.937 933.815 318.029 948.489 345.345 C 963.162 372.661 872.487 490.14 808.499 533.757 C 795.135 469.629 751.872 406.085 693.808 355.851 Z "
          fill="rgb(232, 49, 253)"
          stroke-width="0"
          stroke="rgb(0,0,0)"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="3"
        />
        <path
          d=" M 822.939 326.86 C 777.536 330.009 728.942 339.32 693.808 355.851 C 751.872 406.085 795.135 469.629 808.499 533.757 C 823.392 523.605 839.731 509.452 855.851 493.369 C 847.62 475.033 843.01 456.72 848.964 438.859 C 864.144 393.317 862.935 353.309 822.939 326.86 Z "
          fill="rgb(255, 205, 241)"
          stroke-width="0"
          stroke="rgb(0,0,0)"
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-miterlimit="3"
        />
      </g>
      <path
        v-if="type === 'text'"
        class="m"
        d=" M 254.162 652.315 L 254.162 652.315 L 244.075 652.315 L 244.075 652.315 Q 244.075 627.363 259.205 556.753 L 259.205 556.753 L 259.205 556.753 Q 274.336 486.144 274.336 476.587 L 274.336 476.587 L 274.336 476.587 Q 274.336 459.068 259.471 439.424 L 259.471 439.424 L 254.693 433.054 L 255.224 426.152 L 255.224 426.152 Q 283.892 418.188 347.069 418.188 L 347.069 418.188 L 347.069 418.188 Q 354.502 428.275 354.502 451.104 L 354.502 451.104 L 354.502 451.104 Q 402.283 415.534 430.421 415.534 L 430.421 415.534 L 430.421 415.534 Q 465.991 415.534 472.362 452.166 L 472.362 452.166 L 472.362 452.166 Q 486.696 440.486 509.79 428.01 L 509.79 428.01 L 509.79 428.01 Q 532.885 415.534 551.201 415.534 L 551.201 415.534 L 551.201 415.534 Q 569.517 415.534 581.727 427.479 L 581.727 427.479 L 581.727 427.479 Q 593.938 439.424 593.938 460.66 L 593.938 460.66 L 593.938 460.66 Q 593.938 481.896 582.258 530.739 L 582.258 530.739 L 582.258 530.739 Q 570.579 579.582 570.579 596.305 L 570.579 596.305 L 570.579 596.305 Q 570.579 613.029 575.357 613.029 L 575.357 613.029 L 575.357 613.029 Q 578.542 613.029 597.124 602.942 L 597.124 602.942 L 602.963 599.756 L 612.52 618.338 L 612.52 618.338 Q 598.716 632.141 575.091 644.617 L 575.091 644.617 L 575.091 644.617 Q 551.466 657.094 533.415 657.094 L 533.415 657.094 L 533.415 657.094 Q 493.598 657.094 493.598 611.967 L 493.598 611.967 L 493.598 611.967 Q 493.598 595.509 505.012 545.87 L 505.012 545.87 L 505.012 545.87 Q 516.427 496.231 516.427 481.1 L 516.427 481.1 L 516.427 481.1 Q 516.427 465.969 507.401 465.969 L 507.401 465.969 L 507.401 465.969 Q 492.005 465.969 472.362 477.649 L 472.362 477.649 L 472.362 477.649 Q 471.3 488.267 457.762 549.852 L 457.762 549.852 L 457.762 549.852 Q 444.224 611.436 444.224 645.414 L 444.224 645.414 L 444.224 645.414 Q 428.828 652.315 372.022 652.315 L 372.022 652.315 L 372.022 652.315 Q 370.96 646.476 370.96 624.178 L 370.96 624.178 L 370.96 624.178 Q 370.96 601.88 383.436 548.259 L 383.436 548.259 L 383.436 548.259 Q 395.912 494.638 395.912 480.304 L 395.912 480.304 L 395.912 480.304 Q 395.912 465.969 385.825 465.969 L 385.825 465.969 L 385.825 465.969 Q 369.898 465.969 350.786 478.711 L 350.786 478.711 L 350.786 478.711 Q 349.724 483.489 340.168 525.43 L 340.168 525.43 L 340.168 525.43 Q 321.055 609.313 321.055 644.883 L 321.055 644.883 L 321.055 644.883 Q 302.474 652.315 254.162 652.315 Z "
        fill="rgb(255,255,255)"
        stroke-width="0"
        stroke="rgb(0,0,0)"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="3"
      />
      <path
        v-if="type === 'text'"
        class="621"
        d=" M 325.323 704.698 L 325.323 704.698 L 325.323 704.698 Q 308.779 704.698 297.797 725.664 L 297.797 725.664 L 297.797 725.664 Q 286.815 746.63 281.965 780.859 L 281.965 780.859 L 281.965 780.859 Q 299.366 769.735 321.33 769.735 L 321.33 769.735 L 321.33 769.735 Q 343.294 769.735 355.131 784.14 L 355.131 784.14 L 355.131 784.14 Q 366.969 798.545 366.969 824.36 L 366.969 824.36 L 366.969 824.36 Q 366.969 850.174 346.431 871.568 L 346.431 871.568 L 346.431 871.568 Q 325.894 892.962 295.372 892.962 L 295.372 892.962 L 295.372 892.962 Q 235.185 892.962 235.185 817.656 L 235.185 817.656 L 235.185 817.656 Q 235.185 782.571 246.737 752.62 L 246.737 752.62 L 246.737 752.62 Q 258.29 722.669 279.398 704.841 L 279.398 704.841 L 279.398 704.841 Q 300.507 687.013 326.464 687.013 L 326.464 687.013 L 326.464 687.013 Q 345.861 687.013 360.979 696.854 L 360.979 696.854 L 360.979 696.854 Q 376.097 706.695 376.097 725.236 L 376.097 725.236 L 376.097 725.236 Q 376.097 738.358 369.251 745.489 L 369.251 745.489 L 369.251 745.489 Q 366.969 745.774 362.976 745.774 L 362.976 745.774 L 362.976 745.774 Q 342.153 745.774 331.884 734.649 L 331.884 734.649 L 336.162 707.836 L 336.162 707.836 Q 331.599 704.698 325.323 704.698 Z  M 304.215 789.702 L 304.215 789.702 L 304.215 789.702 Q 293.946 789.702 279.969 799.4 L 279.969 799.4 L 279.969 799.4 Q 278.828 813.378 278.828 834.914 L 278.828 834.914 L 278.828 834.914 Q 278.828 856.45 282.821 865.863 L 282.821 865.863 L 282.821 865.863 Q 286.815 875.276 296.228 875.276 L 296.228 875.276 L 296.228 875.276 Q 309.634 875.276 316.195 859.017 L 316.195 859.017 L 316.195 859.017 Q 322.756 842.758 322.756 822.791 L 322.756 822.791 L 322.756 822.791 Q 322.756 789.702 304.215 789.702 Z  M 482.78 894.673 L 482.78 894.673 L 482.78 894.673 Q 472.796 894.673 452.829 883.12 L 452.829 883.12 L 452.829 883.12 Q 432.861 871.568 419.74 867.86 L 419.74 867.86 L 419.74 867.86 Q 410.041 878.129 401.056 884.547 L 401.056 884.547 L 401.056 884.547 Q 392.071 890.965 388.933 890.965 L 388.933 890.965 L 388.933 890.965 Q 385.795 890.965 377.666 880.839 L 377.666 880.839 L 377.666 880.839 Q 369.536 870.712 369.536 865.435 L 369.536 865.435 L 369.536 865.435 Q 369.536 860.158 379.092 850.317 L 379.092 850.317 L 379.092 850.317 Q 388.648 840.476 401.199 840.476 L 401.199 840.476 L 401.199 840.476 Q 408.901 840.476 416.317 842.188 L 416.317 842.188 L 416.317 842.188 Q 436.284 826.214 454.255 795.835 L 454.255 795.835 L 454.255 795.835 Q 472.225 765.456 472.225 742.636 L 472.225 742.636 L 472.225 742.636 Q 472.225 729.8 464.524 722.526 L 464.524 722.526 L 464.524 722.526 Q 456.822 715.253 445.84 715.253 L 445.84 715.253 L 445.84 715.253 Q 434.858 715.253 424.446 722.384 L 424.446 722.384 L 424.446 722.384 Q 414.035 729.515 406.619 742.066 L 406.619 742.066 L 393.497 736.361 L 393.497 736.361 Q 399.202 718.39 419.312 702.702 L 419.312 702.702 L 419.312 702.702 Q 439.422 687.013 464.096 687.013 L 464.096 687.013 L 464.096 687.013 Q 488.77 687.013 502.604 700.42 L 502.604 700.42 L 502.604 700.42 Q 516.439 713.826 516.439 734.079 L 516.439 734.079 L 516.439 734.079 Q 516.439 748.626 508.024 765.884 L 508.024 765.884 L 508.024 765.884 Q 499.609 783.141 486.488 798.83 L 486.488 798.83 L 486.488 798.83 Q 461.956 827.64 437.425 847.322 L 437.425 847.322 L 437.425 847.322 Q 473.081 857.02 492.478 857.02 L 492.478 857.02 L 492.478 857.02 Q 497.898 857.02 500.465 854.025 L 500.465 854.025 L 500.465 854.025 Q 503.032 851.03 508.452 840.191 L 508.452 840.191 L 517.865 842.188 L 517.865 842.188 Q 515.012 894.673 482.78 894.673 Z  M 546.39 890.394 L 546.39 890.394 L 543.537 890.394 L 543.537 890.394 Q 544.108 869.571 559.796 801.255 L 559.796 801.255 L 559.796 801.255 Q 575.485 732.938 575.485 719.531 L 575.485 719.531 L 575.485 719.531 Q 575.485 712.971 575.2 711.544 L 575.2 711.544 L 575.2 711.544 Q 559.511 720.102 540.97 738.643 L 540.97 738.643 L 540.97 738.643 Q 537.547 736.931 533.981 732.51 L 533.981 732.51 L 533.981 732.51 Q 530.416 728.089 528.704 724.666 L 528.704 724.666 L 526.993 721.243 L 574.629 690.721 L 574.629 690.721 Q 595.737 687.013 617.987 687.013 L 617.987 687.013 L 617.987 687.013 Q 621.41 692.718 621.41 705.126 L 621.41 705.126 L 621.41 705.126 Q 621.41 717.534 614.279 748.484 L 614.279 748.484 L 614.279 748.484 Q 607.147 779.433 599.446 817.514 L 599.446 817.514 L 599.446 817.514 Q 591.744 855.594 590.888 884.689 L 590.888 884.689 L 590.888 884.689 Q 580.619 890.394 546.39 890.394 Z"
        fill-rule="evenodd"
        fill="rgb(255,255,255)"
        stroke-width="0"
        stroke="rgb(0,0,0)"
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-miterlimit="3"
      />
      <g class="face" v-if="type === 'face'">
        <!-- eyes -->
        <path
          class="eye"
          xmlns="http://www.w3.org/2000/svg"
          d=" M 258.486 637.939 C 258.486 610.854 270.48 588.865 285.253 588.865 C 300.027 588.865 312.021 610.854 312.021 637.939 C 312.021 665.024 300.027 687.013 285.253 687.013 C 270.48 687.013 258.486 665.024 258.486 637.939 Z "
          fill="rgb(0,0,0)"
        />
        <path
          class="eye"
          xmlns="http://www.w3.org/2000/svg"
          d=" M 547.604 637.939 C 547.604 610.854 559.598 588.865 574.372 588.865 C 589.145 588.865 601.139 610.854 601.139 637.939 C 601.139 665.024 589.145 687.013 574.372 687.013 C 559.598 687.013 547.604 665.024 547.604 637.939 Z "
          fill="rgb(0,0,0)"
        />
        <!-- eyelids -->
        <rect
          class="eyelids"
          xmlns="http://www.w3.org/2000/svg"
          x="219"
          y="453"
          width="424"
          height="123"
          fill="rgb(0,84,159)"
        />
        <!-- nose -->
        <path
          xmlns="http://www.w3.org/2000/svg"
          d=" M 489.764 745.019 C 489.764 759.95 445.715 793.531 429.813 793.531 C 413.91 793.531 369.861 759.95 369.861 745.019 C 369.861 730.034 489.764 730.836 489.764 745.019 Z "
          fill="rgb(0,0,0)"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      validator: (v: string) => ["loader", "face", "text"].indexOf(v) !== -1,
    },
    size: {
      type: [String, Number],
      default: 100,
    },
  },
});
</script>

<style scoped>
.margin-auto {
	 margin: auto;
}
 div {
	 position: relative;
	 overflow: hidden;
}
 svg {
	 width: 100%;
	 padding-top: 5px;
}
 svg.loader {
	 animation: load-logo 1s infinite;
}
 svg .tail {
	 transform-origin: 100% 100%;
	 transform: translate(0) scale(1) rotate(0);
	 animation: wiggle-tail 10s infinite ease-in-out;
	 animation-delay: 0s;
}
 svg .eyelids {
	 transform-origin: 100% 100%;
	 transform: translate(0) scale(1) rotate(0);
	 animation: close-eyes 30s infinite ease-in-out;
	 animation-delay: 0s;
}
 svg .left-ear, svg .right-ear {
	 transform-origin: 50% 50%;
	 transform: translate(0) scale(1) rotate(0);
	 transition: all 0.5s ease !important;
}
 svg .left-ear {
	 transform: translate(0) scale(1) rotate(0);
	 animation: wiggle-left 15s infinite ease-in-out;
	 animation-delay: 1.05s;
}
 svg .right-ear {
	 transform: translate(0) scale(1) rotate(0);
	 animation: wiggle-right 15s infinite ease-in-out;
	 animation-delay: 1s;
}
 @-moz-keyframes wiggle-right {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(0) rotateZ(-10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
}
 @-webkit-keyframes wiggle-right {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(0) rotateZ(-10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
}
 @-o-keyframes wiggle-right {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(0) rotateZ(-10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
}
 @keyframes wiggle-right {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(0) rotateZ(-10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
}
 @-moz-keyframes wiggle-left {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(0) rotateZ(-10deg);
	}
}
 @-webkit-keyframes wiggle-left {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(0) rotateZ(-10deg);
	}
}
 @-o-keyframes wiggle-left {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(0) rotateZ(-10deg);
	}
}
 @keyframes wiggle-left {
	 from, to, 6% {
		 transform: translate(0) rotateZ(0deg);
	}
	 1.7999999999999998%, 3%, 4.5% {
		 transform: translate(10px, -10px) rotateZ(10deg);
	}
	 2.4%, 3.5999999999999996% {
		 transform: translate(0) rotateZ(-10deg);
	}
}
 @-moz-keyframes load-logo {
	 from, to {
		 transform: scale(0.7) rotate(0deg);
		 opacity: 0.2;
	}
	 50% {
		 transform: scale(1) rotate(-10deg);
		 opacity: 1;
	}
}
 @-webkit-keyframes load-logo {
	 from, to {
		 transform: scale(0.7) rotate(0deg);
		 opacity: 0.2;
	}
	 50% {
		 transform: scale(1) rotate(-10deg);
		 opacity: 1;
	}
}
 @-o-keyframes load-logo {
	 from, to {
		 transform: scale(0.7) rotate(0deg);
		 opacity: 0.2;
	}
	 50% {
		 transform: scale(1) rotate(-10deg);
		 opacity: 1;
	}
}
 @keyframes load-logo {
	 from, to {
		 transform: scale(0.7) rotate(0deg);
		 opacity: 0.2;
	}
	 50% {
		 transform: scale(1) rotate(-10deg);
		 opacity: 1;
	}
}
 @-moz-keyframes wiggle-tail {
	 from, to, 34% {
		 transform: translate(0) rotateZ(0deg);
	}
	 6%, 10%, 14%, 18%, 22% {
		 transform: translate(0) rotateZ(-1deg);
	}
	 8%, 12%, 16%, 20%, 24% {
		 transform: translate(0) rotateZ(1deg);
	}
	 26%, 30% {
		 transform: translate(0) rotateZ(-0.6deg);
	}
	 28%, 32% {
		 transform: translate(0) rotateZ(0.6deg);
	}
}
 @-webkit-keyframes wiggle-tail {
	 from, to, 34% {
		 transform: translate(0) rotateZ(0deg);
	}
	 6%, 10%, 14%, 18%, 22% {
		 transform: translate(0) rotateZ(-1deg);
	}
	 8%, 12%, 16%, 20%, 24% {
		 transform: translate(0) rotateZ(1deg);
	}
	 26%, 30% {
		 transform: translate(0) rotateZ(-0.6deg);
	}
	 28%, 32% {
		 transform: translate(0) rotateZ(0.6deg);
	}
}
 @-o-keyframes wiggle-tail {
	 from, to, 34% {
		 transform: translate(0) rotateZ(0deg);
	}
	 6%, 10%, 14%, 18%, 22% {
		 transform: translate(0) rotateZ(-1deg);
	}
	 8%, 12%, 16%, 20%, 24% {
		 transform: translate(0) rotateZ(1deg);
	}
	 26%, 30% {
		 transform: translate(0) rotateZ(-0.6deg);
	}
	 28%, 32% {
		 transform: translate(0) rotateZ(0.6deg);
	}
}
 @keyframes wiggle-tail {
	 from, to, 34% {
		 transform: translate(0) rotateZ(0deg);
	}
	 6%, 10%, 14%, 18%, 22% {
		 transform: translate(0) rotateZ(-1deg);
	}
	 8%, 12%, 16%, 20%, 24% {
		 transform: translate(0) rotateZ(1deg);
	}
	 26%, 30% {
		 transform: translate(0) rotateZ(-0.6deg);
	}
	 28%, 32% {
		 transform: translate(0) rotateZ(0.6deg);
	}
}
 @-moz-keyframes close-eyes {
	 1%, 19%, 21%, 39%, 41%, 59%, 61%, 79%, 81%, 82%, 84%, 99% {
		 transform: translate(0) rotateZ(0deg);
	}
	 20%, 40%, 60%, 80%, 83%, 100%, 0% {
		 transform: translateY(12%) rotateZ(0deg);
	}
}
 @-webkit-keyframes close-eyes {
	 1%, 19%, 21%, 39%, 41%, 59%, 61%, 79%, 81%, 82%, 84%, 99% {
		 transform: translate(0) rotateZ(0deg);
	}
	 20%, 40%, 60%, 80%, 83%, 100%, 0% {
		 transform: translateY(12%) rotateZ(0deg);
	}
}
 @-o-keyframes close-eyes {
	 1%, 19%, 21%, 39%, 41%, 59%, 61%, 79%, 81%, 82%, 84%, 99% {
		 transform: translate(0) rotateZ(0deg);
	}
	 20%, 40%, 60%, 80%, 83%, 100%, 0% {
		 transform: translateY(12%) rotateZ(0deg);
	}
}
 @keyframes close-eyes {
	 1%, 19%, 21%, 39%, 41%, 59%, 61%, 79%, 81%, 82%, 84%, 99% {
		 transform: translate(0) rotateZ(0deg);
	}
	 20%, 40%, 60%, 80%, 83%, 100%, 0% {
		 transform: translateY(12%) rotateZ(0deg);
	}
}
</style>
