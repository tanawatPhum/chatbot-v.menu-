import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';

@Component({
  selector: 'bot-ui-flow2',
  templateUrl: 'bot-ui-flow2.html'
})
export class BotUi2 {
  private currentNumber = 1;
  private currentNumber2 = 0;
  private increment() {
    this.currentNumber++;
  }

  private decrement() {
    this.currentNumber--;
  }


  @ViewChild(Content) content: Content;
  @ViewChild('myElement') myElem;
  private animator: AnimationBuilder;

  public Loading1: boolean = false;
  public Loading2: boolean = false;
  public Loading3: boolean = false;
  public mgbot: string = '0px';
  public Mic1: boolean = true;
  public Mic2: boolean = false;
  public Mic3: boolean = false;
  public Mic4: boolean = false;
  public buttonClicked: boolean = false;
  public UserMessage: boolean = false;
  public UserMessage2: boolean = false;
  public UserMessage3: boolean = false;
  public MicAC1: boolean = false;
  public MicAC2: boolean = false;
  public MicAC3: boolean = false;
  public MicAC4: boolean = false;
  public BotAC1: boolean = false;
  public BotAC2: boolean = false;
  public BotAC3: boolean = false;

  public Mic1HideShowMic2() {
    this.MicAC1 = !this.MicAC1;
    if (this.MicAC1 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }
  }
  public MicAC2ShowHide() {
    this.MicAC2 = !this.MicAC2;
    if (this.MicAC2 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }
  }

  public MicAC3ShowHide() {
    this.MicAC3 = !this.MicAC3;
    if (this.MicAC3 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }
  }

  public MicAC4ShowHide() {
    this.MicAC4 = !this.MicAC4;
    if (this.MicAC4 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }
  }

  public InputHideMic() {

    this.MicAC1 = false;
    this.MicAC2 = false;
    this.MicAC3 = false;
    this.MicAC4 = false;

    if (this.MicAC1 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }

    if (this.MicAC2 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }

    if (this.MicAC3 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }

    if (this.MicAC4 == false) {
      this.mgbot = '0px';
    }
    else {
      this.mgbot = '125px';
    }
  }

  public MicClickedShow() {

    setTimeout(() => {
      this.UserMessage = !this.UserMessage;
    }, 300)
    this.Mic1 = false;
    this.Mic2 = true;
    this.MicAC1 = false;
    this.MicAC2 = true;
    setTimeout(() => {
      this.Loading1 = true;
    }, 700)
    setTimeout(() => {
      this.Loading1 = false;
    }, 2000)
    setTimeout(() => {
      this.BotAC1 = true;
    }, 2000)

  }


  public MicAc2Click() {
    this.Mic2 = false;
    this.MicAC2 = false;
    this.Mic3 = true;
    this.MicAC3 = true;
    this.UserMessage2 = true;
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 100)
    setTimeout(() => {
      this.Loading2 = true;
    }, 700)
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 800)
    setTimeout(() => {
      this.Loading2 = false;
    }, 2000)
    setTimeout(() => {
      this.BotAC2 = true;
    }, 2000)
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 2100)
  }

  public MicAc3Click() {
    this.Mic3 = false;
    this.MicAC3 = false;
    this.MicAC4 = true;
    this.Mic4 = true;
    this.UserMessage3 = true;
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 100)
    setTimeout(() => {
      this.Loading3 = true;
    }, 700)
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 800)
    setTimeout(() => {
      this.Loading3 = false;
    }, 2000)
    setTimeout(() => {
      this.BotAC3 = true;
    }, 2000)
    setTimeout(() => {
      this.content.scrollToBottom(300)
    }, 2100)
  }

  public MicAction2Show() {

    this.MicAC2 = !this.MicAC2;
  }


  constructor(public navCtrl: NavController, animationService: AnimationService) {
    this.animator = animationService.builder();
  }
  animateElem() {
    this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }

}
