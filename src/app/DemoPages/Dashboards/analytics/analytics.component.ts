import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {Color} from 'ng2-charts/ng2-charts';
import {Router} from '@angular/router'
import { Observable } from 'rxjs'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PubNub } from "../../../../../node_modules/pubnub"

const pubnub = new PubNub({
  publishKey: "pub-c-e5c8e409-367f-4eb2-8d95-0d93e5fdfd8b",
  subscribeKey:"sub-c-4c1671dc-347a-11ea-b8ef-b6462cb07a90",
  ssl:true
});

pubnub.subscribe({
  channels: ['chan-1'],
});

pubnub.addListener({
  message: function(m) {
      var channelName = m.channel; // The channel for which the message belongs
      var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
      var pubTT = m.timetoken; // Publish timetoken
      var msg = m.message; // The Payload
      var publisher = m.publisher; //The Publisher
      
      if(channelName === 'chan-1'){
         var id_medicao = msg.message.split("\n")[2].trim()
         this.http.get(`https://pfc2020-api.herokuapp.com/api/medicao/${id_medicao}`).subscribe((medicao:any)=>{
             if(!this.alertEmergenceList)
                 this.alertEmergenceList = []
             this.alertEmergenceList.unshift(medicao)
         }, (error)=>{
             console.log(error)
          })
      }
  },
  presence: function(p) {
      // handle presence
      var action = p.action; // Can be join, leave, state-change or timeout
      var channelName = p.channel; // The channel for which the message belongs
      var occupancy = p.occupancy; // No. of users connected with the channel
      var state = p.state; // User State
      var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
      var publishTime = p.timestamp; // Publish timetoken
      var timetoken = p.timetoken;  // Current timetoken
      var uuid = p.uuid; // UUIDs of users who are connected with the channel
  },
  signal: function(s) {
      // handle signal
      var channelName = s.channel; // The channel for which the signal belongs
      var channelGroup = s.subscription; // The channel group or wildcard subscription match (if exists)
      var pubTT = s.timetoken; // Publish timetoken
      var msg = s.message; // The Payload
      var publisher = s.publisher; //The Publisher
  },
  user: function(userEvent) {
      // for Objects, this will trigger when:
      // . user updated
      // . user deleted
  },
  space: function(spaceEvent) {
      // for Objects, this will trigger when:
      // . space updated
      // . space deleted
  },
  membership: function(membershipEvent) {
      // for Objects, this will trigger when:
      // . user added to a space
      // . user removed from a space
      // . membership updated on a space
  },
  messageAction: function(ma) {
      // handle message action
      var channelName = ma.channel; // The channel for which the message belongs
      var publisher = ma.publisher; //The Publisher
      var event = ma.message.event; // message action added or removed
      var type = ma.message.data.type; // message action type
      var value = ma.message.data.value; // message action value
      var messageTimetoken = ma.message.data.messageTimetoken; // The timetoken of the original message
      var actionTimetoken = ma.message.data.actionTimetoken; //The timetoken of the message action
  },
  status: function(s) {
      var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
      var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
      var category = s.category; //Returns PNConnectedCategory
      var operation = s.operation; //Returns PNSubscribeOperation
      var lastTimetoken = s.lastTimetoken; //The last timetoken used in the subscribe request, of type long.
      var currentTimetoken = s.currentTimetoken; //The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
      var subscribedChannels = s.subscribedChannels; //All the current subscribed channels, of type array.
  }
});

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
