<template>
  <div class="fps-counter">fps: {{ fps }}</div>
</template>

<script>
export default {

  name: "FpsCounter",

  data() {
    return {
      times: [],
      fps: 0
    };
  },

  mounted() {
    this.tick();
  },

  methods: {

    tick() {

      const now = performance.now();

      while (this.times.length > 0 && this.times[0] <= now - 1000) {
        this.times.shift();
      }

      this.times.push(now);
      this.fps = this.times.length;

      requestAnimationFrame(this.tick);

    }

  }

};
</script>

<style lang="scss">
.fps-counter {
  position: fixed;
  top: .01em;
  right: .01em;
  z-index: 999;
  font-weight: bolder;
  font-size: 16px;
  color: #fff;
  text-align: center;
}
</style>
