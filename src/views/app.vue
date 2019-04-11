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
              <v-treeview
                v-model="tree"
                :open="tab.internal.open"
                :items="tab.internal.items"
                activatable
                item-key="name"
                open-on-click
              >
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="!item.file">
                    {{ open ? 'folder_open' : 'folder' }}
                  </v-icon>
                  <v-icon v-else>
                    {{ tab.internal.files[item.file] }}
                  </v-icon>
                </template>
              </v-treeview>
                  safa
                  {{tab.internal[0] ? tab.internal[0]['name'] : 'ccc'}}
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
  }
</script>
<style>
</style>
