<template>
  <div>
    <v-btn v-if="this.isMonthly === true" v-on:click="setPlan(true)" color="indigo" large>Monthly</v-btn>
    <v-btn v-if="this.isMonthly === false" v-on:click="setPlan(true)" outline color="indigo" large>Monthly</v-btn>
    <v-btn v-if="this.isMonthly === true" v-on:click="setPlan(false)" outline color="indigo" large>Annual</v-btn>
    <v-btn v-if="this.isMonthly === false" v-on:click="setPlan(false)" color="indigo" large>Annual</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMonthly: true
    }
  },
  methods: {
    setPlan(bool) {
      console.log(this.isMonthly)
      return this.isMonthly === bool
    }
  }
};
</script>