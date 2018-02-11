import { Component, ViewChild, OnInit, Output, EventEmitter, NgZone,OnDestroy } from '@angular/core';
import { NavController, Content, Platform ,ToastController,AlertController} from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { ChatModel, items, raw } from '../../model/chats.model';
import { ChatService } from '../../service/chat.service';
import { globalVar } from '../../global/globalVar';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { FaceRecognitionSevice } from '../../service/faceRecognition.service';
import 'rxjs/Rx';
import { Observable,Subject } from 'rxjs';
declare var cordova: any;
@Component({
  selector: 'chats-page',
  templateUrl: 'chats.html'
})
export class Chats implements OnInit,OnDestroy{
  @ViewChild(Content) content: Content;
  @ViewChild('myElement') myElem;


  private animator: AnimationBuilder;
  private inputMessage: string;
  private iconHandleInput: string = "mic";//defalut icon mic // mic is microphone
  private allMessages: ChatModel[] = new Array<ChatModel>();
  private message: ChatModel = new ChatModel();
  private loading: boolean = false;
  private dateOfSuccessOrder: Date;
  private micState = "michide";

  private selectItem:Subject<boolean> = new Subject();
  private cancelOrderedItem:Subject<boolean> = new Subject();


  constructor(
    private navCtrl: NavController,
    private animationService: AnimationService,
    private chatService: ChatService,
    private platform: Platform,
    private speechToText: SpeechRecognition,
    private faceRecognitionSevice: FaceRecognitionSevice,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.animator = animationService.builder();
    this.dateOfSuccessOrder = new Date();
    // this.chatService.voiceDetector('start');
  }
  ngOnInit() {
    //push first message bot 
    this.chatService.mapDataToModel(globalVar.chatterTypeBot, "ฉันสามารถช่วยอะไรคุณได้", globalVar.typeOfMessage.first, null)
      .then((messageBot) => {
        if (this.platform.is("mobileweb")) {
          this.loading = false;
          this.allMessages.push(messageBot);
        } else {
          this.loading = true;
          this.chatService.getTextToSpeech("สวัสดี").then((res) => {
            this.chatService.getTextToSpeech("ฉันสามารถช่วยอะไรคุณได้").then((res) => {
              this.allMessages.push(messageBot);
              this.loading = false;
              this.openMic();
              this.observEventVoiceDetector();
            });
          });
        }
      });
      this.platform.resume.subscribe((res)=>{
        // this.chatService.voiceDetector('stop');
      });
      this.navCtrl.viewDidEnter.subscribe((event)=>{
        // this.chatService.voiceDetector('start');
        console.info('%c👉 Component Page :', 'background:blue;color:white', event.name);
        // event.data && console.info('👉 Params Data :', event.data);
      });
  }
  ngOnDestroy(){
    console.info('%c👉 Component Page :', 'background:blue;color:white', "destroy");
    this.chatService.voiceDetector('leave');
  }
  private observEventVoiceDetector() {
    this.chatService.upadateEvenFromVoiceDetector().subscribe((event) => {
      if(event!="leave"){
        // event leave จะมีไม่มีการ return ส่วน stop จะ return
        this.openMic();
      }
      console.log("eventStatus", event);
    });
  }
  private animateElem() {
    this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }
  //detect input change
  private inputMessageChange() {
    if (!this.inputMessage) {
      this.iconHandleInput = "mic"
    } else {
      this.iconHandleInput = "send"
    }
  }
  private onKey() {
    this.micState = "michide"
  }
  // event by cilck
  private inputByClick() {
    if (this.iconHandleInput == "mic") {
      if (this.micState == "micshow") {
        this.micState = "michide";
      } else {
        this.chatService.voiceDetector('stop');
      }
    } else {
      this.loading = true; //waiting for bot process
      this.micState = "michide";
      this.chatService.getAllChats(this.inputMessage).subscribe((res) => {
        //ถ้า messeage ก่อนหน้า มีปุ่ม ให้ diable ปุ่ม
        this.disableButtonMessageBefore();
        //push message user
        this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null).then((messageUser) => {
          this.zone.run(() => {
            this.allMessages.push(messageUser);
          });
        });
        console.info("Bot Response", res);
        //push message bot
        this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, null, res).then((messageBot) => {
          if (messageBot.raw.type == globalVar.typeOfMessage.listOrder) {
            messageBot.message = messageBot.raw.ed;
          }
          if (messageBot.raw.type == globalVar.typeOfMessage.checkOut) {
            this.chatService.setInsertItem("22").subscribe((itemList) => {
              console.log(itemList);
              if(itemList.raw.type!=globalVar.typeOfMessage.noOrdered){
                itemList.raw.items.forEach((item,index)=>{
                  this.chatService.addToCart(item.product_id,item.qty).subscribe(()=>{
                    console.log("finish add to cart");
                    if(index===itemList.raw.items.length-1){
                      this.sendTextToSpeech(messageBot).then((res) => {
                        this.inputMessage = "";
                        this.loading = false;
                        if (!this.platform.is("mobileweb")) {
                          console.log("goToOpen Uearn");
                          let alert = this.alertCtrl.create({
                            title: 'Smart Chat',
                            subTitle: 'ชำระเงินเสร็จสมบูรณ์',
                            buttons: ['ตกลง']
                          });
                          alert.present();
                          // window.open('uearn://cart-page', '_system');
                        }
                        console.log("success to commit", res);
                      });
                    }
                  },(err)=>{
                    this.throwException(globalVar.typeOfError.general);
                  });
                });
              }else{
                this.sendTextToSpeech(messageBot);
              }
            },(err)=>{
              this.throwException(globalVar.typeOfError.general);
            });
          } else {
            this.sendTextToSpeech(messageBot);
          }
        });
      },(err)=>{
        this.throwException(globalVar.typeOfError.networkFail);
      });
    }
  }
  // private inputByMic() {
  //   console.log("inputByMic");
    //กรณีใช้เสียงเปิดไมค์ voice dectector จะปิด auto แต่ถ้ากรณีเราคลิก ต้องสั่งปิดไมค์เอง
  //   this.chatService.voiceDetector('stop');
  // }

  // event by only microphone
  private openMic(){
    // ui not upadate resolve by zone run
      this.zone.run(() => {
          this.micState = "micshow";
          this.loading = true;
          this.content.resize();
          this.autoScroll();
          this.chatService.getSpeechToText().then((res) => {
            this.inputMessage = res;
            this.chatService.getAllChats(this.inputMessage).subscribe((res) => {
              //ถ้า messeage ก่อนหน้า มีปุ่ม ให้ diable ปุ่ม
              this.disableButtonMessageBefore();
              //push message user
              this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null)
              .then((messageUser)=>{
                this.allMessages.push(messageUser);
              });
              console.info("Bot Response", res);
              //message bot
              this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, null, res).then((messageBot)=>{
                console.log(messageBot);
        
                if (messageBot.raw.type == globalVar.typeOfMessage.listOrder) {
                  messageBot.message = messageBot.raw.ed;
                }
                if (messageBot.raw.type != globalVar.typeOfMessage.checkOut) {    
                  this.chatService.getTextToSpeech(messageBot.message).then((res) => {
                    console.log("res3");
                    if(messageBot.raw.type == globalVar.typeOfMessage.result){
                      this.dateOfSuccessOrder = new Date();
                    }
                    this.inputMessage = "";
                    this.loading = false;
                    this.allMessages.push(messageBot);
                    this.openMic();
                  });
                } else {
                  this.chatService.setInsertItem("22").subscribe((itemList) => {
                    if(itemList.raw.type!=globalVar.typeOfMessage.noOrdered){
                      itemList.raw.items.forEach((item,index)=>{
                        this.chatService.addToCart(item.product_id,item.qty).subscribe((res)=>{
                          console.log(res);
                          if(index===itemList.raw.items.length-1){
                            this.sendTextToSpeech(messageBot).then((res) => {
                              this.inputMessage = "";
                              this.loading = false;
                              this.micState = "michide"
                              this.chatService.voiceDetector('start');
                              if (!this.platform.is("mobileweb")) {
                                let alert = this.alertCtrl.create({
                                  title: 'Smart Chat',
                                  subTitle: 'ชำระเงินเสร็จสมบูรณ์',
                                  buttons: ['ตกลง']
                                });
                                alert.present();
                                // console.log("goToOpen Uearn");
                                // window.open('uearn://cart-page', '_system');
                                  
                              }
                              console.log("success to commit", res);
                            });
                          }
                        },(err)=>{
                            this.chatService.throwException(globalVar.typeOfError.general);
                        });
                      });
                    }else{
                      this.chatService.voiceDetector('start');
                      this.sendTextToSpeech(messageBot);
                    }
                  },(err)=>{
                    this.throwException(globalVar.typeOfError.general);
                  });
                }
              });
            },(err)=>{
              this.throwException(globalVar.typeOfError.networkFail);
            });
          }).catch((err) => {
            if (this.platform.is("mobileweb")) {
            this.throwException(globalVar.typeOfError.micNotSupport);
            }else{
              this.throwException(globalVar.typeOfError.micTimeOut);
            }
          });
      });
  }
  private sendTextToSpeech(message: ChatModel): Promise<string> {
    //before text appear
    this.autoScroll();
    return new Promise((resolve, reject) => {
      if (this.platform.is("mobileweb")) {
        //push message bot
        this.allMessages.push(message);
        this.loading = false;
        this.inputMessage = "";
        // after text appear
        this.autoScroll();
        resolve("success to texttospeech");
      }else{
        this.chatService.getTextToSpeech(message.message).then((res) => {
          this.zone.run(() => {
            this.loading = false;
            this.inputMessage = "";
            // after text appear
            this.autoScroll();
            //push message bot
            this.allMessages.push(message);
            resolve("success to texttospeech");
          });
        }).catch((err)=>{
          this.throwException(globalVar.typeOfError.general);
        });
      }
    });
  }
  //sender by child component 
  private messageUpdate(event: ChatModel) {
    this.content.resize();
    this.autoScroll();
    this.allMessages.push(event);
  }

  private disableButtonMessageBefore(){
    let getTypeMessageBefore = this.allMessages.slice(-1).pop();
    console.log(getTypeMessageBefore);
    if(getTypeMessageBefore.raw.type== globalVar.typeOfMessage.listOrder){
      this.selectItem.next(true);
    }
    else if(getTypeMessageBefore.raw.type == globalVar.typeOfMessage.listOrdered){
      this.cancelOrderedItem.next(true);
    }
  }
  // onSuccessCallBack(res){
  //   console.log(res);
  // }
  // onErrorCallBack(err){
  //   console.log(err);
  // }
  private autoScroll() {
    setTimeout(function () {
        var itemList = document.getElementById("chat-autoscroll");
        itemList.scrollTop = itemList.scrollHeight;
    }, 10);
  }
  private throwException(status){
    this.loading = false;
    // this.inputMessage = "";
    this.micState = "michide";
    this.chatService.voiceDetector('start');
    this.chatService.throwException(status);
    this.content.resize();
  }
}
