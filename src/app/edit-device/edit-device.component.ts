import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {Device} from '../Entitity/Device'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.sass']
})
export class EditDeviceComponent implements OnInit {
  heading = 'Editar dispositivo';
  subheading = 'Edite os campos necessários e clique em "Editar"';
  icon = 'pe-7s-plugin icon-gradient bg-tempting-azure';
  device:Device
  formDevice:FormGroup
  constructor(private formBuider:FormBuilder, private http:HttpClient) { }

  ngOnInit(): void {
      this.mensagem = null
      if(history.state.data){
         this.device = new Device(history.state.data)
         console.log(JSON.stringify(this.device))
      }else{
        this.device = new Device()
      }

      this.formDevice = this.formBuider.group({
        _id: [{value:this.device._id, disabled: true}, [Validators.required]],
        _cls: [{value:this.device._cls, disabled: true}, [Validators.required]],
        max_temperature: [this.device.max_temperature, [Validators.required]],
        device_max_temperature: [this.device.device_max_temperature, [Validators.required]],
        low_humidity: [this.device.low_humidity, [Validators.required]],
        max_gas: [this.device.max_gas, [Validators.required]],
        latitude: [this.device.latitude, [Validators.required]],
        longitude: [this.device.longitude, [Validators.required]],
        id_fire: [{value:this.device.id_fire, disabled: true}, [Validators.required]],
        zona: [{value:this.device.zona, disabled:true}, [Validators.required]],
        codigo_pais: [{value: this.device.codigo_pais, disabled: true}, [Validators.required]],
        codigo_estado: [{value: this.device.codigo_estado, disabled: true}, [Validators.required]],
        codigo_municipio: [{value: this.device.codigo_municipio, disabled: true}, [Validators.required]],
        tipo_dispositivo: [{value: this.device.tipo_dispositivo, disabled: true}, [Validators.required]]
      })
  }
  
  mensagem:String = null
  updated:boolean = false
  editDevice(){
     let editedDevice = Object.assign(this.device, this.formDevice.value)
     console.log(JSON.stringify(editedDevice))
    
     if(this.formDevice.invalid){
       this.updated = false
       this.mensagem = "Campos obrigatórios não foram preenchidos!"   
     }else{
        this.http.put(`https://us-central1-my-fps.cloudfunctions.net/appPFC/api/device/${editedDevice._id}`, editedDevice).subscribe((data:any)=>{
          var deviceList = JSON.parse(localStorage.getItem('deviceList')) 
          if(deviceList){
            for(let device of deviceList){
                if(device._id === data._id){
                   device.low_humidity = data.low_humidity
                   device.device_max_temperature = data.device_max_temperature
                   device.max_temperature = data.max_temperature
                   device.max_gas = data.max_gas
                   device.latitude = data.latitude
                   device.longitude = data.longitude
                }
            }
            localStorage.setItem('deviceList', JSON.stringify(deviceList))
          }    
          this.updated = true
          this.mensagem = "Dispositivo atualizado com sucesso!"
        }, (error)=>{
          this.updated = false
           this.mensagem = error.message
           console.log(error.message)
        })
     }
  }

}
