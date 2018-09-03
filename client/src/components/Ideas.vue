<template>
  <div class="ideas">
    <div v-for="idea in ideas" :key="idea._id">
      <div class="idea">
        <span>{{ idea.user }}</span>
        <span>{{ idea.text }}</span>
        <span>{{ idea.channel }}</span>
        <span>{{ idea.teamId }}</span>
      </div>
    </div>
  </div>

</template>

<script>
  import IdeaServices from '@/services/IdeaServices'
  export default {
    name: 'ideas',
    data() {
      return {
        ideas: []
      }
    },
    mounted() {
      this.getIdeas()
    },
    methods: {
      async getIdeas() {
        const response = await IdeaServices.fetchIdeas()
        this.ideas = response.data
      }
    }
  }
</script>
<style>
  .ideas {
    display: flex;
    flex-direction: row;
  }
</style>