sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/core/Fragment",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController, Filter, Fragment, FilterOperator, JSONModel) {
      "use strict";
      let totalNumber;
  
      return BaseController.extend("projectDoc.controller.Docmain", {
        onInit: async function() {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("Docmain");
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


            const Docmain = await $.ajax({      
                type: "get",
                url: "/docservice/Doc"
            });
           
            let DocModel = new JSONModel(Docmain.value);
            this.getView().setModel(DocModel, "DocModel");
    
            this.onTableLength();
    
        },

        onTableLength: function() {
            let TableIndex = "전표 목록 (" + this.byId("Docmain").getBinding().aIndices.length + ")";
            this.getView().byId("TableName").setText(TableIndex); 
        },

        onSearch : function() {
            let Doc_number = this.byId("Doc_number").getValue(); 
            let Doc_docdate = this.byId("Doc_docdate").getValue();
            let Doc_postdate = this.byId("Doc_postdate").getValue();
            let Doc_cocd = this.byId("Doc_cocd").getSelectedKey();
            let Doc_type = this.byId("Doc_type").getValue();
  
        
              var aFilter = []; 
  
              if (Doc_number) {aFilter.push(new Filter("Doc_number", FilterOperator.Contains, Doc_number))}  
              if (Doc_docdate) {aFilter.push(new Filter("Doc_docdate", FilterOperator.Contains, Doc_docdate))}
              if (Doc_postdate) {aFilter.push(new Filter("Doc_postdate", FilterOperator.Contains, Doc_postdate))}
              if (Doc_cocd) {aFilter.push(new Filter("Doc_cocd", FilterOperator.Contains, Doc_cocd))}
              if (Doc_type) {aFilter.push(new Filter("Doc_type", FilterOperator.Contains, Doc_type))}

                let oTable = this.byId("Docmain").getBinding("rows");  
                oTable.filter(aFilter); 
             
            this.onTableLength(); 

        },

        onClearField : function () {
            this.getView().byId("Doc_number").setValue(""); 
            this.getView().byId("Doc_docdate").setValue(""); 
            this.getView().byId("Doc_postdate").setValue(""); 
            this.getView().byId("Doc_cocd").setSelectedKey("");
            this.getView().byId("Doc_type").setValue("");
        },

        onReset : function () {
            this.onClearField();
  
            this.onSearch();
  
        },

        onDoccreate: function (sText) {
            let CreateOrder = this.getView().getModel("DocModel").oData;
            let CreateOrderIndex = CreateOrder.length;
            let CreateNum = parseInt(CreateOrder[CreateOrderIndex - 1].Doc_number) +1;
            
            this.getOwnerComponent().getRouter().navTo("Doccreate", { num: CreateNum });

        },


        onNavToDetail: function () {
  
          this.getOwnerComponent().getRouter().navTo("Docdetail");
  
        }

    });
    });
  