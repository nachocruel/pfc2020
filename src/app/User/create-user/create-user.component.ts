import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User, PROFILES } from '../../Entitity/User'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {
  heading = "Cadastrar usuário."
  subheading = "Cadastro de usuários de acesso ao sistema"
  icon = 'pe-7s-users icon-gradient bg-tempting-azure';

  profiles:Array<String> 
  formUser:FormGroup
  userCreated:boolean = false
  errorMessage:String

  @ViewChild("video")
  public video: ElementRef;
  constraints = {
    audio: false,
    video: { width: 64, height: 64 }
  }

  @ViewChild("canvas")
  public canvas: ElementRef;

  constructor(private formBuider:FormBuilder, private http:HttpClient) { }
  
  submited:Boolean = false

  invalidEmail(){
    return this.submited && this.formUser.controls.email.errors
  }

  invalidFullName(){
    return this.submited && this.formUser.controls.name.errors
  }

  invalidPassword(){
    return this.submited && this.formUser.controls.password.errors
  }

  invalidPasswordConfimation(){
    return this.submited && this.formUser.controls.password.value != this.formUser.controls.passwordReapt.value
  }

  ngOnInit() {
    this.profiles = PROFILES
    this.formUser = this.formBuider.group({
      email:['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]],
      passwordReapt: ['', [Validators.required]],
      profile: ['ADMIN', [Validators.required]],
      img_profile: ['']
    })
  }

  public ngAfterViewInit() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
            if ('srcObject' in this.video.nativeElement) {
              this.video.nativeElement.srcObject = stream
            } else {
              this.video.nativeElement.src = window.URL.createObjectURL(stream);
            }
        });
    }
 }

 stopSteam(){
   this.video.nativeElement.pause()
 }

 
 profileUrl:any
  Capturar(){
    this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 133, 133);
    this.stopSteam()
    this.profileUrl = this.canvas.nativeElement.toDataURL('image/jpg')
    this.formUser.controls.img_profile.setValue(this.profileUrl)
  }

  onSubmit(){
    this.userCreated = false
    this.submited = true
    if(this.formUser.invalid){
       return;
    }else{
      delete this.formUser.value['passwordReapt']
      var user = new User(this.formUser.value)
      this.http.post('/api/user', user).subscribe((data)=>{
        this.userCreated = true
        setTimeout(() => {
          this.userCreated = false
        }, 3000);
      }, (error) =>{
        this.errorMessage = error.message

        setTimeout(()=>{
          this.errorMessage = null
        }, 3000)
      })
    }
  }

}