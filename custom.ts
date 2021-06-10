
/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

enum MyColorEnum {
    //% block="red"
    RED=1,
    //% block="green"
    GREEN,
    //% block="yellow"
    YELLOW,
    //% block="blue"
    BLUE,
    //% block="purple"
    PURPLE,
    //% block="cyan"
    CYAN,
    //% block="white"
    WHITE,
    //% block = "quench"
    QUENCH=0
}
enum MyMemeEnum{
    //% block="Dizzy"
    DIZZY,
    //% block="Naughty"
    NAUGHTY,
    //% block="Rolling eyes"
    ROLLINGEYES,
    //% block="Sad"
    SAD,
    //% block="Honest"
    HONEST,
    //% block="Wink"
    Wink,
    //% block="Happy"
    HAPPY, 
    //% block="Question Mark"
    QUESTIONMARK, 
    //% block="Worried"
    WORRIED,
    //% block="Pleading face"
    PLEADING,
    //% block="Expressionless"
    EXPRESSIONLESS,
    //% block="Serious"
    SERIOUS, 
    //% block="Robot"
    ROBOT, 
    //% block="Disapointed"
    DISAPOINTED, 
    //% block="Sweet"
    SWEET, 
    //% block="Nerd face"
    NERDFACE, 
    //% block="Cute"
    CUTE, 
    //% block="Astonished"
    ASTONISHED, 
    //% block="Anguished"
    ANGUISHED, 
    //% block="Satisfied"
    SATISFIED, 
    //% block="Act cute"
    ACTCUTE,
    //% block="Dazzled"
    DAZZLED, 
    //% block="Laugh"
    LAUGH
}
enum MyDirEnum{
    //% block="left"
    LEFT = (0X0 << 1),
    //% block="right"
    RIGHT = (0X1 << 1),
    //% block="none"
    NONE = 0X11
}

/**
 * 自定义图形块
 */
//% weight=100 color=#0fbc11 icon="" block="RGB Panel"
namespace custom {
    let addr = 0x10;
    let dir = 0;
    
    /**
     * TODO: 显示字符串
     * @param s 需要显示的字符串, eg: "DFRobo"
     * @param e 显示颜色枚举
     */
    //% block="display string %s for color %e"
    //% weight=99
    export function print(s: string, e: MyColorEnum): void {
       let len = s.length();
       if(len>40){
        basic.showIcon(IconNames.No);
        basic.pause(100);
        basic.clearScreen();
       }
       let buf = pins.createBuffer(len+6);
       buf[0]=0x02;
       buf[1] = (dir&0xe6)|(0x03<<3);
       buf[2] = e;
       for(let i = 0; i < len; i++){
           buf[6+i]=s.charCodeAt(i);
       }
       pins.i2cWriteBuffer(addr, buf);
       
    }

    /**
     * TODO: 滚动显示
     * @param e 选择滚动方向
     */
    //% block="sets to scroll to the %e "
    //% weight=98
    export function scroll(e: MyDirEnum): void {
        switch(e){
            case MyDirEnum.LEFT:
                dir |= (0x01<<2);
                dir &= (~(0x01<<1));
            break;
            case MyDirEnum.RIGHT:
                dir |= (0x01<<2)|(0x01<<1);
            break;
            default:
                dir &= (~(0x01<<2));
        }
    }
    /**
     * TODO: 指定某个像素点显示
     * @param x x坐标
     * @param y y坐标
     * @param e 显示颜色
     */
    //% block="at X %x Y %y pixel display for color %e"
    //% x.min=0 x.max=7 
    //% y.min=0 y.max=15
    //% weight=97
     export function pixel(x:number, y:number, e: MyColorEnum): void {
        let buf = pins.createBuffer(5);
        buf[0] = 0x02;
        buf[1] = (dir & (0xe6)) | (0x01 << 3);
        buf[2] = e;
        buf[3] = x;
        buf[4] = y;
        pins.i2cWriteBuffer(addr, buf);
     }

     /**
      * TODO: 清空显示
      */
    //% block="clear display"
    //% weight=50
    export function clear():void{
        let buf = pins.createBuffer(51);
        buf[0]=0x02;
        buf[1]=0x10;
        for(let i = 0; i < 49;i++){
            buf[i+2]=0;
        }
        pins.i2cWriteBuffer(addr, buf);
    }

    /**
     * TODO:全部显示
     * @param e 显示颜色
     */
    //% block="all display color %e"
    //% weight=95
    export function fillScreen(e:MyColorEnum):void{
        let buf = pins.createBuffer(5);
        buf[0] = 0x02;
        buf[1] = (0x1 & (0xe7)) | (0x01 << 3);
        buf[2] = e;
        buf[3] = 0;
        buf[4] = 0;
        pins.i2cWriteBuffer(addr, buf);
    }

    /**
     * TODO:显示内置表情
     * @param index显示内置表情
     * @param e 显示颜色
     */
    //% block="dispaly expression %index for color %e"
    //% weight=94
    export function display(index:MyMemeEnum,e:MyColorEnum):void{
        let buf = pins.createBuffer(6);
        buf[0] = 0x02;
        buf[1] = (dir & (0xe6)) | (0x02 << 3);
        buf[2] = e;
        buf[5] = index;
        pins.i2cWriteBuffer(addr, buf);
    }

}
