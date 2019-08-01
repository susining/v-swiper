<template>
  <div class="component-swiper">
    <div ref="swiper" class="swiper-container">
      <div class="swiper-wrapper">
        <slot />
      </div>
      <slot name="container" />
    </div>
    <slot name="outer" />
  </div>
</template>

<script>
import Swiper from "swiper/dist/js/swiper.min.js";
import "swiper/dist/css/swiper.css";

// as of swiper 4.0.7
// http://idangero.us/swiper/api/#events
const DEFAULT_EVENTS = [
  "beforeDestroy",
  "slideChange",
  "slideChangeTransitionStart",
  "slideChangeTransitionEnd",
  "slideNextTransitionStart",
  "slideNextTransitionEnd",
  "slidePrevTransitionStart",
  "slidePrevTransitionEnd",
  "transitionStart",
  "transitionEnd",
  "touchStart",
  "touchMove",
  "touchMoveOpposite",
  "sliderMove",
  "touchEnd",
  "click",
  "tap",
  "doubleTap",
  "imagesReady",
  "progress",
  "reachBeginning",
  "reachEnd",
  "fromEdge",
  "setTranslate",
  "setTransition",
  "resize"
];

export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      swiper: null
    };
  },
  mounted() {
    this.createSiwper();
  },
  updated() {
    this.update();
  },
  beforeDestory() {
    this.$nextTick(() => {
      this.destorySwiper();
    });
  },
  methods: {
    createSiwper() {
      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiper, this.options);
      }
    },
    updateSwiper() {
      if (this.swiper) {
        this.swiper.update && this.swiper.update();
        this.swiper.navigation && this.swiper.navigation.update();
        this.swiper.pagination && this.swiper.pagination.render();
        this.swiper.pagination && this.swiper.pagination.update();
      }
    },
    destorySwiper() {
      if (this.swiper) {
        this.swiper.destroy && this.swiper.destroy();
        delete this.swiper;
      }
    },
    update() {
      this.updateSwiper();
    },
    bindEvents() {
      const self = this;
      DEFAULT_EVENTS.forEach(event => {
        self.swiper.on(event, function() {
          self.$emit(event, ...arguments);
          self.$emit(
            eventName.replace(/([A-Z])/g, "-$1").toLowerCase(),
            ...arguments
          );
        });
      });
    }
  }
};
</script>

<style lang="scss">
.component-swiper {
  position: relative;
}
</style>
