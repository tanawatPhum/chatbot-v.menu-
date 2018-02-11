export class ChatModel{
    public chatterType:string;
    public message:string;
    public chatterImg:string;
    public positionChatterImg:string;
    public chatterName:string;
    public raw:raw = new raw();

}
export class raw{
    public ed:string;
    public st:string;
    public items:items[] = new Array<items>();
    public type:string;
    
}
export class items{
    public caption:string;
    public img:string;
    public price:number;
    public seq:number;
    public totalPrice:number;
    public qty:number;
    public product_id:number;
}