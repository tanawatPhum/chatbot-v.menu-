import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimatorModule } from 'css-animator';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MultiPickerModule } from 'ion-multi-picker';
import { BotUi2 } from '../pages/bot-ui-flow2/bot-ui-flow2';
import { ChatService } from '../service/chat.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MomentModule } from 'angular2-moment';
import { Chats } from '../pages/chats/chats';
import { MessageComponent } from '../pages/chats/message/message';
import { FaceRecognition } from '../pages/chats/faceRecognition/faceRecognition';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FaceRecognitionSevice } from '../service/faceRecognition.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Chats,
    BotUi2,
    MessageComponent,
    FaceRecognition,
 

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MultiPickerModule,
    HttpModule,
    MomentModule,
    BrowserAnimationsModule,
    AnimatorModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BotUi2,
    MessageComponent,
    FaceRecognition,
    Chats,
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    StatusBar,
    SplashScreen,
    ChatService,
    SpeechRecognition,
    TextToSpeech,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FaceRecognitionSevice,
    FileTransfer,
    Camera,
    File
  ]
})
export class AppModule {}
