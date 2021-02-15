<template>
  <v-row justify="center">
    <v-dialog
      style='z-index:20001'
      v-model="this.$store.state.modalOpen"
      persistent
      hide-overlay
      max-width="400px"
      
    >
      <v-card>
        <v-card-title class="caption">
          Editar Notificação
        </v-card-title>
        <v-card-text >
          <v-container>
            <v-row>             
              <v-col cols="12">
                <v-text-field
                  label="Titulo*"
                  required
                  v-model="itemNotes.title"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  outlined                  
                  label="Descrição"
                  v-model="itemNotes.desc" 
                  rows="2"    
                  row-height="5"             
                ></v-textarea>
              </v-col>
              
            </v-row>
          </v-container>
          <!-- <small >*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="offmodal()"
          >
            Close
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>   
  export default {
    data: () => ({ }),
    computed: {
      itemNotes: {
        get () {                    
          return this.searchItem(this.$store.state.currentItem) || ''
        },
        set (value) {
          this.$store.commit('updateMessage', value)
        }
      }
    },    
    methods: {
      searchItem(item) {        
        return this.$store.state.hotSpots.find((i) => i.title == item.title)      
      },
      offmodal () {
        this.$store.commit('OFF_MODAL')
      }

    }
  }
</script>
<style lang="css" scoped>
</style>