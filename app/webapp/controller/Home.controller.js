sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], function (
    Controller, JSONModel, formatter
) {
    "use strict";
    

    return Controller.extend("project1.controller.Home", {
        formatter:formatter,
   
        onInit: function () {
            const MyRoute = this.getOwnerComponent().getRouter().getRoute("Home");
            MyRoute.attachPatternMatched(this.onMatched, this);
        },
        onMatched: async function () {
            const data = await $.ajax({
                type: "get",
                url: '/bpservice/BP'
            });
            var BPModel = new JSONModel(data.value);
            this.getView().setModel(BPModel, "BPModel");
            const data2 = await $.ajax({
                type: "get",
                url: '/bpservice/PayTerm '
            });
            var PayModel = new JSONModel(data2.value);
            for(var i=0;i<BPModel.oData.length;i++){
                for(var j=0;j<PayModel.oData.length;j++){
                    if(BPModel.oData[i].BP_payterm==PayModel.oData[j].PayTerm_number){
                        BPModel.oData[i].PayTerm_duedate = PayModel.oData[j].PayTerm_duedate;
                    }
                }
                
            }
            const data3 = await $.ajax({
                type: "get",
                url: '/docservice/Doc'
            });
            var DocModel = new JSONModel(data3.value);


            for(var i=0;i<DocModel.oData.length;i++){
                for(var j=0;j<BPModel.oData.length;j++){
                    if(DocModel.oData[i].Doc_D_acct.split("-")[0]=='BP'){
                        if(DocModel.oData[i].Doc_D_acct==BPModel.oData[j].BP_number){
                            var new_date = new Date(DocModel.oData[i].Doc_postdate);
                            new_date.setDate(new_date.getDate() + parseInt(BPModel.oData[j].PayTerm_duedate));
                            DocModel.oData[i].newDate = new_date;
                            DocModel.oData[i].newDate2 = new_date - new Date();
                            DocModel.oData[i].newDate2 = DocModel.oData[i].newDate2/(1000 * 60 * 60 * 24);
                        }
                    }
                    else if(DocModel.oData[i].Doc_C_acct.split("-")[0]=='BP'){
                        if(DocModel.oData[i].Doc_C_acct==BPModel.oData[j].BP_number){
                            var new_date = new Date(DocModel.oData[i].Doc_postdate);
                            new_date.setDate(new_date.getDate() + parseInt(BPModel.oData[j].PayTerm_duedate));
                            DocModel.oData[i].newDate = new_date;
                            DocModel.oData[i].newDate2 = new_date - new Date();
                            DocModel.oData[i].newDate2 = DocModel.oData[i].newDate2/(1000 * 60 * 60 * 24);
                        }
                    }

                    
                    
                }
                
            }
            var a=0,b=0,c=0,d=0;
            var aAmount=0,bAmount=0,cAmount=0,dAmount=0
            DocModel.oData.forEach(element => {
                if(element.Doc_type == 'KR'){
                if(element.newDate2<0 && element.newDate2>-1){
                    a++;
                    aAmount+=element.Doc_D_amount;
                }
                else if(element.newDate2<-1 && element.newDate2>-2){
                    b++;
                    bAmount+=element.Doc_D_amount;
                }else if(element.newDate2<-2 && element.newDate2>-3){
                    c++;
                    cAmount+=element.Doc_D_amount;
                }else if(element.newDate2<-3 && element.newDate2>-4){
                    d++;
                    dAmount+=element.Doc_D_amount;
                }
                }
            });
            var overview=[{
                "today" : a,
                "one" : b,
                "two" : c,
                "three" : d,
                "aAmount":aAmount,
                "bAmount":bAmount,
                "cAmount":cAmount,
                "dAmount":dAmount
            }]
            console.log(overview);
            this.getView().setModel(new JSONModel(overview),"overview");

            const PaymentList=await $.ajax({
                type:"get",
                url:"/docservice/Doc?$filter=Doc_type%20eq%20%27KR%27"
            });
            var PLModel=new JSONModel(PaymentList.value);
            this.getView().setModel(PLModel,"PLModel");
            this.onChartView();
            this.onNewBPList();
        },
        onChartView : function(){
            console.log("?");
            var Data = {
                Charts : [
                {
                    "Quarter":"1분기",
                    "lastAmount":47366,
                    "thisAmount":39902
                },
                {
                    "Quarter":"2분기",
                    "lastAmount":38333,
                    "thisAmount":54486
                },
                {
                    "Quarter":"3분기",
                    "lastAmount":35045,
                    "thisAmount":21204
                },
                {
                    "Quarter":"4분기",
                    "lastAmount":13626,
                    "thisAmount":44694
                }
                ]
            };
            var jsonData=new JSONModel(Data);
            this.getView().setModel(jsonData,"DataModel");
            var oVizFrame=this.getView().byId("idVizFrame");
            var vizProperties={
                title:{text:'분기별 매출 비교'},
                plotArea:{dataLabel:{visible:true,position:'outside'}}};
            oVizFrame.setVizProperties(vizProperties);
            var feedValueAxis=this.getView().byId("valueAxisFeed");
            oVizFrame.removeFeed(feedValueAxis);
            feedValueAxis.setValues(["lastAmount","thisAmount"]);
            oVizFrame.addFeed(feedValueAxis);
        },

        onNewBPList : async function(){
            const NewBPList=await $.ajax({
                type:"get",
                url:"/bpservice/BP?$orderby=BP_number%20desc&$top=3"
            });
            var NewBPModel=new JSONModel(NewBPList.value);
            console.log(NewBPModel);
            this.getView().setModel(NewBPModel,"NewBPModel");
        },
        onBP_list: function () {
            let oComponent = this.getOwnerComponent(),
                oRootControl = oComponent.getRootControl(),
                oControlMenu = oRootControl.byId('menu');

            oControlMenu.setText('BP');
            this.getOwnerComponent().getRouter().navTo("BP");
        },
        onGL_list: function () {
            let oComponent = this.getOwnerComponent(),
                oRootControl = oComponent.getRootControl(),
                oControlMenu = oRootControl.byId('menu');

            oControlMenu.setText('GL');
            this.getOwnerComponent().getRouter().navTo("GL");
        },
		onDoc_list: function () {
            let oComponent = this.getOwnerComponent(),
                oRootControl = oComponent.getRootControl(),
                oControlMenu = oRootControl.byId('menu');

            oControlMenu.setText('Doc');
            this.getOwnerComponent().getRouter().navTo("Doc");
        },
        onNews: function () {
            window.open('https://news.sap.com/'); 
        },
        pressOnTileOne:function(){
            window.open('https://n.news.naver.com/mnews/article/015/0004789888?sid=101'); 
        }
	});
});