<template>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-btn :color='color' :class='itemClass' v-on="on" fab >
            <v-icon>{{icon}}</v-icon>
            </v-btn>
        </template>
        <span>{{toltipTest}}</span>
    </v-tooltip>
</template>
<script>
    export default {
        props: ['itemClass','toltipTest','icon','color','func'],
        name: 'buttontoltip'
    }
</script>
