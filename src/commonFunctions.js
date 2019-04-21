var fs = require('fs');
import { shell } from 'electron';
const getFiles = (url) => {
    console.log(url)
    return new Promise(function(resolve, reject) {
        fs.readdir(url, function(err, flist) {
            let toreturn = []
            if (err) {
                reject('Error reading directory ', err);
            }
            if (flist && flist.length) {
                for (let index = 0; index < flist.length; index++) {
                    const element = flist[index];
                    toreturn[index] = {}
                    toreturn[index].id = index
                    toreturn[index].name = element
                    toreturn[index].url = url + "/" + element
                }
            }
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
const opendir = (url) => {
    shell.openItem(url)
}
module.exports = { getFiles, moveFileToNewDir, opendir }