import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { BotUi2 } from '../pages/bot-ui-flow2/bot-ui-flow2';
import { Chats } from '../pages/chats/chats';
import { FaceRecognition } from '../pages/chats/faceRecognition/faceRecognition';
import { ChatService } from '../service/chat.service';
declare var cordova:any;
declare var window:any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FaceRecognition;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public chatService:ChatService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'BOT UI 1', component: Chats },
      { title: 'BOT UI 2', component: BotUi2 },
      { title: 'Face Recognition', component: FaceRecognition }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.info("Start App");
      this.chatService.voiceDetector('initial');
    

      // cordova.plugins.vad.startDectection('initial',(ev) => this.success(ev), (ev) => this.error(ev));
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    window.plugins.OnDestroyPlugin.setEventListener (()=>{
      this.chatService.voiceDetector('destroy');
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  success(res) {
  }
  error(err) {
  }
}
