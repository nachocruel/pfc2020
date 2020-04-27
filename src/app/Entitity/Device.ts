export class Device {
    _id:String
    _cls:String
    max_temperature:Number
    device_max_temperature:Number
    low_humidity: Number
    max_gas: Number
    latitude: Number
    longitude: Number
    id_dispositivo: String
    id_fire: String
    codigo_pais: String
    codigo_estado: String
    codigo_municipio: String
    zona: String
    tipo_dispositivo:String
    constructor(obj:Device = null){
        if(obj)
         Object.assign(this, obj)
    }
}