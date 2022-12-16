sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/json/JSONModel"
  ],
  function(BaseController, Filter, FilterOperator, JSONModel) {
    "use strict";
    let totalNumber;

    return BaseController.extend("projectBP.controller.BPhome", {
      onInit: async function() {
          const myRoute = this.getOwnerComponent().getRouter().getRoute("BPhome");
          myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

      },

      onMyRoutePatternMatched: async function() {

          this.onClearField();
          this.onDataView();
 
      },

      onDataView: async function () {      
          const Cocd=await $.ajax({
            type:"get",
            url:"/glservice/CoCd"
          });
          var CocdModel=new JSONModel(Cocd.value);
          this.getView().setModel(CocdModel,"CocdModel");

          const BPmain = await $.ajax({      
              type: "get",
              url: "/bpservice/BP"
          });
         
          let BPModel = new JSONModel(BPmain.value);
          this.getView().setModel(BPModel, "BPModel");
  
          totalNumber = this.getView().getModel("BPModel").oData.length;
  
          let TableIndex = "고객 (" +totalNumber+ ")";
          this.getView().byId("TableName").setText(TableIndex); 
  
      },

      onSearch : function() {
          let BP_zipcode = this.byId("BP_zipcode").getValue(); 
          let BP_number = this.byId("BP_number").getValue();
          let BP_street = this.byId("BP_street").getValue();
          let BP_city = this.byId("BP_city").getValue();
          let BP_country = this.byId("BP_country").getValue();
          let BP_category = this.byId("BP_category").getSelectedKey();
          let BP_cocd = this.byId("BP_cocd").getValue();

      
            var aFilter = []; 

            if (BP_zipcode) {aFilter.push(new Filter("BP_zipcode", FilterOperator.Contains, BP_zipcode))}  
            if (BP_number) {aFilter.push(new Filter("BP_number", FilterOperator.Contains, BP_number))}
            if (BP_street) {aFilter.push(new Filter("BP_street", FilterOperator.Contains, BP_street))}
            if (BP_city) {aFilter.push(new Filter("BP_city", FilterOperator.Contains, BP_city))}
            if (BP_country) {aFilter.push(new Filter("BP_country", FilterOperator.Contains, BP_country))}
            if (BP_category) {aFilter.push(new Filter("BP_category", FilterOperator.Contains, BP_category))}
            if (BP_cocd) {aFilter.push(new Filter("BP_cocd", FilterOperator.Contains, BP_cocd))}

              let oTable = this.byId("BPmain").getBinding("rows");  
              oTable.filter(aFilter); 
           
      },

      onClearField : function () {
          this.getView().byId("BP_zipcode").setValue(""); 
          this.getView().byId("BP_number").setValue(""); 
          this.getView().byId("BP_street").setValue(""); 
          this.getView().byId("BP_city").setValue("");
          this.getView().byId("BP_country").setValue("");
          this.getView().byId("BP_category").setSelectedKey("");
          this.getView().byId("BP_cocd").setValue("");
      },

      onReset : function () {
          this.onClearField();

          this.onSearch();

      },

      onBPCreate: function (sText, CreateCategory) {
          let CreateOrder = this.getView().getModel("BPModel").oData;
          let CreateOrderIndex = CreateOrder.length;
          let CreateNum = CreateOrder[CreateOrderIndex - 1].BP_number;
          
          if (CreateNum, CreateCategory) {
      
              let BP_number1 = CreateNum.split("-")[0]; 
              let BP_number2  = parseInt(CreateNum.split("-")[1]) + 1;
              CreateNum = BP_number1  + "-" + String(BP_number2).padStart(3, '0');
            }
          this.getOwnerComponent().getRouter().navTo("BPcreate", { num: CreateNum , category: CreateCategory});

      },

      onNavToDetail : function(oEvent){
       var BP_number=oEvent.getParameters().row.mAggregations.cells[0].mProperties.text;
       this.getOwnerComponent().getRouter().navTo("BPdetail",{bpnumber:BP_number});
      }

  });
  });