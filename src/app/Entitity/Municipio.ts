
export class Municipio {
    codigo: String
    codigo_estado: String
    name: String

    constructor(obj:Municipio = null){
        if(obj){
            Object.assign(this, obj)
        }
    }
}