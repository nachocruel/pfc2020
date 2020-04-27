import { Estado } from './Estado'
export const COUNTRIES:Array<Pais> = [
     {
         codigo: "55",
         name: "Brazil",
         language: "pt-BR",
         estados: []
     },
     {
         codigo: "54",
         name: "Argentina",
         language: "es",
         estados: []
     }
]

export class Pais {
    codigo: String;
    name: String;
    language: String
    estados:Array<Estado> = []
    constructor(obj:Pais = null){
        if(obj){
            Object.assign(this, obj)
        }
    }
}