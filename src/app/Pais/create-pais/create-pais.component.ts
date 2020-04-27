import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {Pais, COUNTRIES} from '../../Entitity/Pais'
import { Estado } from '../../Entitity/Estado'
import {Municipio } from '../../Entitity/Municipio'
import { FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-create-pais',
  templateUrl: './create-pais.component.html',
  styleUrls: ['./create-pais.component.sass']
})
export class CreatePaisComponent implements OnInit {
  heading = "Cadastrar Pais"
  subheading = "Cadasto de pais"
  icon = 'pe-7s-global icon-gradient bg-tempting-azure';
  countryList:Array<Pais>
  selectCountry:Pais
  selectEstado:Estado
  formContry:FormGroup
  formEstado:FormGroup
  formMunicipio:FormGroup
  page:any = 1
  disDiv1:String
  disDiv2:String
  disDiv3:String
  disDiv4:String
  estadoSubmited:boolean = false
  municipioSubmited:boolean = false
  constructor(private formBuilder:FormBuilder, private http:HttpClient) { }

  ngOnInit() {
    for(let c of COUNTRIES){
      c.estados = []
    }

    this.page = 1
    this.disDiv2 = 'none'
    this.disDiv3 =  'none'
    this.disDiv4 = "none"
    this.countryList = COUNTRIES
    this.selectCountry = COUNTRIES[0]
    this.formContry = this.formBuilder.group({
      codigo: [{value: this.selectCountry.codigo, disabled: true}, [Validators.required]],
      name: [{value: this.selectCountry.name}, [Validators.required]],
      language: [{value: this.selectCountry.language, disabled: true}, [Validators.required]]
    })

    this.formEstado = this.formBuilder.group({
      codigo: ['', [Validators.required]],
      name: ['', [Validators.required]],
      codigo_pais: [{value:this.selectCountry.codigo}]
    })

    this.formMunicipio = this.formBuilder.group({
      codigo: ['', [Validators.required]],
      name:['', [Validators.required]],
      codigo_estado:['', [Validators.required]],  
    })
  }

  onSubmit(){
    
  }

  selectChange(){
    for(var country of COUNTRIES){
      if(country.name === this.formContry.controls.name.value){
         this.selectCountry = country
      }
    }
  }

  
  invalidNomeEstado(){
    return this.estadoSubmited && this.formEstado.controls.name.errors
  }

  invalidCodigoEstado(){
    return this.estadoSubmited && this.formEstado.controls.codigo.errors
  }

  addEstado(){
      this.estadoSubmited = true;
      if(this.formEstado.invalid){
        return
      }else{
        this.estadoSubmited = false
        var estado = new Estado(this.formEstado.value)
        this.selectCountry.estados.push(estado)
        this.formEstado.controls.name.setValue('')
        this.formEstado.controls.codigo.setValue('')
      }
  }

  estadoChange(){
     for(let estado of this.selectCountry.estados){
       if(estado.codigo === this.formMunicipio.controls.codigo_estado.value){
         this.selectEstado = estado
       }
     }
  }
  
  invalidCodigMunicipio(){
    return this.municipioSubmited && this.formMunicipio.controls.codigo.errors
  }

  invalidNomeMunicipio(){
    return this.municipioSubmited && this.formMunicipio.controls.name.errors
  }

  addMunicipio(){
    if(this.formMunicipio.invalid){
      this.municipioSubmited  = true
      return 
    }else{
      this.municipioSubmited = false
      var municipio = new Municipio(this.formMunicipio.value)
      this.selectEstado.municipios.push(municipio)
      this.formMunicipio.controls.name.setValue('')
      this.formMunicipio.controls.codigo.setValue('')
    }  
  }
  

  voltar(){
     if(this.page > 1){
       this.page--
       this.disDiv1 = "none"
       this.disDiv2 = "none"
       this.disDiv3 = "none"
       this.disDiv4 = "none"
       if(this.page === 1)
        this.disDiv1 = ""
       if(this.page === 2)
        this.disDiv2 = ""
       if(this.page === 3)
        this.disDiv3 = ""
     }
  }

  proximo(){
    if(this.page < 4){
      this.page++
      this.disDiv1 = "none"
      this.disDiv2 = "none"
      this.disDiv3 = "none"
      this.disDiv4 = "none"
      if(this.page === 1)
      {
          this.disDiv1 = ""
      }

      if(this.page === 2){
        this.disDiv2 = ""
        this.formEstado.controls.codigo_pais.setValue(this.selectCountry.codigo)
      }
        
      if(this.page === 3)
      {
        this.selectEstado = this.selectCountry.estados[0]
        this.formMunicipio.controls.codigo_estado.setValue(this.selectCountry.estados[0].codigo)
        this.disDiv3 = ""
      }

      if(this.page == 4){
        this.disDiv4 = ""
      }  
    }
  }


  Salvar(){
     this.http.post('/api/pais', this.selectCountry).subscribe(async (pais)=>{
        console.log('pais salvo com sucesso')
        for(let estado of this.selectCountry.estados)
        {
          for(let municipio of estado.municipios){
             await this.http.post('/api/municipio', municipio).subscribe((municipio)=>{
               console.log('municipio Salvo com sucesso')
             })
          }
             await this.http.post('/api/estado', estado).subscribe((estado)=>{
                console.log('estado salvo com sucesso')
             })
        }
     })
  }

}
