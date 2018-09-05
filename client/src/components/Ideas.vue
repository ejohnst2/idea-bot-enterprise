<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 v-for="idea in ideas" :key="idea._id">
        <v-card>
          <v-layout row align-center spacer>
            <v-flex xs2 sm2 md2>
              <v-avatar
                  slot="activator"
                  size="36px"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                    alt="Avatar"
                  >
              </v-avatar>
            </v-flex>

            <v-flex sm5 md3>
              <v-card-title>{{ idea.user }}</v-card-title>
            </v-flex>
          </v-layout>

          <div style="text-align: start; padding: 16px;">
            <div>{{ idea.text }}</div>
            <div>{{ idea.channel }}</div>
            <div>{{ idea.teamId }}</div>
          </div>

          <v-card-actions>
            <v-btn flat color="blue">share</v-btn>
            <v-btn flat color="green">endorse</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import IdeaServices from "@/services/IdeaServices";
export default {
  name: "ideas",
  data() {
    return {
      ideas: []
    };
  },
  mounted() {
    this.getIdeas();
  },
  methods: {
    async getIdeas() {
      const response = await IdeaServices.fetchIdeas();
      this.ideas = response.data;
    }
  }
};
</script>
