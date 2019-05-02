var fs = require('fs');
const Principalurl = 'dataFile'
const principalDirectory = '../dataFilesDatabase'

class dataFileDatabase {
    constructor(url, structure) {
        this._url = url + ".json"
        this._structure = structure
        if (!fs.existsSync(principalDirectory)) {
            fs.mkdirSync(principalDirectory);
        }
    }
    get data() {
        const url = this._url
        return new Promise(function(resolve, reject) {
            fs.readFile(`${principalDirectory}/${url}`, function read(err, data) {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(data))
            });
        })
    }
    _setdata(newDatas) {
        const url = this._url
        return new Promise(function(resolve, reject) {
            fs.writeFile(`${principalDirectory}/${url}`, JSON.stringify(newDatas), function(err) {
                if (err) {
                    reject(err);
                }
                resolve('DataUpdated')
            });
        })
    }
    getVal(index, func, valToFind) {
        const data = this.data
        return new Promise(async function(resolve, reject) {
            return data.then(fileData => {
                let result = fileData.filter(fileDataret => {
                    if (func == "=") {
                        return fileDataret[index] == valToFind
                    }
                    if (func == "!=") {
                        return fileDataret[index] != valToFind
                    }
                    if (func == ">") {
                        return fileDataret[index] > valToFind
                    }
                    if (func == "<") {
                        return fileDataret[index] < valToFind
                    }
                })
                resolve(result)
            }).catch(e => reject(e))
        })

    }
    setVal({...vals }) {
            let structure = this._structure
            let newElement = {}
            let that = this


            return new Promise(async function(resolve, reject) {
                for (let index = 0; index < structure.length; index++) {
                    const element = structure[index];
                    newElement[element] = (vals[element]) ? vals[element] : null
                }
                return that.data.then(fileData => {
                    let newId = fileData[fileData.length - 1]["_id"] + 1
                    fileData.push(Object.assign({ "_id": newId }, newElement))
                    that._setdata(fileData).catch(e => reject(e))
                    resolve(newId)
                }).catch(e => reject(e))
            })

        }
        //  updateVals()
}
let casas = new dataFileDatabase('dataFile', ["casa", "perro"])
casas.setVal({ "casa": "amarilla", "gato": "gg", "perro": "hh" }).then(a => console.log(a))
    //casas.data.then(a => console.log(a))

//casas.getVal('casa', '=', 'verde').then(a => console.log(a))