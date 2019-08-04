<template>
  <div class="swiper-slide">
    <slot />
  </div>
</template>

<script>
export default {
  mounted() {
    this.update();
  },
  updated() {
    this.update();
  },
  methods: {
    update() {
      if (this.$parent && this.$parent.swiper) {
        this.$parent.update();
      }
    }
  }
};
</script>

<style>
</style>
