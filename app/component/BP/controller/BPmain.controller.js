sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/json/JSONModel",
      'sap/m/SearchField',
      'sap/ui/table/Column',
      "sap/ui/export/Spreadsheet",
        "sap/ui/export/library"
  ],
  function(BaseController, Filter, FilterOperator, JSONModel, SearchField, UIColumn, Spreadsheet, exportLibrary) {

    "use strict";
    let totalNumber;
    const EdmType = exportLibrary.EdmType;

    return BaseController.extend("projectBP.controller.BPmain", {
      onInit: async function() {
        const myRoute = this.getOwnerComponent().getRouter().getRoute("BPmain");
        myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);

        const Region = await $.ajax({
            type: "get",
            url: "/bpservice/Region"
        });
        let RegionModel = new JSONModel(Region.value);
        this.getView().setModel(RegionModel,"RegionModel");

        var oMultiInput = this.byId("BP_country"); 
        this._oMultiInput = oMultiInput;

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
          //
          this.onTableLength();
  
      },
      onTableLength: function() {
        let TableIndex = "고객 (" + this.byId("BPmain").getBinding().aIndices.length + ")";
        this.getView().byId("TableName").setText(TableIndex); 
    },

    onSearch : function() {
        let BP_number = this.byId("BP_number").getValue();
        let BP_name = this.byId("BP_name").getValue();
        let BP_cocd = this.byId("BP_cocd").getSelectedKey();
        let BP_category = this.byId("BP_category").getSelectedKey();
        let BP_city = this.byId("BP_city").getValue();
        let BP_country = this.byId("BP_country").getTokens();

    
          var aFilter = [];
          
          var aFilter = []; var value;
          if (BP_country) { for(var i = 0 ; i < BP_country.length ; i++ ) {
              value = BP_country[i].mProperties.key;
              aFilter.push(new Filter("BP_country", FilterOperator.Contains, value))}
          }
          if (BP_number) {aFilter.push(new Filter("BP_number", FilterOperator.Contains, BP_number))}
          if (BP_name) {aFilter.push(new Filter("BP_name", FilterOperator.Contains, BP_name))}
          if (BP_cocd) {aFilter.push(new Filter("BP_cocd", FilterOperator.Contains, BP_cocd))}
          if (BP_city) {aFilter.push(new Filter("BP_city", FilterOperator.Contains, BP_city))}
          if (BP_category) {aFilter.push(new Filter("BP_category", FilterOperator.Contains, BP_category))}

            let oTable = this.byId("BPmain").getBinding("rows");  
            oTable.filter(aFilter); 

        this.onTableLength();
        
    },

    onClearField : function () {
        this.getView().byId("BP_number").setValue(""); 
        this.getView().byId("BP_name").setValue(""); 
        this.getView().byId("BP_cocd").setSelectedKey("");
        this.getView().byId("BP_category").setSelectedKey("");
        this.getView().byId("BP_city").setValue("");
        this.getView().byId("BP_country").removeAllTokens();
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
      },

      onBPCreateWizard : function() {
        let CreateOrder = this.getView().getModel("BPModel").oData;
        let CreateOrderIndex = CreateOrder.length;
        let CreateNum = CreateOrder[CreateOrderIndex - 1].BP_number;
        let BP_number1 = CreateNum.split("-")[0]; 
        let BP_number2  = parseInt(CreateNum.split("-")[1]) + 1;
        CreateNum = BP_number1  + "-" + String(BP_number2).padStart(3, '0');

        this.getOwnerComponent().getRouter().navTo("BPcreateWizard", { num : CreateNum });
      },

      // Country Value Help Fragment Controller

      onValueHelpCountry: function() {

        this._oBasicSearchField = new SearchField();
        if (!this.pDialog) {
            this.pDialog = this.loadFragment({
                name: "projectBP.view.fragment.CountryValueHelp"
            });
        }
        this.pDialog.then(function(oDialog) {

            var oFilterBar = oDialog.getFilterBar();
            this._oVHD = oDialog;
            // Initialise the dialog with model only the first time. Then only open it

            this.getView().addDependent(oDialog);

            // Set Basic Search for FilterBar
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            // Trigger filter bar search when the basic search is fired
            this._oBasicSearchField.attachSearch(function() {
                oFilterBar.search();
            });
            
            var aFilters = [];
            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));

            if (this._bDialogInitialized) {
                // Re-set the tokens from the input and update the table
                oDialog.setTokens([]);
                oDialog.setTokens(this._oMultiInput.getTokens());
                oDialog.update();
                oDialog.open();
                return;
            }

            oDialog.getTableAsync().then(function (oTable) {

                oTable.setModel(this.oProductsModel);

                // For Desktop and tabled the default table is sap.ui.table.Table
                if (oTable.bindRows) {
                    // Bind rows to the ODataModel and add columns
                    oTable.bindAggregation("rows", {
                        path: "RegionModel>/",
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new UIColumn({label: "국가 코드", template: "RegionModel>Reg_number"}));
                    oTable.addColumn(new UIColumn({label: "국가/지역 이름", template: "RegionModel>Reg_name"}));
                }
                oDialog.update();
            }.bind(this));

            oDialog.setTokens(this._oMultiInput.getTokens());
            
            // set flag that the dialog is initialized
            this._bDialogInitialized = true;
            oDialog.open();
        }.bind(this));
    },
    onFilterBarSearch: function (oEvent) {
        var sSearchQuery = this._oBasicSearchField.getValue(),
            aSelectionSet = oEvent.getParameter("selectionSet");

        var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
            if (oControl.getValue()) {
                aResult.push(new Filter({
                    path: oControl.getName(),
                    operator: FilterOperator.Contains,
                    value1: oControl.getValue()
                }));
            }

            return aResult;
        }, []);

        aFilters.push(new Filter({
            filters: [
                new Filter({ path: "Reg_number", operator: FilterOperator.Contains, value1: sSearchQuery }),
                new Filter({ path: "Reg_name", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
        }));

        this._filterTable(new Filter({
            filters: aFilters,
            and: true
        }));
    },
    _filterTable: function (oFilter) {
        var oVHD = this._oVHD;

        oVHD.getTableAsync().then(function (oTable) {
            if (oTable.bindRows) {
                oTable.getBinding("rows").filter(oFilter);
            }
            // This method must be called after binding update of the table.
            oVHD.update();
        });
    },

    onValueHelpOkPress: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        for(var i =0;i<aTokens.length;i++){
            aTokens[i].mProperties.text = aTokens[i].mProperties.key;
        }
        this._oMultiInput.setTokens(aTokens);
        this._oVHD.close();
    },

    onValueHelpCancelPress: function () {
        this._oVHD.close();
    },
    onDataExport: function () {
        let aCols, oRowBinding, tableIndices, oSettings, oSheet, oTable;

        oTable = this.byId('BPmain');    // 테이블 
        oRowBinding = oTable.getBinding('rows');    // 테이블 전체 데이터
        tableIndices = oRowBinding.aIndices;        // 조건에 의해 필터링된 데이터의 테이블 Index
        console.log(oRowBinding);

        let oList = []; // 데이터 담을 배열 생성

        var selectedIndex = this.byId("BPmain").getSelectedIndices();    // 멀티토글에서 체크한 열의 테이블 데이터
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
            fileName: 'BPList.xlsx',
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
            label: 'BP 코드',
            property: 'BP_number',
            type: EdmType.Int32
          });
          aCols.push({
            label: 'BP 명칭',
            property: 'BP_name',
            type: EdmType.Int32
          });
          aCols.push({
            label: '회사코드',
            property: 'BP_cocd',
            type: EdmType.Int32
          });
          aCols.push({
            label: '국가/지역',
            property: 'BP_country',
            type: EdmType.Int32
          });
          aCols.push({
            label: '우편번호',
            property: 'BP_zipcode',
            type: EdmType.Int32
          });
          aCols.push({
            label: '도시',
            property: 'BP_city',
            type: EdmType.Int32
          });
  
          aCols.push({
            label: 'BP 범주',
            property: 'BP_category',
            type: EdmType.Int32
          });
  
          
  
          return aCols;

    }

  });
  });