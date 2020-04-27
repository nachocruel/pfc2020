import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {FormGroup, FormBuilder} from '@angular/forms'
import { Pais } from '../../../../../Entitity/Pais'
@Component({
  selector: 'app-condominio-select',
  templateUrl: './condominio-select.component.html',
})
export class CondominioSelectComponent implements OnInit {
  
  countryList:any
  formCountry:FormGroup
  selectCountry:any
  constructor(
    private http:HttpClient, private formBuilder:FormBuilder) { }

  ngOnInit() {
    let self = this;
    localStorage.setItem('deviceList', null)
    this.formCountry = this.formBuilder.group({
      selectPais: [''],
      selectEstado:[''],
      selectMunicipio: ['']
    })   

    this.http.get('https://us-central1-my-fps.cloudfunctions.net/appPFC/api/pais').subscribe((countries)=>{   
         self.countryList = countries
         self.selectCountry = this.countryList[0]   
         self.formCountry = this.formBuilder.group({
          selectPais: [this.countryList[0]],
          selectEstado:[this.countryList[0].estados[0]],
          selectMunicipio: [this.countryList[0].estados[0].municipios[0]]
        })

        this.http.post('https://us-central1-my-fps.cloudfunctions.net/appPFC/api/device/get_lista_especifica', 
           {
             codigo_pais:this.countryList[0].codigo,
             codigo_estado:this.countryList[0].estados[0].codigo,
             codigo_municipio:this.countryList[0].estados[0].municipios[0].codigo
           }
        ).subscribe((data:any)=>{
            if(data.result){
              localStorage.setItem('deviceList', JSON.stringify(data.data))
            }  
        })
    }) 
  }

  selectCountryChange(){
    console.log('selectCountryChange')
    for(let country of this.countryList ){
       if(country.codigo === this.formCountry.controls.selectPais.value){
          this.selectCountry = country
       }
    }
  }

  selectEstateChange(){
    console.log('selectEstateChange()')
  }

  selectMunicipioChange(){
    console.log('selectMunicipioChange()')
  }
}
