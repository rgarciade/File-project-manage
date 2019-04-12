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
        </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
  </v-app>
</template>

<script>
  export default {
      name: 'app',
      data(){
          return { 
            tabs:0,
            tree:[]
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
      }
  }
</script>
<style>
</style>
