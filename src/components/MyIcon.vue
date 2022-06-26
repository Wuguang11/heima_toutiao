<template >
  <i class="toutiao" :class="'toutiao-' + name"></i>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  created () { },
  data () {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped>
i {
  font-size: 37px;
  margin-right: 40px;
}
</style>
