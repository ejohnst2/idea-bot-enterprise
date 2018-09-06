<template>
  <v-container>
    <v-layout wrap align-center>
      <v-flex xs12 lg12>
        <v-btn v-if="this.isMonthly === true" @click="setPlan(true)" color="indigo" large>Monthly</v-btn>
        <v-btn v-if="this.isMonthly === false" @click="setPlan(true)" outline color="indigo" large>Monthly</v-btn>
        <v-btn v-if="this.isMonthly === true" @click="setPlan(false)" outline color="indigo" large>Annual</v-btn>
        <v-btn v-if="this.isMonthly === false" @click="setPlan(false)" color="indigo" large>Annual</v-btn>
      </v-flex>
      <v-flex xs12 sm6 md4 offset-md2>
        <div>Free</div>
      </v-flex>
      <v-flex xs12 sm6 md4>
        <div>Super Ideators</div>
        <v-select
          :items="options"
          label="Number of respondents"
          solo
        ></v-select>
      </v-flex>

    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      isMonthly: false,
      count: 3,
      options: [3, 5, 8, 13, 21, 34],
      price: 7
    }
  },
  methods: {
    setPlan() {
      this.isMonthly = !this.isMonthly
    }
  }
};
</script>