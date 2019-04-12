import Vue from 'vue';
import Vuetify from 'vuetify';
var fs = require('fs');
import App from './views/app';

(async function init() {
    let tree = ({
        open: ['public'],
        files: {
            html: 'mdi-language-html5',
            js: 'mdi-nodejs',
            json: 'mdi-json',
            md: 'mdi-markdown',
            pdf: 'mdi-file-pdf',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel'
        },
        tree: [],
        items: [{
                id: 1,
                name: '.git'
            },
            {
                id: 2,
                name: 'node_modules'
            },
            {
                id: 3,
                name: 'public',
            },
            {
                id: 4,
                name: '.gitignore'
            },
            {
                id: 5,
                name: 'babel.config.js'
            },
            {
                id: 6,
                name: 'package.json'
            },
            {
                id: 7,
                name: 'README.md'
            }
        ]
    })
    await Vue.use(Vuetify, {
        iconfont: 'md',
        theme: {
            primary: "#37474F",
            secondary: "#424242",
            accent: "#F57C00",
            error: "#FF5252",
            warning: "#FDD835",
            info: "#82B1FF",
            success: "#81C784"
        }
    })


    let initialDir = './test/'
    let dirs = await getDirs(initialDir).then(result => result)
    for (let index = 0; index < dirs.length; index++) {
        const element = dirs[index];
        element.internal = tree //await getDirs(initialDir + element.name).then(result => result)
        console.log('aa')
    }
    console.log(dirs)


    let vueElement = new Vue({
            el: '#app',
            render: h => h(App, {
                props: {
                    "dirs": dirs
                }
            })
        })
        /*     setInterval(async function() {
                dirs = await getDirs().then(result => result)
            }, 3000);
         */
})()



function getDirs(url) {
    return new Promise(function(resolve, reject) {
        fs.readdir(url, function(err, flist) {
            let toreturn = []
            if (err) {
                reject('Error reading directory ', err);
            }
            for (let index = 0; index < flist.length; index++) {
                const element = flist[index];
                toreturn[index] = []
                toreturn[index]['name'] = element
                toreturn[index]['internal'] = `internal-${element}`

            }
            resolve(toreturn);
        })
    })
}