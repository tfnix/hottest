<template>
  <v-app>

    <!-- 

      App bar with top menus. Fake1, Fake2 etc
      All menus fires menuCliked() with $event as param.
    -->
    <v-app-bar
      color="white" flat >    
      <div class="d-flex align-center" style="border: 1px none">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
          @click="menuClicked($event)"
        />
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
          @click="menuClicked($event)"
        />
      </div>

      <v-spacer></v-spacer>

      <div>
        <v-btn
          target="_blank"
          text
          color="grey"
          hot-enable="1"  
          @click="menuClicked($event)" 
        >
          <span class="mr-2">Link Fake #1</span>          
        </v-btn>

        <v-btn
          target="_blank"
          text
          color="grey"
          hot-enable="1"  
          class="test-pos" 
          @click="menuClicked($event)"
          
        >
          <span class="mr-2">Link Fake #2</span>
        </v-btn>

        <v-btn
          target="_blank"
          text
          color="grey"
          hot-enable="1"   
          @click="menuClicked($event)"
        >
          <span class="mr-2">Link Fake #3</span>
        </v-btn>

        <v-btn          
          target="_blank"
          text
          color="grey"
          hot-enable="1"   
          @click="menuClicked($event)"
        >
          <span class="mr-2">Link Fake #4</span>
        </v-btn>    

      </div>

      <v-spacer></v-spacer>
    </v-app-bar>


    <!-- Self Explanatory -->
    <v-main style="height: 3000px"> 
      <v-divider inset></v-divider>            
      <CreateHotspot/>
      <HotspotList class="list-hotspots"/>
    </v-main>
  </v-app>
</template>

<script>

import CreateHotspot from './components/CreateHotspot';
import HotspotList from './components/HotspotList';

export default {
  name: 'App',

  components: {
    CreateHotspot,
    HotspotList,
  },

  data: () => ({ }),  
  methods: {
    menuClicked(e) {
      // In case of Hotspot creation is enabled 
      // This will return 
      if (this.$store.state.enabledHotCreation) return      
      e;
    },

  },

};
</script>

<style>
  body {
    font-family: montserrat;
  }
</style>
