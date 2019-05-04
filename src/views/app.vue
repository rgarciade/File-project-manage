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
          <v-card-text class="seleccionados">
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
              <v-btn icon dark @click="dialog = 0">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Directorios</v-toolbar-title>

              <v-spacer></v-spacer>
                <v-toolbar-items>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn dark flat  @click="addNewDir" v-on="on">
                              <input id="newDir" type="file" webkitdirectory style="display: none" />
                                <v-icon>create_new_folder</v-icon>
                            </v-btn>
                          </template>
                          <span>Añadir Carpeta</span>
                        </v-tooltip>  
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
                <v-flex xs8>
                    <v-list-tile :key="index" avatar ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Orden: {{ item.id }}
                          </v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary">Nombre de la carpeta: {{ item.name  }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title>Dirección a la carpeta: {{ item.url }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-icon color="grey lighten-1" v-on="on" @click="removeDir(item.url)">delete_forever</v-icon>
                          </template>
                            <span>Quitar del programa</span>
                        </v-tooltip>   
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index < (DirsConfig.length -1)"  :key="`divider-${index}`" ></v-divider>
                  </v-flex>
                  <v-flex xs8>
                    <v-list-tile :key="index" avatar ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Dirección de copia 
                          </v-list-tile-title>
                        <v-list-tile-sub-title> No asignado </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-icon color="grey lighten-1" v-on="on"  @click="">label_important</v-icon>
                          </template>
                          <span>Copia Automatica</span>
                        </v-tooltip>   
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index < (DirsConfig.length -1)"  :key="`divider-${index}`" ></v-divider>
                  </v-flex>
              </v-layout>
            </template>
          </v-list>
          </v-card>
        </v-dialog>
        <div class='element-add'>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn color="blue" class='button-add' v-on="on" fab @click="dialog = true">
                <v-icon>add_box</v-icon>
              </v-btn>
            </template>
            <span>Configuración</span>
          </v-tooltip>

        </div>
        <div class='element-recharge'>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" class='button-add' v-on="on"  fab @click="prepareDisrsAndItemsDirs()">
                <v-icon>replay</v-icon>
              </v-btn>
            </template>
            <span>Regarga</span>
          </v-tooltip>   
        </div>
        <div class='pasar-archivo'>
          <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn small flat v-on="on" @click="openfocusDir"><v-icon>folder</v-icon></v-btn>
              </template>
              <span>Abrir Carpeta</span>
          </v-tooltip>   
          
          <v-btn  small color="success" @click="openFiles">abrir Archivos</v-btn>
          <v-btn  small color="info" @click="moveFiles">Pasar Archivos</v-btn>
        </div>
  </v-app>
</template>

<script>
  import { getFiles, moveFileToNewDir, opendir, openFile } from "../commonFunctions.js";
  import dataStorage from '../components/datastorage'
  let app  = {
      name: 'app',
      data(){
          return { 
            tabs:0,
            tree:[],
            dialog: false,
            dirs:[],
            DirsConfig:[],
            orden:[],
            repeatIDStatus: false,
            repeatID: 0,
            snackbar: false,
            snackbarText: '',
            dirsToSee:[],
            filesSelected:[]
          }
      },
      mounted(){    
        document.getElementById('newDir').addEventListener('change', e => {
          let dirName = e.target.files[0].name
          let realUri = e.target.files[0].path
          this.addToDirToStorage({'name':dirName,'url':realUri})
          document.getElementById('newDir').value = ''
        })
        this.prepareDisrsAndItemsDirs()
      },
      methods:{
        getAbsoluteUrlFile(fileName){
          return this.dirsToSee[this.tabs].url +'/'+fileName
        },
        getDirs(){
          return new Promise(function(resolve, reject) {
            resolve(dataStorage.getVal('nombre', '=', 'dirs').then(val => {
                if(val[0] && val[0]['datos']){
                  return val[0]['datos']
                }else{
                  return []
                }
              })
            )
          })
        },
        getConfigDirs(){
          let tempComf = []
          for (let index = 0; index < this.DirsConfig.length; index++) {
            tempComf[index] = this.DirsConfig[index]; 
          }
          return tempComf
        },
        closeDialogCheck(){
          if(this.dirsToSee.length >= 1){
            this.dialog = true
          }else{
            this.dialog = false
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
        openFiles(){
          let filesSelecteds = this.getSelection(this.tabs)
          if(this.dirsToSee[this.tabs]){
            for (let index = 0; index < filesSelecteds.length; index++) {
              const selected = filesSelecteds[index];
              try {
                openFile(selected.url)
              } catch (error) {
                console.log(error)
              }
            }
          }   
        },
        openfocusDir(){
          let destinationDirectory= this.dirsToSee[this.tabs].url
              try {
                openFile(destinationDirectory)
              } catch (error) {
                console.log(error)
              }
        },
        moveFiles (){
          let filesSelecteds = this.getSelection(this.tabs)
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
        dirsToSee: function (newDirsToSee){
          if(newDirsToSee.length < 1 ){
            this.dialog = true
          }
        },
        dialog: async function (newDialog){
          if(!newDialog && this.dirsToSee.length == 0){
            this.dialog = 1
          }
          if(newDialog){
              this.DirsConfig = await this.getDirs()
              console.log('gg',this.DirsConfig)
              this.updateOrder()
          }
        }
    },
  }
  export default app
</script>
<style>
</style>
