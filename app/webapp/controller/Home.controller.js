sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"

], function(
    Controller,JSONModel
) {
    "use strict";

    return Controller.extend("project1.controller.Home", {
        onInit:function(){
            this.getOwnerComponent().getRouter().getRoute("Home").attachPatternMatched(this.onMatched,this);
        },

        onMatched : async function(){
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
            this.getView().setModel(NewBPModel,"NewBPModel");
        },

        onBP_list: function () {
            this.getOwnerComponent().getRouter().navTo("BP");
        },
        onGL_list: function () {
            this.getOwnerComponent().getRouter().navTo("GL");
        },
        onDoc_list: function () {
            this.getOwnerComponent().getRouter().navTo("Doc");
        }
    });
});