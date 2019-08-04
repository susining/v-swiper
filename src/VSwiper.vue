<template>
  <div class="v-swiper">
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
import Swiper from "swiper";

// http://idangero.us/swiper/api/#events
const SWIPER_EVENTS = [
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
    },
    manulCreate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      swiper: null
    };
  },
  mounted() {
    if (!this.manulCreate) {
      this.createSiwper();
    }
  },
  updated() {
    this.update();
  },
  beforeDestory() {
    this.$nextTick(() => {
      this.destroy();
    });
  },
  methods: {
    create() {
      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiper, this.options);
        this.bindEvents();
      }
    },
    destroy() {
      if (this.swiper) {
        this.swiper.destroy && this.swiper.destroy();
        delete this.swiper;
      }
    },
    update() {
      if (this.swiper) {
        this.swiper.update && this.swiper.update();
        this.swiper.navigation && this.swiper.navigation.update();
        this.swiper.pagination && this.swiper.pagination.render();
        this.swiper.pagination && this.swiper.pagination.update();
      }
    },
    bindEvents() {
      const self = this;
      SWIPER_EVENTS.forEach(event => {
        self.swiper.on(event, function() {
          self.$emit(event, ...arguments);
          self.$emit(
            event.replace(/([A-Z])/g, "-$1").toLowerCase(),
            ...arguments
          );
        });
      });
    }
  }
};
</script>

<style>
.v-swiper {
  position: relative;
}
</style>
