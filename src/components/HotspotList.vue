<template >
  <v-container >
    <v-row class="text-left list-hotspots the-list-all">
      <v-col 
        cols="6"
        offset="3" >
        <v-list @mouseover="teste()" >
          <v-subheader style="background-color: lightgrey; color: grey">
            List of Hotspots
          </v-subheader>
          <v-list-item-group
            v-model="selectedItem"
            color="primary"
          >
            <v-list-item class="list-hotspots"
              v-for="(item, i) in this.$store.state.hotSpots"
              :key="i" @click="selectItem(item)">                

              <v-list-item-content  >
                <v-list-item-title  class="font-weight-bold" v-text="item.title" style="font-size: 1.4em"></v-list-item-title>
              </v-list-item-content>
                
              <v-list-item-action class="d-inline-flex flex-row">
                <v-btn   
                  small
                  @click="editItem(item)">              
                  <span style="color: blue; font-size: .7em" >
                    Edit
                  </span>                      
                </v-btn>                
                <v-btn   
                  small
                  @click="deleteItem(item) "
                  class="ml-5">              
                  <span style="color: blue; font-size: .7em ">
                    Delete
                  </span>                      
                </v-btn>
              </v-list-item-action>

            </v-list-item>

          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import EventBus from './EventBus.js';
  

  export default {    
    data: () => ({
      selectedItem: ''
    }),
    updated() {
      this.walk();

    },
    
    mounted() {
      var that =  this;
      EventBus.$on('WALK_DOM', function (payLoad) {        
        payLoad;       
        that.walk()
      });

    },
    
    methods: {   
      walk() {
      function theDOMElementWalker(node) {

        if (node.nodeType == 1) {       
          node = node.firstChild;        
          while (node) {
            theDOMElementWalker(node);
            if (node.nodeType == Node.TEXT_NODE && !node.nodeValue.trim()) {
                return;
              }     
            if (node.nodeType == Node.ELEMENT_NODE) {
              //console.log(node)
              node.classList.add('list-hotspots') 
            }
            node = node.nextSibling;
          }
        }
      }      

      var el = document.querySelector('.the-list-all') 
      theDOMElementWalker(el)        

      },

      selectItem(item) {        
        EventBus.$emit('SELECT_ITEM', item);
      },
      editItem(item) {
        if (this.$store.state.enabledHotCreation) return
        this.$store.commit('ON_MODAL', item)
      },      
      deleteItem(item) {        
        if (this.$store.state.enabledHotCreation) return
        EventBus.$emit('DELETE_ITEM', item);
        for (var i =0; i < this.$store.state.hotSpots.length; i++)
          if (this.$store.state.hotSpots[i].title === item.title) {
            this.$store.state.hotSpots.splice(i,1);
              break;
          } 
        localStorage["hotspots"] = JSON.stringify(this.$store.state.hotSpots);        
      }
    }
  }
</script>
<style lang="scss">
</style>
