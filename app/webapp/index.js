sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";

	return ManagedObject.extend("project1.index", {
	});
});sap.ui.define([

], function () {
    "use strict";

    // alert("UI5 is ready");
    /*
    document.write('안녕하세요. 만나서 반갑습니다. <br>');
    var a= 10;
    document.write(`${a} <br/>`);
    document.write(`${typeof a} <br/>`);
    
    var num1 = 15, num2= 2;
    var result;
    result = num1 + num2;
    document.write(`${result} <br/>`);
    result = num1 - num2;
    document.write(`${result} <br/>`);
    result = num1 * num2;
    document.write(`${result} <br/>`);
    result = num1 / num2;
    document.write(`${result} <br/>`);
    result = num1 % num2;
    document.write(`${result} <br/>`);
    var t1 = " 학교종이", t2="땡땡땡", t3=8282, t4="어서 모이자";
    var result;
    result = t1 + t2 + t3 + t4;
    document.write(`${result} <br/>`);
    document.write(`${typeof result} <br/>`);
    var num3 = 10, num4 = 3;
    num3 += num4;
    document.write(`${num3} <br/>`);
    num3 -= num4;
    document.write(`${num3} <br/>`);
    num3 *= num4;
    document.write(`${num3} <br/>`);
    num3 /= num4;
    document.write(`${num3} <br/>`);
    num3 %= num4;
    document.write(`${num3} <br/>`);
    var num1 = 10;
    var num2 = 20;
    num1--;
    document.write(`${num1} <br/>`);
    num2++;
    document.write(`${num2} <br/>`);
{
    var a = 13, b=12;
    var result;
    result = b++;
    var num = a == result ? b == result ? "hello" : "hi" : "HELLO";
    document.write(`${num} <br/>`);
}
*/
// {
//     var walkAmount = prompt("당신의 하루 걸음수는?");
//     if(walkAmount >= 10000){
//         document.write("매우 좋은 습관을 지니고 계시는 군요.");
//     } else{
//         document.write("<b>운동을 더 하셔야 합니다.<b/>");

//     }
// }

// {
//     var ismultiple3 = prompt("숫자를 입력해주세요");

//     if(ismultiple3.length < 4 && ismultiple3  % 3 === 0){
//         document.write(`${ismultiple3}은(는) 3의 배수입니다.`);
//     } else{
//         document.write(`<b>${ismultiple3}은(는) 3의 배수가 아닙니다.<b/>`);

//     }
// }
/*
{
    var month = prompt("현재의 월은?", "11");
    if(month >= 9 && month <= 11){
        document.write(`${month}은(는) 독서의 계절입 니다.`);
    } else if(month >= 6 && month <= 8){
        document.write(`${month}은(는) 여행가기 좋은 계절입니다.`);
    } else if(month >= 3 && month <= 5){
        document.write(`${month}은(는) 햇살 가득한  계절입니다.`);
    } else {
        document.write(`${month}은(는) 스키의 계절입니다.`);
    }
}
*/
/*
{
     var num = prompt("숫자를 입력해주세요");
     if(num  % 6 === 0){
         document.write(`${num}은(는) 2의 배수입니다.`);
    } else if(num  % 3 === 0){
         document.write(`<b>${num}은(는) 3의 배수입니다.<b/>`);
    } else if(num  % 2 === 0){
        document.write(`<b>${num}은(는) 6의배수입니다.<b/>`);
    } else {
        document.write(`<b>${num}은(는) 2, 3, 6의  배수가 아닙니다.<b/>`);
   }
 }
 */
// {
//     var hour = prompt("시간를 입력해주세요");
//     var min = prompt("분을 입력해주세요");
//     // 45분을 뺀 시간 화면에 출력
//     // 화면에 띄워지는 값 : XX시 XX분
//     ///시간은 0시 ~24시 입니다.
//     if(min === null || hour === null){
//         if(min - 45 < 0){
//             if(hour -1 < 0){
//                 document.write(`<b>${23}시 ${60 + (min-45)}분<b/>`);
    
//             } else {
//                 document.write(`<b>${hour-1}시 ${60 + (min-45)}분<b/>`);
    
//             }
    
//         } else if(min - 45 > 0 ){
//             document.write(`<b>${hour}시 ${(min-45)}분<b/>`);
    
//         } 
    
//     } else {
//         document.write(`<b>입력값 오류<b/>`);

//     }

   
// }
/*
{
    var site = prompt("네이버, 다음, 네이트, 구글 중 즐겨 사용하는 포털 검색 사이트는?", "");
    var url;
    switch(site){
        case "네이버" : url="www.naver.com";
            break;
        case "다음" : url="www.daum.net";
            break;
        case "네이트" : url="www.nate.com";
            break;
        case "구글" : url="www.google.com";
            break;
        default : alert("보기 중에 없는 사이트입니다.");
    } 
    if(url){
        location.href=`http://${url}`;
    }
}
*/
// {
//     var month = prompt("월을 입력해주세요", "");
//     var result;
//     switch(month){
//         case "1" :
//         case "3" :
//         case "5" :
//         case "7" :
//         case "8" :
//         case "10" :
//         case "12" :
//             document.write(`${month}월은 <b>31<b/> 일까지 존재합니다.`);
//             break;
//         case "2" : 
//             document.write(`${month}월은 <b>28<b/> 일까지 존재합니다.`);
//             break;
       
//         case "4" :
//         case "6" :
//         case "9" :
//         case "11" :
//             document.write(`${month}월은 <b>30<b/> 일까지 존재합니다.`);
//             break;
        
//         default : alert("존재하지 않는 월입니다.");
//     } 

// }
/*
{
    let i = 1;
    while(i <= 10){
        document.write(`i : ${i++}<br/>`);
    }
}
{
    let i = 10;
    do{
        document.write(`hello ${i--}<br/>`);
    }while(i > 3);
}
*/
/*
{
    for(a = 1; a <= 10; a++){
        document.write(`a : ${a}<br/>`);
    }
}
*/
/*
{
    let num = prompt("몇 단을 출력하시겠습니끼?", "2");
    document.write(`${num}단<br/>`);
    {
        document.write(`for문<br/>`);
        for (a = 1; a < 10; a++){
            document.write(`${num} * ${a} = ${num * a}<br/>`);
        }
    }
    
   
    {
        document.write(`while문<br/>`);
        let a = 1
        while(a < 10){
            document.write(`${num} * ${a} = ${num * a++}<br/>`);
    }
   }
    
   {
    document.write(`do-while문<br/>`);
    let a = 1;
    do{
        document.write(`${num} * ${a} =${num * a++}<br/>`);
    }while(a < 10)
   }
    
}
*/
/*
{
    document.write(`6에 도달 시 for문 종료<br/>`);
    for(var i = 1; i <= 10; i++){
        if(i==6){
            break;
        }
        document.write(`${i}<br/>`);
    }
    document.write(`2의 배수만 출력하는 for문<br/>`);
    for(var i = 1; i <= 10; i++){
        if(i % 2 == 0){
            continue;
        }
        document.write(`${i} <br/>`);
    }
}
*/
// {
//     let num = prompt("0-99 사이의 수를 입력하세요.", "13");

   
//     let result = null, cycle= 0;
//     /*
//     while(true){
//         if(result == num){
//             break;
//         }
//         ++cycle;
//         if(num < 10){
//             num = "0" + num; 
//         } else if(result < 10){
//             result = "0" + result;
//         }
        
    
//         // result = num[1] + (parseInt(num[0]) + parseInt(num[1]));
//         // document.write(`${num} > ${num[0]} + ${num[0]}  > ${result}`);

//         // cycle++;
        
//         // result = toString(parseInt(num / 1000)+ parseInt(num % 1000)/100) + parseInt(num % 1000)/100;
//         console.log(result);
        
       
//     }13
//     */
//     while(true){
//         if(result == num){
//             break;
//         }
//         ++cycle;
//         if(result != null){
//             let sum = parseInt(result/10) + parseInt(result%10);
//             result = ((result%10)*10) + (sum%10);
//             /*
//             console.log(result);
//             console.log(`${(result%10)*10}+ ${result/10}+ ${result%10}`);
//             */

//         } else{
//             result = ((num%10)*10) + (parseInt(num/10) + parseInt(num%10));
//             console.log(num);
//             console.log(`${(num%10)*10}+ ${num/10}+ ${num%10}`);


//         }


//    }


//     document.write(`${result}<br/>`);

    
//     document.write(`cycle : ${cycle}`);



// }


});