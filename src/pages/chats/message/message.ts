import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy,AfterViewInit } from '@angular/core';
import { NavController, Content, Platform } from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { ChatModel, items, raw } from '../../../model/chats.model';
import { ChatService } from '../../../service/chat.service';
import { globalVar } from '../../../global/globalVar';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { FaceRecognitionSevice } from '../../../service/faceRecognition.service';
import { Observable,Subject } from 'rxjs';
@Component({
    selector: 'message',
    templateUrl: 'message.html',
    styleUrls: ['/message.scss']
})
export class MessageComponent implements OnInit, OnChanges{
    @Output('messageEmitter')
    private messageEmitter: EventEmitter<ChatModel> = new EventEmitter<ChatModel>();
    @Input('message') message: ChatModel;
    @Input('cancelOrderedItem') cancelOrderedItemEvent:Subject<boolean>;;
    @Input('selectItem') selectItemEvent:Subject<boolean>;

    private numberItem = 1;
    private loading: boolean = false;
    private dateOfSuccessOrder: Date;
    private selectItem: boolean = false;
    private confirmItem: boolean = false;
    private cancelOrderedItem: boolean = false;
    private requestBotMessageUrl: string = globalVar.requestBotMessageUrl;
    private typeOfMessageListOrder = globalVar.typeOfMessage.listOrder;
    private typeOfMessageFirst = globalVar.typeOfMessage.first;
    private animator: AnimationBuilder;
    private checkValueIsChange:boolean = false;


    constructor(
        private navCtrl: NavController,
        private animationService: AnimationService,
        private chatService: ChatService,
        private platform: Platform,
        private faceRecognitionSevice: FaceRecognitionSevice
    ) {
        this.animator = animationService.builder();
        this.dateOfSuccessOrder = new Date();
    }
    ngOnInit() {
        //event ต้องเท่ากับ true
        this.selectItemEvent.subscribe(event => {
            if(this.message.raw.type==globalVar.typeOfMessage.listOrder&&event){
                this.selectItem = event;
            }
        });
        this.cancelOrderedItemEvent.subscribe(event => {
            if(this.message.raw.type==globalVar.typeOfMessage.listOrdered&&event){
                this.cancelOrderedItem = event;
            }
        });
    }
    ngOnChanges() {}

    //only click event 
    private sendSelectItem(item: items, seq: number) {
        this.loading = true;
        this.selectItem = true;
        this.chatService.mapDataToModel(globalVar.chatterTypeBot, "คุณต้องการยืนยันสิ่งที่เลือกหรือไม่", globalVar.typeOfMessage.confirm, null)
            .then((messageBot) => {
                messageBot.raw.items[0] = item;
                this.sendTextToSpeech(messageBot);
            });
    }
    private sendConfrimItem(messageUser: ChatModel) { //only event click
        this.loading = true;
        this.confirmItem = true;
        console.log(messageUser);
        // this.faceRecognitionSevice.faceUser = "tanawat.phum";
        // this.chatService.setInsertItem(this.faceRecognitionSevice.faceUser).subscribe((res)=>{
        //     console.log(res);
        // })
        // this.chatService.getCalPriceItem(messageUser.raw.items[0].seq,this.numberItem).subscribe((res)=>{
        //     console.log(res);
        // })
        // this.chatService.setInsertItem(this.faceRecognitionSevice.idUser)
        // let reg = /(\d\.|\d\d\.|\d\d\d\.|\d\d\d\d\.|\d\d\d\d\d\.)/
        // let item = messageUser.raw.items[0].caption.replace(reg, '') + ' ' + messageUser.raw.items[0].qty + 'ชิ้น';
        this.chatService.getCalPriceItem(messageUser.raw.items[0].product_id, messageUser.raw.items[0].qty).subscribe((res) => {
            this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, globalVar.typeOfMessage.result, res)
                .then((messageBot) => {
                    this.sendTextToSpeech(messageBot);
                });
        },(err)=>{
            this.chatService.throwException(globalVar.typeOfError.networkFail);
        })

        // messageBot.raw.items[0] = messageUser.raw.items[0];
        // console.log(messageUser.raw.items);
        // messageBot.raw.items[0].price = messageUser.raw.items[0].price * this.numberItem;
    }
    private sendCancleItem() {
        this.loading = true;
        this.confirmItem = true;
        this.chatService.mapDataToModel(globalVar.chatterTypeBot, "คุณได้ทำการยกเลิกรายการ", null, null).then((messageBot) => {
            this.sendTextToSpeech(messageBot);
        });
    }
    private sendCancleOrderedItem(item: items) {
        this.cancelOrderedItem = true;
        this.chatService.getCancelOrderedItem(item.product_id).subscribe((res) => {
            this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, globalVar.typeOfMessage.result, res)
            .then((messageBot) => {
                this.sendTextToSpeech(messageBot);
            });
        },(err)=>{
            this.chatService.throwException(globalVar.typeOfError.networkFail);
        });
    }
    private sendTextToSpeech(message: ChatModel) {
        if (this.platform.is("mobileweb")) {
            //push message bot
            this.messageEmitter.emit(message);
            this.loading = false;
        }else{
            this.chatService.getTextToSpeech(message.message).then((res) => {
                this.messageEmitter.emit(message);
                this.loading = false;
            }).catch((err)=>{
                this.chatService.throwException(globalVar.typeOfError.networkFail);
            });
        }
    }
    private incrementItem(item: items) {
        this.numberItem++;
        item.qty = this.numberItem;
        item.totalPrice = item.price * this.numberItem;
    }

    private decrementItem(item: items) {
        if (this.numberItem > 1) {
            this.numberItem--;
            item.qty = this.numberItem;
            item.totalPrice = item.price * this.numberItem;
        }
    }
    //sender by parent component when seleted item
    private selectItemUpdate(event: boolean) {
        this.selectItem = false;
    }

}
