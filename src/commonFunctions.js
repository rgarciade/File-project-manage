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
                    toreturn[index].name = element
                    toreturn[index].mtime = mtime
                    toreturn[index].url = urlFile
                }
            }
            console.log(toreturn)
            resolve(toreturn);
        })
    })
}
const moveFileToNewDir = (destinationDirectory, name, oldPath) => {
    const destination = destinationDirectory + '/' + name
    return new Promise(async function(resolve, reject) {
        await getDirs().then(rowsDirs => {
            for (let index = 0; index < rowsDirs.length; index++) {
                const rowDir = rowsDirs[index];
                if (rowDir.copydir && destinationDirectory == rowDir.url) {
                    let alternativeCopyDir = rowDir.copydir + '/' + name
                    fs.copyFile(oldPath, alternativeCopyDir, function(err) {
                        if (err) {
                            if (err.code !== 'EXDEV') {
                                reject(err)
                            }
                        }
                    });
                }
            }
        })


        fs.rename(oldPath, destination, function(err) {
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