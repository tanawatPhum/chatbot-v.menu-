import { Injectable } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { ToastController, AlertController, Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs';
import { globalVar } from '../global/globalVar';

@Injectable()
export class FaceRecognitionSevice {
    public static CAMERA_CANCELLED = 'Camera cancelled.';
    public static CAMERA_SELECTION = 'Selection cancelled.';
    public static RES_ERROR = "Face not found";
    private loading: any;
    private _faceUser:string;
    private _nameUser:string;
    private _idUser:string;
    private _idToken:string;
    private _idCookie:string;
    constructor(
        private camera: Camera,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private transfer: FileTransfer,
        private file: File,
        private actionSheetCtrl: ActionSheetController,
        private loadingCtrl: LoadingController
    ) { }
    get faceUser(){
        return this._faceUser;
    }
    set faceUser(pic:string){
        this._faceUser = pic;
    }
    get nameUser(){
        return this._nameUser;
    }
    set nameUser(name:string){
        this._nameUser = name;
    }
    get idUser(){
        return this._idUser;
    }
    set idUser(id:string){
        this._idUser = id;
    }
    get idToken(){
        return this._idToken;
    }
    set idToken(id:string){
        this._idToken = id;
    }
    get idCookie(){
        return this._idCookie;
    }
    set idCookie(id:string){
        this._idCookie = id;
    }
    // public requestPicture(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         this.takePictureFromSource(this.camera.PictureSourceType.CAMERA).subscribe(imagePath => {
    //             this.loading = this.loadingCtrl.create({
    //                 content: 'ระบบกำลังประมวลผล รอสักครู่...'
    //             });
    //             this.loading.present();
    //             this.uploadFileTranfer(imagePath).then((res) => {
    //                 this.loading.dismiss();
    //                 let resDetect = JSON.parse(res.response);
    //                 console.log("resDetect", resDetect);
    //                 if (resDetect.error === FaceRecognitionSevice.RES_ERROR) {
    //                     reject("failed");
    //                 } else {
    //                     this.facePicture = imagePath;
    //                     this.nameUser = resDetect.name
    //                     resolve("Success");
    //                 }

    //             }).catch((err) => {
    //                 this.loading.dismiss();
    //             });
    //         }, (error) => {
    //             if (error !== FaceRecognitionSevice.CAMERA_CANCELLED) {
    //                 this.loading.dismiss();
    //                 console.log('⚠️ Error during take picture :', error);
    //                 this.alertCtrl.create({
    //                     title: `คำเตือน`,
    //                     message: `เกิดข้อผิดพลาดขณะถ่ายใบหน้ายืนยันตัวตน`,
    //                 }).present();
    //                 reject(error);
    //             }
    //         });

    //         this.actionSheetCtrl.create({
    //             title: 'เลือกรูปจากแหล่งที่มา',
    //             buttons: [
    //               {
    //                 text: 'ไลบรารี่',
    //                 handler: () => {
    //                   this.takePictureFromSource(this.camera.PictureSourceType.PHOTOLIBRARY).subscribe(imagePath => {
    //                     this.loading = this.loadingCtrl.create({
    //                         content: 'ระบบกำลังประมวลผล รอสักครู่...'
    //                     });
    //                     this.loading.present();
    //                       this.uploadFileTranfer(imagePath).then((res)=>{
    //                         this.loading.dismiss();
    //                           let resDetect = JSON.parse(res.response);
    //                           console.log("resDetect",resDetect);
    //                             if(resDetect.error===FaceRecognitionSevice.RES_ERROR){
    //                                 reject("failed");
    //                             }else{
    //                                 resolve(imagePath);
    //                             }
    //                           console.log("res form file tranfer",res)
    //                       }).catch((err)=>{
    //                         console.warn(err);
    //                         this.loading.dismiss();
    //                       });
    //                   }, (error) => {
    //                     if (error !== FaceRecognitionSevice.CAMERA_CANCELLED&&error !==FaceRecognitionSevice.CAMERA_SELECTION) {
    //                     this.loading.dismiss();
    //                       console.log('⚠️ Error during take picture :', error);
    //                       this.alertCtrl.create({
    //                         title: `คำเตือน`,
    //                         message: `เกิดข้อผิดพลาดขณะเลือกรูป`,
    //                       }).present();
    //                       reject(error);
    //                     }

    //                   });
    //                 }
    //               },
    //               {
    //                 text: 'กล้อง',
    //                 handler: () => {
    //                   this.takePictureFromSource(this.camera.PictureSourceType.CAMERA).subscribe(imagePath => {
    //                         this.loading = this.loadingCtrl.create({
    //                             content: 'ระบบกำลังประมวลผล รอสักครู่...'
    //                         });
    //                         this.loading.present();
    //                       this.uploadFileTranfer(imagePath).then((res)=>{
    //                         this.loading.dismiss();
    //                         let resDetect = JSON.parse(res.response);
    //                         console.log("resDetect",resDetect);   
    //                         if(resDetect.error===FaceRecognitionSevice.RES_ERROR){
    //                             reject("failed");
    //                         }else{
    //                             resolve(imagePath);
    //                         }

    //                       }).catch((err)=>{
    //                         console.warn(err);
    //                         this.loading.dismiss();
    //                       });
    //                   }, (error) => {
    //                     if (error !== FaceRecognitionSevice.CAMERA_CANCELLED) {
    //                     this.loading.dismiss();
    //                       console.log('⚠️ Error during take picture :', error);
    //                       this.alertCtrl.create({
    //                         title: `คำเตือน`,
    //                         message:`เกิดข้อผิดพลาดขณะถ่ายรูป`,
    //                       }).present();
    //                       reject(error);
    //                     }
    //                   });
    //                 }
    //               },
    //               {
    //                 text: 'ยกเลิก',
    //                 role: 'cancel'
    //               }
    //             ]
    //           }).present();
    //     })
    // }
    // public takePictureFromSource(sourceType: PictureSourceType, isStoreLocal?: boolean): Observable<string> {
    //     const options = {
    //         quality: 80,
    //         sourceType: sourceType,
    //         saveToPhotoAlbum: true,
    //         correctOrientation: true
    //     };
    //     return Observable.fromPromise(this.camera.getPicture(options));
    // }
    // public uploadFileTranfer(path: string): Promise<FileUploadResult> {
    //     return new Promise((resolve, reject) => {
    //         let fileName = this.getFileName(path);
    //         console.info("fileName", fileName);
    //         console.info("filePath", path);
    //         const options: FileUploadOptions = {
    //             fileKey: 'faceim',
    //             fileName: fileName,
    //             chunkedMode: false
    //         }
    //         const fileTransfer: FileTransferObject = this.transfer.create();
    //         fileTransfer.upload(path, globalVar.requestFaceRegonitionUrl + "/face/verify", options)
    //             .then((data) => {
    //                 resolve(data)
    //             }, (err) => {
    //                 reject(err);
    //             })
    //     })
    // }
    private getFileName(pathStr: string): string {
        if (!(pathStr.toString().trim() === '' && pathStr.toString().trim().length == 0)) {
            let endIdx = pathStr.split('/');
            let _pathStr = endIdx.pop();
            _pathStr = (_pathStr || "").split('?')[0];
            return _pathStr;
        } else {
            return "";
        }
    }

  





}