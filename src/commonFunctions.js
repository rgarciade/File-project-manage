var fs = require('fs');
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
                    toreturn[index].name = element
                    toreturn[index].internal = `internal-${element}`

                }
            }
            resolve(toreturn);
        })
    })
}
module.exports = { getFiles }