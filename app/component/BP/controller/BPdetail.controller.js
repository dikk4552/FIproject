sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
	      "sap/m/MessageBox"
    ],
    function(Controller,JSONModel,MessageBox) {
      "use strict";
      var BPnum,sUrl,BPModel,oModel,BPregionModel;
      return Controller.extend("projectBP.controller.BPdetail", {
        onInit: function(){
          const MyRoute = this.getOwnerComponent().getRouter().getRoute("BPdetail");
          MyRoute.attachPatternMatched(this.onMatched,this);
        },

        onMatched : function(oEvent){
          
          BPnum = oEvent.getParameter("arguments").bpnumber;
          sUrl="/bpservice/BP/"+BPnum;
          
          this.onDataView();
        },

        onDataView : async function(){
          var ed={
            EditMode:false,
            CEditMode:false,
            PEditMode:false
          };
          oModel = new JSONModel(ed);
          this.getView().setModel(oModel,"oModel");
          const BP = await $.ajax({
            type:"get",
            url:sUrl
          });
          BPModel=new JSONModel(BP);
          this.getView().setModel(BPModel,"BPModel");

          const BPregion=await $.ajax({
            type:"get",
            url:"/bpservice/Region"
          });
          BPregionModel=new JSONModel(BPregion.value);
          this.getView().setModel(BPregionModel,"BPregionModel");
          var key = this.getView().getModel("BPModel").oData.BP_country;
          this.byId("SelectBPcountry").setSelectedKey(key);
          var countryText = this.byId("SelectBPcountry").getSelectedItem().getText();
          this.byId("oldBPcountry").setText(countryText);
        },

        onNavToBack : function(){
          this.getOwnerComponent().getRouter().navTo("BPhome");
        },

        onEdit : function(){
           
           var oldBPphone = this.byId("oldBPphone").getText();
           this.byId("InputBPphone").setValue(oldBPphone);
           var oldBPwebsite = this.byId("oldBPwebsite").getText();
           this.byId("InputBPwebsite").setValue(oldBPwebsite);
           var oldBPstreet = this.byId("oldBPstreet").getText();
           this.byId("InputBPstreet").setValue(oldBPstreet);
           var oldBPzipcode = this.byId("oldBPzipcode").getText();
           this.byId("InputBPzipcode").setValue(oldBPzipcode);
           var oldBPcountry = this.byId("oldBPcountry").getText();
           this.byId("SelectBPcountry").setSelectedKey(oldBPcountry.split(" (")[1].split(")")[0]);
           var oldBPhouse = this.byId("oldBPhouse").getText();
           this.byId("InputBPhouse").setValue(oldBPhouse);
           var oldBPcity = this.byId("oldBPcity").getText();
           this.byId("InputBPcity").setValue(oldBPcity);


           var bpcate=this.getView().getModel("BPModel").oData.BP_category;
           if(bpcate === '조직'){
            var oldBPmanager = this.byId("oldBPmanager").getText();
           this.byId("InputBPmanager").setValue(oldBPmanager);
            this.getView().getModel("oModel").setProperty("/EditMode",true);
            this.getView().getModel("oModel").setProperty("/CEditMode",true);
           }else{
            var oldBPname = this.byId("oldBPname").getText();
            this.byId("InputBPname").setValue(oldBPname);
            var oldBPtitle = this.byId("oldBPtitle").getText();
            // this.byId("InputBPtitle").setValue(oldBPtitle);
            this.byId("SelectBPTitle").setSelectedKey(oldBPtitle);
            this.getView().getModel("oModel").setProperty("/EditMode",true);
            this.getView().getModel("oModel").setProperty("/PEditMode",true);
           }
        },

        onConfirm : async function(){
          var bpcate=this.getView().getModel("BPModel").oData.BP_category;
           if(bpcate === '조직'){
            var temp={
              BP_manager:this.byId("InputBPmanager").getValue(),
              BP_phone:this.byId("InputBPphone").getValue(),
              BP_website:this.byId("InputBPwebsite").getValue(),
              BP_street:this.byId("InputBPstreet").getValue(),
              BP_zipcode:this.byId("InputBPzipcode").getValue(),
              BP_country:this.byId("SelectBPcountry").getSelectedKey(),
              BP_house:this.byId("InputBPhouse").getValue(),
              BP_city:this.byId("InputBPcity").getValue(),
            };
            var bValidationError=false;
            for(var key in temp){
              if(temp[key]===''){
                bValidationError=true;
              }
            }
            if(!bValidationError){
              await $.ajax({
                type:"patch",
                url:sUrl,
                contentType: "application/json;IEEE754Compatible=true",
                data:JSON.stringify(temp)
              });
            }else{
              MessageBox.alert("입력이 완료되지 않았습니다.");
            }
           }
           else{
            var temp={
              BP_manager:this.byId("InputBPname").getValue(),
              BP_name:this.byId("InputBPname").getValue(),
              BP_title:this.byId("SelectBPTitle").getSelectedKey(),
              BP_phone:this.byId("InputBPphone").getValue(),
              BP_website:this.byId("InputBPwebsite").getValue(),
              BP_street:this.byId("InputBPstreet").getValue(),
              BP_zipcode:this.byId("InputBPzipcode").getValue(),
              BP_country:this.byId("SelectBPcountry").getSelectedKey(),
              BP_house:this.byId("InputBPhouse").getValue(),
              BP_city:this.byId("InputBPcity").getValue(),
            };
            var bValidationError=false;
            for(var key in temp){
              if(temp[key]===''){
                bValidationError=true;
              }
            }
            if(!bValidationError){
              await $.ajax({
                type:"patch",
                url:sUrl,
                contentType: "application/json;IEEE754Compatible=true",
                data:JSON.stringify(temp)
              });
            }else{
              MessageBox.alert("입력이 완료되지 않았습니다.");
            }
           }
          this.onDataView();
        },

        onCancel : function(){

          this.getView().getModel("oModel").setProperty("/EditMode",false);
          this.getView().getModel("oModel").setProperty("/CEditMode",false);
          this.getView().getModel("oModel").setProperty("/PEditMode",false);
          
        }
          
      });
    }
);
