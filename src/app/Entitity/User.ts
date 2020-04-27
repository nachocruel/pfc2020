export const PROFILES:Array<String> = [
    'ADMIN', 
    'USER'
]

export class User {
   _id:String
   name: String
   email: String
   img_profile: String
   passoword: String
   profile: String = PROFILES[0]

   constructor(obj:User = null){
       if(obj){
           Object.assign(this, obj)
       }
   }
}