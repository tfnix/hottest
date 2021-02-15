<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">     

        <!-- 
          toggleHotCreation() toggle the Hotspot Creation mode.
          See the method comments for more details.           
          -->
        <v-btn
          @click="toggleHotCreation($event)"
          large dark rounded 
          color="primary"
          elevation="5" v-if="!this.$store.state.enabledHotCreation"                 
        >
          <v-icon class="mr-2">
            mdi-plus
          </v-icon>
          Criar Hotspot            
        </v-btn>     
        
        <v-btn
          @click="toggleHotCreation($event)"
          large dark rounded
          color="secondary"
          elevation="5"          
          v-if="this.$store.state.enabledHotCreation"           
        >
          <v-icon dark class="mr-2">
            mdi-plus
          </v-icon>
          Parar Criação de Hotspots
        </v-btn>     

      </v-col>

    </v-row>
    
    <hotspotModal />

  </v-container>
</template>

<script>

  import EventBus from './EventBus.js';
  import hotspotModal from './HotspotDescriptionModal'
  import { dragElement } from '../helpers/dragndrop.js'
  import { getXPathForElement, getElementByXPath  } from '../helpers/xpath.js'

  export default {
    components: {
      hotspotModal
    },
    data: () => ({                      
      hotCount: 0,   
      dialogOpen: false,
    }),
    created() {
      window.addEventListener("resize", this.adjustPosition);     
      window.addEventListener("scroll", this.adjustPosition);  
      window.addEventListener("load", this.onWindowLoad);
    },
    destroyed() {
      window.removeEventListener("resize", this.adjustPosition);
      window.removeEventListener("scroll", this.adjustPosition);  
      window.removeEventListener("load", this.onWindowLoad);
    },   

    mounted () {      
      var that =  this;
      EventBus.$on('DELETE_ITEM', function (payLoad) {        
        that.deleteItem(payLoad)
      });

      EventBus.$on('SELECT_ITEM', function (payLoad) {        
        that.activeHotspot(payLoad)
      });


    },
    computed: {
      getHotspotTotal () {
        return this.$store.getters.getHotspotTotal
      }

    },    
    methods: {   
      toggleHotCreation() {

        /* 
          Add events functions for Select Elements(addBorder(), removeBorder())
          and for save the hotspot (saveHotSpot())
         */
        if(!this.$store.state.enabledHotCreation) {        
          document.addEventListener('mouseover', this.addBorder)
          document.addEventListener('mouseout',  this.removeBorder)    
          document.addEventListener('click',  this.saveHotSpot) 
        } else {      

        // Removes events functions 
          document.removeEventListener('mouseover', this.addBorder)
          document.removeEventListener('mouseout', this.removeBorder) 
          document.removeEventListener('click',  this.saveHotSpot)                 
          
        }
        
        /* 
         1. Commits the TOGGLE mutation 
         2. Clear remaining border classes of all Elements with fixClearClass_aux()
         3. hotCount is set to 0 to avoid hotspot creation 

        */

        this.$store.commit('TOGGLE_HOTCREATION')   
        this.fixClearClass_aux();
        this.hotCount =0;
      },      
      addBorder(e) {        
        /*
          Add the border class to clicked (e)lement on mouseover event

         */
        if (e.target.classList.contains('hspots') || e.target.classList.contains('list-hotspots')) return       
        e.target.classList.add("border")
      },
      removeBorder(e) {
        /*
          Removes the border class for the (e)lement on mouseout event

        */
        e.target.classList.remove("border")
      },        
      saveHotSpot(e) {     
        // Test for check if Hotspot Creation mode is enabled
        // TODO: Maybe change to: if (this.$store.state.enabledCreation) return  ???
        if (this.hotCount == 0) { 
          this.hotCount = 1
          return 
        }

        /* 
           Test to avoid create hotspot in certain areas 
           Like the hotspot itself and the List of Hotspots component

         */
        if (e.target.classList.contains('hspots') || e.target.classList.contains('list-hotspots')) return   
        /* 
          1. Saves the mouse X and Y position
          2. Create the generic Payload plus the critical data (xpath, unique)
          3. Save the Payload to the store
          4.
        */

        this.mouseX = e.pageX
        this.mouseY = e.pageY      

        var payload = { 
            title: 'hotspot #' + (this.getHotspotTotal + 1),
            desc: 'n/a',
            mouseX : this.mouseX,
            mouseY : this.mouseY,
            xPath  : getXPathForElement(e.target), 
            unique: this.$uuid.v4(),
            active : true                  
        }
        this.$store.commit('ADD_HOTSPOT', payload)
        
        /* 
          1. Initialize visual clues for the hotspots listed on $store.state.hotSpots
          2. ajustPostion() 
          3. toggle off Hot Creation mode
          4. Save to the LocalStorage
          5. WALK_DOM prevents clicks on Hotspot List area
        */
        this.initializeAnimatedHotspots(payload)               
        this.adjustPosition()
        localStorage["hotspots"] = JSON.stringify(this.$store.state.hotSpots);
        this.toggleHotCreation()   
        EventBus.$emit('WALK_DOM', 'nothing');
        
      },        

      initializeAnimatedHotspots(item) {

        /* 
          This function add visual clues to hotspots
          Thrre elements are created for this: 
                The Container, circleBorder and circleSolid

  
          1. Container element has items style left and top attached to item.mouseX and mouseY
             This allow it to be render in the right location

             It has some attributes: 
                  a) hspots class: allow identify the element as a hotspot
                  b) hotspotContainer + item.unique: allow uniquely identify the Container
                  c) xpath: allow the hotstpot itself being bounded to the clicked element

            When clicked it open a MessageBox (the msgbox below)

          2. CircleSolid and CircleBorder are the animated visuals clues


         */
        
        var hotspotContainer = document.createElement("div");  
        hotspotContainer.setAttribute('class', 'hotspotContainer hspots hotspotContainer' + item.unique);  
        hotspotContainer.setAttribute('data-unique', 'hotspotContainer' + item.unique)   
        hotspotContainer.setAttribute('x-path', item.xPath)   
        hotspotContainer.style.left = item.mouseX + 'px';      
        hotspotContainer.style.top = item.mouseY + 'px'; 

        var circleSolid = document.createElement("div");
        var circleBorder = document.createElement("div");

        circleBorder.setAttribute('class','circle-border hspots circle-border' + item.unique),                        
        circleBorder.setAttribute('data-unique', 'circle-border' + item.unique)    
        circleBorder.setAttribute('data-title', item.title);  
        // circleBorder.style.animationDelay = (Math.random() * (0.3 - 0.6) + 0.6).toFixed(4) + 's'
        circleBorder.style.animationDelay = '.3s'

        circleSolid.setAttribute('class','circle-solid hspots circle-solid' + item.unique),                
        circleSolid.setAttribute('data-unique', 'circle-solid' + item.unique)    
        circleSolid.setAttribute('data-title', item.title);  
        circleSolid.style.animationDelay = (Math.random() * (0.3 - 0.6) + 0.6).toFixed(4) + 's'    
        
        circleBorder.appendChild(circleSolid)
        hotspotContainer.append(circleBorder);

        var outThis = this; 
        hotspotContainer.onclick = function() {
          
          if (outThis.$store.state.enabledHotCreation) return
          if (outThis.dialogOpen) return
          outThis.dialogOpen = true
          outThis.activeHotspot(item)
          
          // Allow click-thru hotspots visuals          
          var passthruElement = getElementByXPath(item.xPath);
          passthruElement.click()     

          // msgbox
          var msgbox = document.createElement("div");
          msgbox.setAttribute('class','hot-msg');              
          msgbox.setAttribute('data-unique', item.unique)   
          msgbox.style.top = item.mouseY + 'px';
          msgbox.style.left = item.mouseX + 'px';  

          // title                
          var title = document.createElement("h3")
          title.setAttribute('class','hot-msg-header'); 
          title.innerText = item.title
          msgbox.appendChild(title);

          // close button
          var closeBtn = document.createElement("p")
          closeBtn.innerText = 'x'        
          closeBtn.setAttribute('class', 'hot-msg-close')   
          closeBtn.onclick = function(e) {
            outThis.dialogOpen = false
            e.stopPropagation()            
            msgbox.remove()            
          }
          msgbox.appendChild(closeBtn)

          // description
          var description = document.createElement("p")
          description.innerText = item.desc
          description.setAttribute('class', 'hot-msg-desc')
          msgbox.onclick = function(e) {
            e.stopPropagation()
          }
          msgbox.appendChild(description);                     
          document.body.appendChild(msgbox); 
          dragElement(document.querySelector(".hot-msg"));
        }
        document.body.appendChild(hotspotContainer);
      },


      fixClearClass_aux() {        
        // Used to remove remaining border of all elements
        // Its used in saveHotspot()        
        var items = document.getElementsByTagName("*");
        items.forEach ((item) => {
          item.classList.remove('border')
        })

      },           
      adjustPosition() {
        /* 
          This function is used to ajust the position when resize or scrolling, and when saving
          TODO: Use map State, getters
        */

        var hotspots = this.$store.state.hotSpots;   
        
        hotspots.forEach((item) => {              
          const base_element  = getElementByXPath(item.xPath)
          const base_rect     = base_element.getBoundingClientRect(); 
          const hotspotContainer =  document.querySelector('[data-unique="hotspotContainer'+ item.unique + '"]');                        
          hotspotContainer.style.left  = (base_rect.left + base_rect.width/2) - 40 + 'px'
          hotspotContainer.style.top   = (base_rect.top  + base_rect.height/2) - 40 + window.scrollY + 'px'        

        })

      },

    
      activeHotspot(item) {

        /* 
          Changes the color of selected/Clicked hotspot 

          First removes all previously added classes
          Then add it to the selected one

        */
        var circleBorders = document.querySelectorAll('.circle-border')
        var circleSolids = document.querySelectorAll('.circle-solid')
        circleBorders.forEach((i) => {
          i.classList.remove('selected-hotspot')

        })
        circleSolids.forEach((i) => {
          i.classList.remove('selected-hotspot')
        })

        var circleBorder = document.querySelector('.circle-border' + item.unique)
        var circleSolid = document.querySelector('.circle-solid' + item.unique)
        circleBorder.classList.add('selected-hotspot')
        circleSolid.classList.add('selected-hotspot')
        
      },
      onWindowLoad() {
        /*
          Load hotspot list data from LocalStorage
          Initialize the visual clues
          And adjustPosition() 
        */

        this.$store.commit("RELOAD", JSON.parse(localStorage["hotspots"]) )
        var data = this.$store.state.hotSpots        
        data.forEach((item) => {
          this.initializeAnimatedHotspots(item)
        })
        //var outThis = this;
        // setTimeout(function(){
        //   //deferred onload
        //   outThis.adjustPosition()
        // }, 1);
        this.adjustPosition()        
      }, 

      deleteItem(item) {        

        /*
          Delete visual clues of particular item
          Its fired via the EventBus HotspotList component Delete option

        */
        var hotspotContainer = document.querySelector('.hotspotContainer' + item.unique)
        var circleBorder = document.querySelector('.circle-solid' + item.unique)
        var circleSolid = document.querySelector('.circle-border' + item.unique)
        hotspotContainer.parentNode.removeChild(hotspotContainer)
        circleBorder.parentNode.removeChild(circleBorder)
        circleSolid.parentNode.removeChild(circleSolid)
       
      }
    } 
  }
</script>


<style lang="scss">

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

  * { font-family: Montserrat; }

  .border    { border: 2px solid !important;color: rgb(255, 0, 0) !important; background-color: rgb(255, 255, 221) !important;}


  .selected-hotspot {
    background-color: lightblue !important;
    border-color: blue !important;
    border: 2px solid !important;
    box-shadow: 0px 0px 5px black;
  }


  .hotspotContainer {
    z-index: 1000;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 60px;
    cursor: pointer;    
    background-color: rgba(0, 0, 0, .0);
  
  }


  .circle-border {
    box-sizing: border-box;
    z-index: 5;    
    pointer-events: none;     
    animation: dots-border .6s linear infinite;
    border: 2px solid;    
    border-color: rgb(255, 0, 0); 
    border-radius: 50%;
    display: flex;
    justify-content: center;    
    align-items: center;



  }  
  @keyframes dots-border{
    0%{   height: 10px;  width: 10px;  opacity: 0; }
    50%{  height: 25px; width: 25px; opacity: .8; }
    100%{ height: 65px; width: 65px; opacity: 0.0;  }
  }    

 
  .circle-solid {
    z-index: 5;    
    pointer-events: none;         
    border-radius: 50%;             
    background-color: rgb(255, 88, 46);


    animation-fill-mode: both;
    animation: dots-solid .6s linear infinite;   

    
  }  
  @keyframes dots-solid{
    0%{   height: 5px;  width: 5px;  opacity: 0; }
    50%{  height: 20px; width: 20px; opacity: 1; }
    100%{ height: 35px; width: 35px; opacity: 0.0;  }
  }  
    .hot-msg {
        z-index: 1200;
        position: absolute;      
        width: 300px;
        height: 150px;
        padding: 10px;
        background-color: white;   
        color: black;
        border-radius: 0px;
        font-size: 1.0em;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(146, 146, 146, 0.815);    
        // transform: translateX(100px);
        // transform: translateY(80px);


        .hot-msg-header {
          position: relative;
          // background-color: lightgrey;
          font-family: 'Montserrat';
          font-weight: 200;
          color: black;
          
          cursor: move;                        
          border-radius: 0px;
          padding: 4px;  
          height:  45px;   
          display: flex;         
          justify-content: flex-start;
          align-items: center;
          
            
        }  

        .hot-msg-close {
          position: relative;
          background-color: white;
          color: black;
          font-size: .7em;
          cursor: pointer;
          border: 1px solid black;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          right: 15px;
          top: 20px;
          height: 28px;
          width: 28px;
          position: absolute;
    
        }
        .hot-msg-desc {
            position: relative;
            padding: 4px;
            padding-top: 10px;            
            font-size: 1em;
            height: 133px;
            overflow: auto;
            color: grey
            
        }
      }  
</style>

