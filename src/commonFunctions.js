var fs = require('fs');
import { shell } from 'electron';
import dataStorage from './components/datastorage'

function formatDate(date) {
    return date.replace('T', ' ').split('.')[0]
}
const getDirs = () => {
    return new Promise(function(resolve, reject) {
        resolve(dataStorage.getVal('nombre', '=', 'dirs').then(val => {
            if (val[0] && val[0]['datos']) {
                return val[0]['datos']
            } else {
                return []
            }
        }))
    })
}
const getFiles = (url) => {
    return new Promise(function(resolve, reject) {
        fs.readdir(url, function(err, flist) {
            let toreturn = []
            if (err) {
                reject('Error reading directory ', err);
            }
            if (flist && flist.length) {
                for (let index = 0; index < flist.length; index++) {
                    const element = flist[index];
                    const urlFile = url + "/" + element
                    let mtime = formatDate(fs.statSync(urlFile).mtime.toISOString())
                    toreturn[index] = {}
                    toreturn[index].id = index
                    toreturn[index].name = ` ${element} | ${mtime}`
                    toreturn[index].url = urlFile
                }
            }
            console.log(toreturn)
            resolve(toreturn);
        })
    })
}
const moveFileToNewDir = (oldPath, newPath) => {
    return new Promise(function(resolve, reject) {
        fs.rename(oldPath, newPath, function(err) {
            if (err) {
                if (err.code !== 'EXDEV') {
                    reject(err)
                }
                resolve('ok')
            }
        });
    })


}
const checkIfNeedCopy = () => {

}
const opendir = (url) => {
    shell.openItem(url)
}
const openFile = (fileUrl) => {
    shell.openItem(fileUrl)
}
module.exports = { getFiles, moveFileToNewDir, opendir, openFile, checkIfNeedCopy, getDirs }