<template>
  <v-app>
    <v-tabs fixed-tabs
      v-model="tabs"
    >
      <v-tab
        v-for=" tab in dirs"
        :key="tab.name"
        :valu="tab"
      >
        Item {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
          <v-tab-item
            v-for=" tab in dirs"
            :key="tab.name"
            :valu="tab"
          >
        <v-layout>
        <v-flex>
          <v-card-text>
            <v-treeview
              v-model="tree"
              :items="tab.internal.items"
              activatable
              active-class="grey lighten-4 indigo--text"
              selected-color="indigo"
              selectable
              on-icon="bookmark"
              off-icon="bookmark"
            >
            </v-treeview>
          </v-card-text>
          <v-btn color="info">Info</v-btn>
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
          <v-card tile>
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
                  <v-btn dark flat >Guardar</v-btn>
                </v-toolbar-items>
            </v-toolbar>
                <v-list two-line>
            <template v-for="(item, index) in testDirsSaved">
              <form :key="index">
              <v-layout row >
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
                    <v-list-tile :key="index" avatar ripple @click="">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Orden: {{ item.id }}
                          </v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary">{{ item.name  }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title>{{ item.url }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                          <v-icon color="grey lighten-1" @click="removeDir(item.url)">delete_forever</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="`divider-${index}`" ></v-divider>
                  </v-flex>
              </v-layout>
                  </form>
            </template>
          </v-list>
          </v-card>
        </v-dialog>
        <div class='element-add'>
        <v-btn color="primary" class='button-add' fab @click="dialog = true">
          <v-icon>add_box</v-icon>
        </v-btn>
      </div>
  </v-app>
</template>

<script>
  export default {
      name: 'app',
      data(){
          return { 
            tabs:0,
            tree:[],
            dialog: false,
            testDirs:[],
            testDirsSaved:[],
            orden:[]
          }
      },
      props: ['dirs'],
      mounted(){
        let clasFileName = document.getElementsByClassName('v-treeview-node__label')
        for (var i = 0; i < clasFileName.length; i++) {
          clasFileName[i].addEventListener('click',function(e) {
            console.log('-->',e.currentTarget.innerHTML)
          });
        } 
        document.getElementById('newDir').addEventListener('change', e => {
          let dirName = e.target.files[0].name
          let realUri = e.target.files[0].path
          this.addToDirToStorage({'name':dirName,'url':realUri})
        })
      },
      created:function () {
         if(localStorage.getItem('dirs')){
          this.testDirs = this.getDirs()
          this.orden = []
          for (let index = 0; index < this.testDirs.length; index++) {
            this.orden.push(index)
          }
        }
      },
      methods:{
        getDirs(){
          return (localStorage.getItem('dirs'))? JSON.parse(localStorage.getItem('dirs')) : []
        },
        removeDir(url){
          let thisDirs = this.getDirs()
          for(var i = thisDirs.length - 1; i >= 0; i--) {
            if(thisDirs[i].url === url){
                  thisDirs.splice(i, 1);
            }
          }
          for(var i = thisDirs.length - 1; i >= 0; i--) {
            thisDirs[i].id = i
          }
          console.log(thisDirs)
          this.updateDirs(thisDirs)
        },
        updateDirs(thisDirs){
          this.testDirs = thisDirs
          this.orden = []
          for (let index = 0; index < this.testDirs.length; index++) {
            this.orden.push(index)
          }
          localStorage.setItem("dirs", JSON.stringify(thisDirs));
        },
        changeOrder(event){
          console.log(event)
        },
        addNewDir(event){
          document.getElementById('newDir').click()
        },
        addToDirToStorage(newDir){
          let thisDirs = this.getDirs()
          thisDirs[thisDirs.length] = { 'id':thisDirs.length, 'name': newDir.name, 'url': newDir.url}
          this.updateDirs(thisDirs);
        }
      },
       watch: {
          // whenever question changes, this function will run
          dialog: function (newDialog) {
            if(newDialog){
              
              this.testDirsSaved = this.testDirs
            }
      }
  },
  }
</script>
<style>
</style>
