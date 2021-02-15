import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hotSpots: [],
    snackbar: false,
    modalOpen: false,
    currentItem: {}, 
    enabledHotCreation: false
  },
  mutations: {
    // Used for window.load event
    RELOAD (state, data) {
      state.hotSpots = data

    },
    // Used to save edited hotspot
    UPDATE_MESSAGE (state, item) {            
      if (state.hotSpots.length==0) return { title: '', desc: ''}
      state.hotSpots.find((i, idx) => { 
        if (i.title === item.title) {
          state.hotSpots[idx].title = item.title
          console.log(state.hotSpots[idx].title)
        }
      }) 
    },
    // Used to save edited Notification 
    SET_NOTIFICATION (state, payload) {
      state.hotSpots.find( (item, index) => { 
        if (item.title === payload.title) {
          state.hotSpots[index].title = payload.title
          state.hotSpots[index].desc = payload.desc                   
        }
      })

    },
    // Adds new hotspot to the state
    ADD_HOTSPOT (state, payload) {
      state.hotSpots.push(payload)
    },
    
    // Open/Close Shopping Cart modal
    ON_MODAL (state, payload){
      state.currentItem = payload      
      state.modalOpen = true
    },
    OFF_MODAL (state){
      state.modalOpen = false
    },
    
    // TOGGLE HOT CREATION
    TOGGLE_HOTCREATION (state) {
      state.enabledHotCreation = !state.enabledHotCreation;
    },
    

   },
  actions: {
  },
  getters: {

    getCurrentItem: (state) => {
      if (state.hotSpots.length==0) {
        console.log('empty')
      }
      console.log('hi')
      return state.hotSpots.find(item => item.title === state.currentItem.title)
    },
    getHotspotTotal: (state) => {
      return state.hotSpots.length
    },
    getHotspotCreationState: (state) => {
      return state.enabledHotCreation
    }
    

  },
  modules: {
  }
})
