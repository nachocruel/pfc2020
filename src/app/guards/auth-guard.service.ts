import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   RouterStateSnapshot,
   CanActivateChild,
   Router
 } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivateChild {
  
  isAuthenticated:Boolean = false
  constructor(private router:Router) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      route.url
      return this.checkLogin(state.url);
  }

  checkLogin(url:String){
     console.log(`url ${url} não acessivel`)
     let user = JSON.parse(localStorage.getItem('user'))
     if(user)
       return true;
     this.router.navigate(['pages/login-boxed'])
     return false;
  }
}
