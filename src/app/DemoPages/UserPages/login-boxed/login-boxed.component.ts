import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import { User } from '../../../Entitity/User'

@Component({
  selector: 'app-login-boxed',
  templateUrl: './login-boxed.component.html',
  styles: []
})
export class LoginBoxedComponent implements OnInit {
  email:String;
  senha:String;
  msgErro:String
  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit() {
  }

  onClick(){
    if(this.email && this.senha){
      this.http.post('/api/user/logar', {email:this.email, password: this.senha}).subscribe((data:any)=>{
        console.log(data)
        if(data.result){
              this.msgErro = null;
              var user:User = data.data
              localStorage.setItem('user', JSON.stringify(user))
              this.router.navigate(['/Layout/base-layout/base-layout.component'])
        }else{
          this.msgErro = "Usuário ou senha incorretos!"
        }
      }, (error)=>{
          console.log(error)
          this.msgErro = error.message
      })
    }
  }
}
