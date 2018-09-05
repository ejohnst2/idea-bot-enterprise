<template>
  <v-toolbar fixed dark scroll-off-screen>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Ideas Init</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat :to="'/'">Ideas</v-btn>
      <v-btn flat :to="'Billing'">Billing</v-btn>
      <v-btn flat :to="'Settings'">Settings</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>
