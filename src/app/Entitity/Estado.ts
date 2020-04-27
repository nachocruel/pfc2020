import {Municipio} from './Municipio'
export class Estado {
    codigo: String
    codigo_pais: String
    name: String
    municipios:Array<Municipio> = []

    constructor(obj:Estado = null){
        if(obj){
            Object.assign(this, obj)
        }
    }
}