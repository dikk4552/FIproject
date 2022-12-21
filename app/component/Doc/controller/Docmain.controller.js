sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/core/Fragment",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/ui/export/Spreadsheet",
        "sap/ui/export/library"
    ],
    function(BaseController, Filter, Fragment, FilterOperator, JSONModel, Spreadsheet, exportLibrary ) {
      "use strict";
      const EdmType = exportLibrary.EdmType;
  
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
        
        onDataExport: function () {
            let aCols, oRowBinding, tableIndices, oSettings, oSheet, oTable;

            oTable = this.byId('Docmain');    // 테이블 
            oRowBinding = oTable.getBinding('rows');    // 테이블 전체 데이터
            tableIndices = oRowBinding.aIndices;        // 조건에 의해 필터링된 데이터의 테이블 Index
            console.log(oRowBinding);

            let oList = []; // 데이터 담을 배열 생성

            var selectedIndex = this.byId("Docmain").getSelectedIndices();    // 멀티토글에서 체크한 열의 테이블 데이터
            console.log(selectedIndex);
            if (selectedIndex.length == 0) {    // 선택한 열이 없을 때
                for (let j = 0; j < oRowBinding.oList.length; j++) {    // 전체 데이터 만큼 for문 돌림
                    if (oRowBinding.aIndices.indexOf(j) > -1) {         // 데이터가 있을 때
                        oList.push(oRowBinding.oList[j]);               // 전체 데이터를 oList에 Push
                    }
                }
            }
            else {                              // 선택한 열이 있을 때
                for (let j = 0; j < selectedIndex.length; j++) {        // 선택한 열의 수만큼 for문 돌림
                    oList.push(oRowBinding.oList[tableIndices[selectedIndex[j]]]);      // [전체 데이터의 [필터링된 데이터의 [선택한 데이터[j]]]]
                    // console.log(oRowBinding.oList[tableIndices[selectedIndex[j]]]);
                }
            }

            aCols = this.createColumnConfig();

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'DocumentList.xlsx',
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
        createColumnConfig: function() {
            const aCols = [];

            aCols.push({
                label: '전표 번호',
                property: 'Doc_number',
                type: EdmType.Int32
              });
              aCols.push({
                label: '증빙일',
                property: 'Doc_docdate',
                type: EdmType.Int32
              });
              aCols.push({
                label: '전기일',
                property: 'Doc_postdate',
                type: EdmType.Int32
              });
              aCols.push({
                label: '회사코드',
                property: 'Doc_cocd',
                type: EdmType.Int32
              });
              aCols.push({
                label: '전표유형',
                property: 'Doc_type',
                type: EdmType.Int32
              });
              aCols.push({
                label: '통화',
                property: 'Doc_curr',
                type: EdmType.Int32
              });
      
              aCols.push({
                label: '헤더텍스트',
                property: 'Doc_text',
                type: EdmType.Int32
              });
      
              aCols.push({
                label: '참조',
                property: 'Doc_ref',
                type: EdmType.Int32
              });
      
              return aCols;

        },

        onNavToDetail: function (oEvent) {
            let SelectedNum = oEvent.getParameters().row.mAggregations.cells[0].mProperties.text;
    
            this.getOwnerComponent().getRouter().navTo("Docdetail", { num: SelectedNum });
                

          }

    });
    });
  