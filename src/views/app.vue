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
                <v-chip
                      v-for="(selection, i) in selections"
                      :key="i"
                      color="grey"
                      dark
                      small
                    >
                  <v-icon left small>mdi-beer</v-icon>
                  {{tab.internal[0] ? tab.internal[0]['name'] : ''}}
    
                </v-chip>
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
            tabs:0
          }
      },
      props: ['dirs'],
  }
</script>
<style>
</style>
