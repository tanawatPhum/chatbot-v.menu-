export class globalVar{
    //common variable
    public static chatterTypeUser = "user";
    public static chatterTypeBot = "bot";
    public static chatterImgUser = "assets/img/user.jpg";
    public static chatterImgBot = "assets/img/bot.png";
    public static positionChatterImgRight = "right";
    public static positionChatterImgLeft = "left";

    public static chatterNameUser="user";
    public static chatterNameBot="bot";
    //url1
    // public static requestBotMessageUrl = "http://192.168.11.65:8080";
    // public static requestFaceRegonitionUrl = "http://192.168.11.65:8080";
    //url2
    // public static requestBotMessageUrl = "http://61.90.160.218:8080";
    // public static requestFaceRegonitionUrl = "http://61.90.160.218:8080";
    //url3

    // public static requestBotMessageUrl = "http://192.168.0.71:8080";
    // public static requestFaceRegonitionUrl = "http://192.168.0.71:8080";
    public static requestBotMessageUrl = "http://61.90.160.218:8080";
    public static requestFaceRegonitionUrl = "http://61.90.160.218:8080";
    //lang
    public static requestAuthen = "http://jssr.oneweb.tech";
    // public static requestEAF = "http://192.168.0.167:8080";
    public static requestEAF = "http://jssr.oneweb.tech";
   
    public static lang={
        th:"th-TH"
    }
    //messageType
    public static typeOfMessage = {
        first:"FIRST_MSG",
        listOrder:"LIST_ORDER", //bot ถามว่าจะเลือกรายการไหน
        confirm:"CONFIRM_ORDER",//หลัง user เลือกรายการ bot ถามว่า คุณต้องการยืนยันใช่ไหม
        result:"ORDER_SUCCESS",// หลัง ยืนยันรายการ 
        checkOut:"CHECK",
        listOrdered:"LIST_ORDERED",
        cancelOrder:"CANCEL_ORDER",
        noOrdered:"NO_ORDERED"
        
    }
    //errorType
    public static typeOfError = {
        general:"เกิดข้อผิดพลาดขณะทำรายการ",
        micNotSupport:"ไม่สามารถใช้ไมค์บนอุปกรณ์ของคุณได้",
        networkFail:"ไม่สามารถติดต่อเซิฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง",
        micTimeOut:"กรุณาลองใหม่อีกครั้ง"
    }
}