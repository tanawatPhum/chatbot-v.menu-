import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastController } from 'ionic-angular'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { ChatModel, items } from '../model/chats.model';
import { Http,RequestOptions, Headers,URLSearchParams} from '@angular/http';
import { globalVar } from '../global/globalVar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
declare var cordova:any;

@Injectable()
export class DataMakeService {
    private seqOrder:number=0;
    private subject = new Subject<any>();
    constructor(
        private http: Http,
        private speechToText:SpeechRecognition,
        private textToSpeech:TextToSpeech,
        private toastCtrl: ToastController
    ) {

    }
    getAllChats():Observable<ChatModel>{
            if(this.seqOrder==0){
                this.seqOrder++;
                let chatModel = new ChatModel();
                chatModel.chatterType = globalVar.chatterTypeBot;
                chatModel.chatterName = globalVar.chatterNameBot;
                chatModel.message = "รายการที่คุณเลือกมีดังต่อไปนี้";
                chatModel.chatterImg = globalVar.chatterImgBot;
                chatModel.positionChatterImg = globalVar.positionChatterImgLeft;
                chatModel.raw.ed = "กรุณาเลือกรายการ";
                chatModel.raw.type = globalVar.typeOfMessage.listOrder;
                let item = new items();
                item.caption = "แฮมเบอร์เกอร์";
                item.img = "assets/img/hamburger.jpg";
                item.price = 20;
                chatModel.raw.items.push(item);
                this.subject.next(chatModel);
                return this.subject.asObservable();
            }

      
    }

}