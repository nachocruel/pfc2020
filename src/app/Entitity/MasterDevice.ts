import {Device} from './Device'
export class MasterDevice extends Device{
    tipo_dispositivo:String = "MASTER"
    children: Array<Device> = []
}
