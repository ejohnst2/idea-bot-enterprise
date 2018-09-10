<template>
  <v-container fluid>

    <v-container>
      <v-text-field
        hide-details
        prepend-inner-icon="search"
        single-line
        type="text"
        v-model="search"
        placeholder="Search ideas.."
        solo
        clearable
        @click:clear="clearSearch"
      >
      <div>clear</div>
      </v-text-field>
    </v-container>

    <v-layout row wrap>
      <v-flex xs12 sm6 md4 v-for="idea in filteredIdeas" :key="idea._id">
        <v-card>
          <v-layout row align-center spacer v-on:click="search = ( idea.user )" class="clickable">
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
      search: "",
      ideas: [],
      users: []
    };
  },
  mounted() {
    this.fetchIdeas();
  },
  methods: {
    async fetchIdeas() {
      const response = await IdeaServices.getIdeas();
      this.ideas = response.data;
    },
    clearSearch() {
      this.search = ''
    }
  },
  computed: {
    // filter the ideas by the idea text or user name
    filteredIdeas() {
      if (this.search) {
        return this.ideas.filter(idea => {
          if (idea.text != null) {
            return (
              idea.text.toLowerCase().includes(this.search.toLowerCase()) ||
              idea.user.toLowerCase().includes(this.search.toLowerCase())
            );
          }
        });
      } else {
        return this.ideas
      }
    }
  }
};
</script>
<style>
  .clickable {
    cursor: pointer;
  }
</style>
