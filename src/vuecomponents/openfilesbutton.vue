<template>
    <div  :class='principalClass'>
        <div v-if="files.length == 1">
            <v-btn @click="openDir(files[0].urlDir)">{{files[0].name}}</v-btn>
        </div>
        <div v-if="files.length >1" 
            @mouseover="hover = true"
            @mouseleave="hover = false"
        >
            <v-speed-dial
                top
                open-on-hover
                >
                <template v-slot:activator>
                <v-btn
                    color="blue darken-2"
                    fab>
                    <v-icon v-if="hover == false"  >folder</v-icon>
                    <v-icon v-if="hover == true" >close</v-icon>
                </v-btn>
                </template>
                <v-btn 
                    @click="openDir(file.urlDir)"
                    v-for=" file in files"
                    :key="file.name"
                    :valu="file"
                    small>
                {{file.name}}   
                </v-btn>
           </v-speed-dial>

        </div>
    </div>
</template>
<script>
 import { openFile } from "../commonFunctions.js";
    export default {
        props: ['principalClass','files'],
        name: 'openfilesbutton',
        data(){
          return { 
           hover:false
          }
        },
        methods:{
             openDir(url){
                openFile(url)
             }
         }
    }
</script>
