sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
	      "sap/m/MessageBox",
        "sap/ui/core/Fragment",
        "../model/formatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function(Controller,JSONModel,MessageBox,Fragment,formatter,Filter,FilterOperator) {
      "use strict";
      var BPnum,sUrl,BPModel,oModel,BPregionModel,DRDocModel,due;
      return Controller.extend("projectBP.controller.BPdetail", {
        formatter:formatter,
        onInit: async function(){
          const MyRoute = this.getOwnerComponent().getRouter().getRoute("BPdetail");
          MyRoute.attachPatternMatched(this.onMatched,this);

          const BPregion=await $.ajax({
            type:"get",
            url:"/bpservice/Region"
          });
          BPregionModel=new JSONModel(BPregion.value);
          this.getView().setModel(BPregionModel,"RegionModel");
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

          this.paytermChartView();

        },

        paytermChartView : async function(){

          var pt=this.getView().getModel("BPModel").oData.BP_payterm;
          if(pt==='0001'||pt==='0006'){
            due=0;
          }else if(pt==='0002'||pt==='0007'){
            due=15;
          }else if(pt==='0003'||pt==='0008'){
            due=30;
          }else if(pt==='0004'||pt==='0009'){
            due=45;
          }else if(pt==='0005'||pt==='0010'){
            due=60;
          }

          const DRDoc=await $.ajax({
              type:"get",
              url:"/docservice/Doc?$filter=Doc_D_acct eq '"+BPnum+"'"
          });
          DRDocModel=new JSONModel(DRDoc.value);
          this.getView().setModel(DRDocModel,"DRDocModel");
          var pd,diffDate;
          var today=new Date();
          var dd,due15=0,due30=0,due45=0,due60=0,dueover=0,amount=0;

          var a0Table = [];
          var a16Table = [];
          var a31Table = [];
          var a46Table = [];
          var a61Table = [];

          for(var i=0;i<DRDocModel.oData.length;i++){
            pd=new Date(DRDocModel.oData[i].Doc_postdate);
            pd.setDate(pd.getDate()+due);
            diffDate=pd.getTime()-today.getTime();
            dd=Math.floor(diffDate/(1000*60*60*24));
            var key='/'+i+'/CHK'
            if(dd<0){
              dueover+=Number(DRDocModel.oData[i].Doc_D_amount);
              DRDocModel.setProperty(key, 0);
              a0Table.push(DRDocModel.oData[i]);
            }
            else if(dd<16){
              due15+=Number(DRDocModel.oData[i].Doc_D_amount);
              DRDocModel.setProperty(key, 15);
              a16Table.push(DRDocModel.oData[i]);
            }else if(dd<31){
              due30+=Number(DRDocModel.oData[i].Doc_D_amount);
              DRDocModel.setProperty(key, 30);
              a31Table.push(DRDocModel.oData[i]);
            }
            else if(dd<46){
              due45+=Number(DRDocModel.oData[i].Doc_D_amount);
              DRDocModel.setProperty(key, 45);
              a46Table.push(DRDocModel.oData[i]);
            }else if(dd<61){
              due60+=Number(DRDocModel.oData[i].Doc_D_amount);
              DRDocModel.setProperty(key, 60);
              a61Table.push(DRDocModel.oData[i]);
            }
          }
          console.log(this.getView().getModel("DRDocModel"))
          amount=due15+due30+due45+due60+dueover;

          var Data = {
            Charts :[{
              "Term":"Amount",
              "금액":amount,
              "table": DRDocModel.oData
            },{
              "Term":"60 Days",
              "금액":due60,
              "table": a61Table
          },
          {
            "Term":"45 Days",
            "금액":due45,
            "table": a46Table
          },
          {
            "Term":"30 Days",
            "금액":due30,
            "table": a31Table
          },
          {
          "Term":"15 Days",
          "금액":due15,
          "table": a16Table
          },
          {
            "Term":"Overdue",
          "금액":dueover,
          "table": a0Table
          }
        ]
          } ;
          
          var jsonData=new JSONModel(Data);
          this.getView().setModel(jsonData,"DataModel");

          var oVizFrame=this.getView().byId("idVizFrame");
          var vizProperties={
            title:{text:'Payment Term'},
            plotArea:{dataLabel:{visible:true,position:'outside'}},
            interaction:{selectability:{mode:"single"}}};
          oVizFrame.setVizProperties(vizProperties);

          
        },

        onNavToBack : function(){
          this.getOwnerComponent().getRouter().navTo("BPmain");
          this.byId("ObjectPageLayout").setSelectedSection(this.getView().byId("normaldata").getId());
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
           this.byId("BP_country").setValue(oldBPcountry); // Value Help Dialog를 위해 Input으로 변경
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
              BP_country:this.byId("BP_country").getValue(),
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
              this.onDataView();
            }else{
              MessageBox.alert("입력이 완료되지 않았습니다.");
            }
           }
           else if(bpcate === '개인'){
            var temp={
              BP_manager:this.byId("InputBPname").getValue(),
              BP_name:this.byId("InputBPname").getValue(),
              BP_title:this.byId("SelectBPTitle").getSelectedKey(),
              BP_phone:this.byId("InputBPphone").getValue(),
              BP_website:this.byId("InputBPwebsite").getValue(),
              BP_street:this.byId("InputBPstreet").getValue(),
              BP_zipcode:this.byId("InputBPzipcode").getValue(),
              BP_country:this.byId("BP_country").getValue(),
              BP_house:this.byId("InputBPhouse").getValue(),
              BP_city:this.byId("InputBPcity").getValue(),
            };
            var bValidationError=false;
            for(var key in temp){
              if(temp[key]===''){
                bValidationError=true;
              }
            }
            if (!bValidationError) {
              await $.ajax({
                type: "patch",
                url: sUrl,
                contentType: "application/json;IEEE754Compatible=true",
                data: JSON.stringify(temp)
              });
              this.onDataView();
            } else {
              MessageBox.alert("입력이 완료되지 않았습니다.");
            }
          }
          
        
      },

      onCancel: function () {

          this.getView().getModel("oModel").setProperty("/EditMode",false);
          this.getView().getModel("oModel").setProperty("/CEditMode",false);
          this.getView().getModel("oModel").setProperty("/PEditMode",false);
          
        },

        onCellClick : function(oEvent){
          var mParams=oEvent.getParameters();
          var sPath=mParams.rowBindingContext.sPath;
          var DocDeCellModel=new JSONModel(this.getView().getModel("DRDocModel").getProperty(sPath));
          this.getView().setModel(DocDeCellModel,"DocDeCellModel");

          var table=this.getView().getModel("DocDeCellModel").oData;
          var arr=[];
          var tabledata = {
               Doc_NO : 1,
               Doc_CD : "D",
               Doc_D_acct :table.Doc_D_acct,
               Doc_D_amount : Number(table.Doc_D_amount),
               Doc_D_cost : table.Doc_D_cost,
               Doc_D_prof : table.Doc_D_prof,
               Doc_b :""
            }
          var tabledata2 = {
               Doc_NO : 2,
               Doc_CD : "C",
               Doc_D_acct :table.Doc_C_acct,
               Doc_D_amount : Number(table.Doc_C_amount),
               Doc_D_cost : table.Doc_C_cost,
               Doc_D_prof : table.Doc_C_prof,
               Doc_b :""
            }
            arr.push(tabledata);
            arr.push(tabledata2);
            
          var DoctableModel = new JSONModel(arr);
          this.getView().setModel(DoctableModel, "DoctableModel");


          if(!this.byId("CellClickDialog")){
            Fragment.load({
                id: this.getView().getId(),
                name: "projectBP.view.fragment.CellClick",
                controller : this
            }).then(function(oDialog){
                this.getView().addDependent(oDialog);
                oDialog.open();
            }.bind(this));
          }else{
            this.byId("CellClickDialog").open();
          }
        },

        onCloseDialog : function(){
            this.byId("CellClickDialog").close();
        },

        onSelectChart : function(oEvent){
          let oSelectedData = oEvent.getParameters().data[0].data;
          const oView = this.getView(),
                oDataModel = oView.getModel('DataModel'),
                oChartData = oDataModel.getProperty('/Charts');

          let aAmount = oChartData.filter(
            (oData) => {
              return oData['금액'] === oSelectedData.Amount
            }
          )
          oView.getModel('DRDocModel').setProperty('/', aAmount[0].table);
          if(this.selectcheck==undefined){
            this.selectcheck=1;
          }
          else if(this.selectcheck==1){
            this.selectcheck=2;
          }
        },

        onDeselectChart : function(){
          if(this.selectcheck===2){
            this.selectcheck=1;
          }
          else{
          var oChartData = this.getView().getModel("DataModel").getProperty('/Charts');
          this.getView().getModel('DRDocModel').setProperty('/',oChartData[0].table);
          this.selectcheck=undefined;
          }
        },

        onDelete : function(){
          MessageBox.warning("정말 삭제하시겠습니까?",{
            actions:[MessageBox.Action.OK, MessageBox.Action.CANCEL],
            onClose : function (sAction){
              if(sAction===MessageBox.Action.OK){
                this.ondeclose();
              }
            }.bind(this)
          })
        },

        ondeclose : async function(){
          var url="/bpservice/BP/"+BPnum;
          await $.ajax({
            type:"delete",
            url:url,
            contentType: "application/json;IEEE754Compatible=true"
          });
          this.onNavToBack();
        },

        // Country Single Value Help Funtion 구현

      onValueHelpCountry: function () {
        var oView = this.getView();
        // Fragment를 load해주는 과정
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "projectBP.view.fragment.CountrySingleValueHelp",
            controller: this
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }
        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          oValueHelpDialog.open();
        }.bind(this));
      },
      handleSearch: function (oEvent) {
        var aFilters = [];
        var sValue = oEvent.getParameter("value");
        aFilters.push(new Filter({
          filters: [
            new Filter({ path: "Reg_number", operator: FilterOperator.Contains, value1: sValue }),
            new Filter({ path: "Reg_name", operator: FilterOperator.Contains, value1: sValue })
          ],
          and: false
        }));
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter(aFilters);
      },
      handleClose: function (oEvent) {
        // reset the filter
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([]);

        var aContexts = oEvent.getParameter("selectedContexts");
        var text = aContexts.map(function (oContext) { return oContext.getObject().Reg_number; })
        this.byId("BP_country").setValue(text);
      },

      });
    }
);
