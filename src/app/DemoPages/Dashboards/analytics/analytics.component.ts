import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {Color} from 'ng2-charts/ng2-charts';
import {Router} from '@angular/router'
import { Observable } from 'rxjs'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {

  constructor(private router: Router, private modalService:NgbModal, private http:HttpClient){}
  heading = 'Painel de controle';
  subheading = 'Aquí pode ser visualizado os principais eventos ocorridos em dispositivos.';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';
  deviceList:any
  alertEmergenceList:Array<any>
  medicoesRequisicao:Array<any>
  zoom: number = 15;

  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };

  public datasets = [
    {
      label: 'My First dataset',
      data: [65, 59, 80, 81, 46, 55, 38, 59, 80],
      datalabels: {
        display: false,
      },

    }
  ];

  public datasets2 = [
    {
      label: 'My First dataset',
      data: [46, 55, 59, 80, 81, 38, 65, 59, 80],
      datalabels: {
        display: false,
      },

    }
  ];

  public datasets3 = [
    {
      label: 'My First dataset',
      data: [65, 59, 80, 81, 55, 38, 59, 80, 46],
      datalabels: {
        display: false,
      },

    }
  ];
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(247, 185, 36, 0.2)',
      borderColor: '#f7b924',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#f7b924',
      pointBackgroundColor: '#fff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#f7b924',
    },
  ];

  public lineChartColors2: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(48, 177, 255, 0.2)',
      borderColor: '#30b1ff',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#30b1ff',
      pointBackgroundColor: '#ffffff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#30b1ff',
    },
  ];

  public lineChartColors3: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(86, 196, 121, 0.2)',
      borderColor: '#56c479',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#56c479',
      pointBackgroundColor: '#fff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#56c479',
    },
  ];

  public labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

  public options = {
    layout: {
      padding: {
        left: 0,
        right: 8,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit() {
    var tentativa = 0 
    var interVal = setInterval(()=>{
      this.getDevices().subscribe((devices)=>{
        this.deviceList = devices
        console.log(JSON.stringify(this.deviceList[0]))
        clearInterval(interVal)
      }, (error)=>{
        this.deviceList = []
        console.log(error)
        tentativa++
        if(tentativa === 9){
          clearInterval(interVal)
        }
      })
    }, 1000)
    
    this.http.get('https://pfc2020-api.herokuapp.com/api/medicao/get_medicao_alert').subscribe((medicaoResult:any)=>{
       if(medicaoResult.data){
         if(this.alertEmergenceList ==  null)
             this.alertEmergenceList = []
          for(var emergencia of medicaoResult.data){
            var add = true
            for(var inserted of this.alertEmergenceList){
                 if(inserted._id === emergencia._id)
                    add = false
            }

            if(add)
              this.alertEmergenceList.unshift(emergencia)
          } 
       }    
    }, (error)=>{
       console.log(error)
    })

    this.http.get('https://pfc2020-api.herokuapp.com/api/medicao/get_medicao_normal').subscribe((medicaoResult:any)=>{
        this.medicoesRequisicao = medicaoResult.data
    }, (error)=>{
        console.log(error)
    }) 
  }

  parseData(dtSTR:String){
      return dtSTR.replace(/-/g, '/')   
  }

  getDevices(){
    return new Observable((observer)=>{
       var devices = JSON.parse(localStorage.getItem('deviceList'))
       if(devices)
         observer.next(devices)
       else
         observer.error("Dispositivos não encontrados!")
       return {
        unsubscribe() {
  
        }
      };
    })
  }

  configurarDispositivo(device){
    this.router.navigate(['/device/edit'], {state: {data: device}});
  }

  obterMedicao(device){

  }

  paraFloat(val){
     return parseFloat(val)
  }
  
  temperatura_ambiente:Number
  umidade_ambiente:Number
  temperatura_ambiente2:Number
  temperatura_media:Number

  umidade_ambiente2:Number
  temperatura_ambiente3:Number
  umidade_ambiente3:Number
  umidade_media:Number
  
  co2:Number
  tvco:Number
  device_temperature:Number
  data_medicao:String
  open(content, device) {
    let self = this
    this.http.post('https://pfc2020-api.herokuapp.com/api/device/get_last_medicao', device).subscribe((medicao:any)=>{
       if(medicao.success){
         this.temperatura_ambiente = medicao.last_temperature1
         this.temperatura_ambiente2 = medicao.last_temperature2
         this.temperatura_ambiente3 = medicao.last_temperature3
         this.temperatura_media = medicao.last_media_temperatura

         this.umidade_ambiente = medicao.last_humidity1
         this.umidade_ambiente2 = medicao.last_humidity2
         this.umidade_ambiente3 = medicao.last_humidite3
         this.umidade_media = medicao.last_media_humidity

         this.co2 = medicao.last_co2
         this.tvco = medicao.last_tvco
         this.device_temperature = medicao.last_device_temperature_measurement
         this.data_medicao = medicao.data_medicao.replace(/-/g, '/')
       }
    }, (error)=>{
       console.log(error)
    })

    this.modalService.open(content).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      self.temperatura_ambiente = null
      self.umidade_ambiente = null
      self.device_temperature = null
      self.data_medicao = null
    }, (reason) => {
      console.log(reason)
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deviceAtual:any = null
  serchDevice(content1, id_dispositivo){
    let self = this
    this.http.get(`https://pfc2020-api.herokuapp.com/api/device/${id_dispositivo}`).subscribe((device:any)=>{
         self.deviceAtual = device
    })
    
    this.modalService.open(content1).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      
    }, (reason) => {
      console.log(reason)
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  } 

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
   

}
