<template>
  <div>
    <v-btn v-if="this.isMonthly === true" @click="setPlan(true)" color="indigo" large>Monthly</v-btn>
    <v-btn v-if="this.isMonthly === false" @click="setPlan(true)" outline color="indigo" large>Monthly</v-btn>
    <v-btn v-if="this.isMonthly === true" @click="setPlan(false)" outline color="indigo" large>Annual</v-btn>
    <v-btn v-if="this.isMonthly === false" @click="setPlan(false)" color="indigo" large>Annual</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMonthly: false
    }
  },
  methods: {
    setPlan() {
      this.isMonthly = !this.isMonthly
    }
  }
};
</script>