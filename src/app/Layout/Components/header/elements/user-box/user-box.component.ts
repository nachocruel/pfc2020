import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../../../theme-options';
import { Router } from '@angular/router'
import { User } from '../../../../../Entitity/User'

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {
  
  img_perfil:String
  constructor(public globals: ThemeOptions, private router:Router) {
  }

  ngOnInit() {
     let user:User =  JSON.parse(localStorage.getItem('user'))
     this.img_perfil = user && user.img_profile? user.img_profile: './assets/images/avatars/1.jpg'
  }
  
  sair(){
     localStorage.setItem('user', null)
     this.router.navigate(['/pages/login-boxed'])
  }
}
