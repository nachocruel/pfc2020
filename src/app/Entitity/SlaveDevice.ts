import {Device} from './Device'
export class SlaveDevice extends Device{
    id_master: String
    children: Array<Device> = []
    tipo_dispositivo: String = 'SLAVE'
}