<template>
  <v-app>
      <v-dialog
        v-model="repeatIDStatus"
        max-width="290"
      >
      <v-card>
          <v-card-title class="headline">existe un id de orden repetido</v-card-title>
          <v-card-text>
             id repetido: {{repeatID}}
          </v-card-text>
        </v-card>
      
      </v-dialog>
      <v-snackbar
        v-model="snackbar"
        buttom
      >
        {{ snackbarText }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </v-snackbar>

    <v-tabs fixed-tabs
      v-model="tabs"
    >
      <v-tab
        v-for=" tab in dirsToSee"
        :key="tab.name"
        :valu="tab"
      >
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items class="item-file" v-model="tabs">
          <v-tab-item
            v-for=" tab in dirsToSee"
            :key="tab.id"
            :valu="tab"
          >
        <v-layout>
          <v-flex>
            <v-card-text>
              <v-treeview v-if="tab.files"
                v-model="filesSelected[tab.id]"
                :items="tab.files"
                activatable
                active-class="grey lighten-4 indigo--text"
                selected-color="indigo"
                selectable
                on-icon="bookmark"
                off-icon="bookmark"
              >
              </v-treeview>
            </v-card-text>
          </v-flex>
          <v-divider vertical></v-divider>
  
        <v-flex
          xs6
        >
          <v-card-text>
            <div
              v-if="selections.length === 0"
              key="title"
              class="title font-weight-light grey--text pa-3 text-xs-center"
            >
             Ninguno seleccionado
            </div>
  
            <v-scroll-x-transition
              group
              hide-on-leave
            >
              <v-chip
                v-for="(selection, i) in selections"
                :key="i"
                color="grey"
                dark
                small
              >
                <v-icon left small>mdi-beer</v-icon>
                {{ selection.name }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-flex>
        </v-layout>
        
      </v-tab-item>
    </v-tabs-items>
            <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
        >
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Directorios</v-toolbar-title>

              <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark flat  @click="addNewDir" >
                    <input id="newDir" type="file" webkitdirectory style="display: none" />
                    <v-icon>create_new_folder</v-icon>
                  </v-btn>
                </v-toolbar-items>
                <v-toolbar-items>
                  <v-btn dark flat @click="sabeDirConfif">Guardar</v-btn>
                </v-toolbar-items>
            </v-toolbar>
                <v-list two-line>
            <template v-for="(item, index) in DirsConfig">
              <v-layout row :key="index">
                <v-flex xs2 >
                  <v-select 
                    :items="orden"
                    v-model="item.id"
                    placeholder="cambiar"
                    suffix="Orden"
                    solo-inverted
                          >
                  </v-select>
                </v-flex>
                <v-flex xs10>
                    <v-list-tile :key="index" avatar ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Orden: {{ item.id }}
                          </v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary">Nombre de la carpeta: {{ item.name  }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title>Dirección a la carpeta: {{ item.url }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                          <v-icon color="grey lighten-1" @click="removeDir(item.url)">delete_forever</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index < (DirsConfig.length -1)"  :key="`divider-${index}`" ></v-divider>
                  </v-flex>
              </v-layout>
            </template>
            <template>
              <v-flex>
                <v-card >
                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">Directorio de guardado</h3>
                      <div> {{saveDir.url}}</div>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn flat icon @click="addNewSaveDir">
                      <input id="newSaveDir" type="file" webkitdirectory style="display: none" />
                      <v-icon>save_alt</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </template>
          </v-list>
          </v-card>
        </v-dialog>
        <div class='element-add'>
          <v-btn color="primary" class='button-add' fab @click="dialog = true">
            <v-icon>add_box</v-icon>
          </v-btn>
        </div>
        <div class='element-recharge'>
          <v-btn color="primary" class='button-add' fab @click="prepareDisrsAndItemsDirs()">
            <v-icon>replay</v-icon>
          </v-btn>
        </div>
        <div class='element-savedir'>
          <v-btn color="blue" class='button-add' fab @click="openSaveDir()">
            <v-icon>all_inbox</v-icon>
          </v-btn>
        </div>
        <div class='pasar-archivo'>
          <v-btn  color="info" @click="moveFile">Pasar Archivos</v-btn>
        </div>
  </v-app>
</template>

<script>
  import { getFiles, moveFileToNewDir, opendir } from "../commonFunctions.js";
  export default {
      name: 'app',
      data(){
          return { 
            tabs:0,
            tree:[],
            dialog: false,
            Dirs:[],
            DirsConfig:[],
            orden:[],
            repeatIDStatus: false,
            repeatID: 0,
            snackbar: false,
            snackbarText: '',
            saveDir:{name:'',url:''},
            dirsToSee:[],
            filesSelected:[]
          }
      },
      props: ['dirs'],
      mounted(){
      
        document.body.addEventListener('click', function (evt) {
          if (evt.target.className === 'v-treeview-node__label') {
            cosole.log(evt)
          }
        }, false);
     
        this.saveDir = this.getSaveDir()
        document.getElementById('newDir').addEventListener('change', e => {
          let dirName = e.target.files[0].name
          let realUri = e.target.files[0].path
          this.addToDirToStorage({'name':dirName,'url':realUri})
          document.getElementById('newDir').value = ''
        })
        document.getElementById('newSaveDir').addEventListener('change', e => {
          let dirName = e.target.files[0].name
          let realUri = e.target.files[0].path
          this.changeSaveDir({'name':dirName,'url':realUri})
          document.getElementById('newSaveDir').value = ''
        })
        this.prepareDisrsAndItemsDirs()
      },
      methods:{
        getDirs(){
          return (localStorage.getItem('dirs'))? JSON.parse(localStorage.getItem('dirs')) : []
        },
        getSaveDir(){
          return (localStorage.getItem('saveDir'))? JSON.parse(localStorage.getItem('saveDir')) : {name:'no definido',url:'no definida'}
        },
        getConfigDirs(){
          let tempComf = []
          for (let index = 0; index < this.DirsConfig.length; index++) {
            tempComf[index] = this.DirsConfig[index]; 
          }
          return tempComf
        },
        openSaveDir(){
          let saveDir = JSON.parse(localStorage.getItem('saveDir')).url ? JSON.parse(localStorage.getItem('saveDir')).url : null
          if(saveDir){
            opendir(saveDir)
          }
        },
        async prepareDisrsAndItemsDirs(change = false) {
          let dirs = await this.getDirs()
           for (let index = 0; index < dirs.length; index++) {
            const element = dirs[index];
            await getFiles(element.url)
            .then(files=> {
              dirs[index].files = files
              dirs[index].id = index
            }) 
          } 
          if(dirs[0] && change){
            let newTemp = { 'name': '','id':dirs.length, 'files': [{id:999,name:'',url:''}]}
            dirs[dirs.length] = newTemp
          }
          this.dirsToSee = dirs
          console.log(dirs)
          
          if(change == 1){
            setTimeout(function(){ dirs.splice(-1,1);this.dirsToSee = dirs }, 1);
          }
        },

        removeDir(url){
          let thisDirs = this.getConfigDirs()
          for(var i = thisDirs.length - 1; i >= 0; i--) {
            if(thisDirs[i].url === url){
                  thisDirs.splice(i, 1);
            }
          }
          for(var i = thisDirs.length - 1; i >= 0; i--) {
            thisDirs[i].id = i
          }
          this.DirsConfig = thisDirs
        },
        updateDirs(thisDirs){
          this.Dirs = thisDirs

          this.orden = []
          for (let index = 0; index < this.Dirs.length; index++) {
            this.orden.push(index)
          }
          localStorage.setItem("dirs", JSON.stringify(thisDirs));
          this.activeSnackbar('Directorios actualizados')
          this.dialog = false
          //this.prepareDisrsAndItemsDirs(1)
          location.reload();
        },
        activeSnackbar(text){
          this.snackbar = true
          this.snackbarText = text
        },
        sabeDirConfif(){
          let newDirs = this.getConfigDirs()
          let newDirsOrder = []
          
          for (let index = 0; index < newDirs.length; index++) {
            const id = newDirs[index].id
            let sumid = 0 
            for (let a = 0; a < newDirs.length; a++) {
              if(id == newDirs[a].id){
                sumid ++
              }
              if(sumid > 1){
                a = newDirs.length
                index = newDirs.length
                this.repeatIDStatus = true
                this.repeatID = id
              }
            }
          }
          for (let index = 0; index < newDirs.length; index++) {
            newDirsOrder[newDirs[index].id] = newDirs[index]
          }
          if(!this.repeatIDStatus){
            this.updateDirs(newDirsOrder)
          }
        },
        addNewDir(event){
          document.getElementById('newDir').click()
        },
        addNewSaveDir(event){
          document.getElementById('newSaveDir').click()
        },
        changeSaveDir(newSaveDir){
          localStorage.setItem("saveDir", JSON.stringify(newSaveDir));
          this.saveDir = newSaveDir
        },
        addToDirToStorage(newDir){
          let thisDirs = this.getConfigDirs()
          thisDirs[thisDirs.length] = { 'id':thisDirs.length, 'name': newDir.name, 'url': newDir.url}
          this.DirsConfig = thisDirs
          this.updateOrder()
        },
        updateOrder(){
          if(this.getConfigDirs()){
            let tempDirs = this.getConfigDirs()
            
            this.orden = []
            for (let index = 0; index < tempDirs.length; index++) {
              this.orden.push(index)
            }
          }
        },
        getSelection(tabId){
          const selections = []
          if(this.filesSelected[this.tabs]){
            let files = this.dirsToSee[this.tabs].files
            for (let index = 0; index < this.filesSelected[this.tabs].length; index++) {
              const element = this.filesSelected[this.tabs][index];
              const file = files[element]
              selections.push(file)
            }
          }
          return selections
        },
        moveFile(){
          let filesSelecteds = this.getSelection(this.tabs)
          console.log('this.dirsToSee',this.dirsToSee)
          console.log('this.tabs',this.tabs)
          if(this.dirsToSee[this.tabs + 1]){
            let destinationDirectory= this.dirsToSee[this.tabs + 1 ].url
            for (let index = 0; index < filesSelecteds.length; index++) {
              const selected = filesSelecteds[index];
              const destination = destinationDirectory +'/'+selected.name
              moveFileToNewDir(selected.url, destination)
              .then(this.prepareDisrsAndItemsDirs())
              .catch(err => {
                console.log(err)
                this.activeSnackbar('error al copiar el archivo'+filesSelecteds[index].name)
                })
            }
            this.filesSelected = []
            
          }else{
            this.activeSnackbar('No existe proximo Directorios')
          }

        }        
      },
      computed:{
        selections () {
          return this.getSelection(this.tabs)
        }
      },
      watch: {
        dialog: function (newDialog) {
            if(newDialog){
              this.DirsConfig = this.getDirs()
              this.updateOrder()
            }
        }
    },
  }
</script>
<style>
</style>
