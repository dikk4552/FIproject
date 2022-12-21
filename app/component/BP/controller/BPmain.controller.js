sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/json/JSONModel",
      'sap/m/SearchField',
      'sap/ui/table/Column'
  ],
  function(BaseController, Filter, FilterOperator, JSONModel, SearchField, UIColumn) {
    "use strict";
    let totalNumber;

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
  
      },

      onSearch : function() {
          let BP_zipcode = this.byId("BP_zipcode").getValue(); 
          let BP_number = this.byId("BP_number").getValue();
          let BP_street = this.byId("BP_street").getValue();
          let BP_city = this.byId("BP_city").getValue();
          let BP_country = this.byId("BP_country").getTokens();
          let BP_category = this.byId("BP_category").getSelectedKey();
          let BP_cocd = this.byId("BP_cocd").getValue();
      
            var aFilter = []; var value;
            if (BP_country) { for(var i = 0 ; i < BP_country.length ; i++ ) {
                value = BP_country[i].mProperties.key;
                aFilter.push(new Filter("BP_country", FilterOperator.Contains, value))}
            }
            if (BP_zipcode) {aFilter.push(new Filter("BP_zipcode", FilterOperator.Contains, BP_zipcode))}  
            if (BP_number) {aFilter.push(new Filter("BP_number", FilterOperator.Contains, BP_number))}
            if (BP_street) {aFilter.push(new Filter("BP_street", FilterOperator.Contains, BP_street))}
            if (BP_city) {aFilter.push(new Filter("BP_city", FilterOperator.Contains, BP_city))}
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
          this.getView().byId("BP_country").removeAllTokens();
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

  });
  });