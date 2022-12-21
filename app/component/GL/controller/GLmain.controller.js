sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	'sap/m/Token',
	'sap/ui/comp/library',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'
], function(Controller, JSONModel, Filter, FilterOperator, Fragment, Token, compLibrary, TypeString, ColumnListItem, Label, SearchField, UIColumn, MColumn, Text) {
	"use strict";

	return Controller.extend("projectGL.controller.GLmain", {

		onInit: async function() {
			this.getOwnerComponent().getRouter().getRoute("GL").attachPatternMatched(this.onMyRoutePatternMatched, this);

			// Fragment(선택: 계정과목표)를 위해 데이터 모델 정의
			const CoA = await $.ajax({
				type: "get",
				url: "/glservice/CoA"
			});
			let GLCoA = new JSONModel(CoA.value);
			this.getView().setModel(GLCoA,"GLCoA");

			// Fragment(선택: 계정 그룹)를 위해 데이터 모델 정의
 			const Group = await $.ajax({
				type: "get",
				url: "/glservice/AcctGroup"
			});
			let AcctGroup = new JSONModel(Group.value);
			this.getView().setModel(AcctGroup,"AcctGroup");

			// Value Help Dialog standard use case with filter bar without filter suggestions
			var oMultiInput = this.byId("GL_coa"); 
			this._oMultiInput = oMultiInput;

			var oMultiInput2 = this.byId("GL_acctgroup"); 
			this._oMultiInput2 = oMultiInput2;
		},

		onMyRoutePatternMatched: async function () {
			this.onDataView();
			this.onClearField();
		},

		onClearField: function(){
			this.getView().byId("GL_coa").removeAllTokens();
			this.getView().byId("GL_number").setValue("");
			this.getView().byId("GL_accttype").setSelectedKey(""); 
			this.getView().byId("GL_acctgroup").removeAllTokens("");
			this.onSearch();
		},

		onDataView: async function(){
			const GL = await $.ajax({
				type: "get",
				url: "/glservice/GL"
			});
			let GLmodel = new JSONModel(GL.value);
			this.getView().setModel(GLmodel,"GLmodel");
			this.onTableLength();
		},

		onTableLength: function() {
            let TableIndex = "G/L 계정과목 목록 (" + this.byId("GLtable").getBinding().aIndices.length + ")";
            this.getView().byId("TableName").setText(TableIndex); 
        },

		onSearch: function () {
			let aFilter = [];
			let value;
			let coa = this.byId("GL_coa").getTokens();
			let number = this.byId("GL_number").getValue();
			let accttype = this.byId("GL_accttype").getSelectedKey();
			let acctgroup = this.byId("GL_acctgroup").getTokens();

			if(coa) { for(var i = 0 ; i < coa.length ; i++) {
				value = coa[i].mProperties.key;
				aFilter.push(new Filter("GL_coa", FilterOperator.Contains, value));}
			}
			if(acctgroup) { for(var i = 0 ; i < acctgroup.length ; i++) {
				value = acctgroup[i].mProperties.key;
				aFilter.push(new Filter("GL_acctgroup", FilterOperator.Contains, value));}
			}
			if (number) { aFilter.push(new Filter("GL_number", FilterOperator.Contains, number)) };
			if (accttype) { aFilter.push(new Filter("GL_accttype", FilterOperator.Contains, accttype)) };
			let oTable = this.byId("GLtable").getBinding("rows");
			oTable.filter(aFilter);

			this.onTableLength();
		},

		onCreateGLWizard : function() {
			this.getOwnerComponent().getRouter().navTo("")
		},


		// CoA Value Help Dialog Operation and Functions

		onValueHelpRequested: function() {

			this._oBasicSearchField = new SearchField();
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					name: "projectGL.view.fragment.CoAValueHelp"
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
							path: "GLCoA>/",
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oTable.addColumn(new UIColumn({label: "계정과목표", template: "GLCoA>CoA_number"}));
						oTable.addColumn(new UIColumn({label: "내 역", template: "GLCoA>CoA_name"}));
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
					new Filter({ path: "CoA_number", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "CoA_name", operator: FilterOperator.Contains, value1: sSearchQuery })
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
		
		// AcctGroup Value Help Dialog Operation and Functions

		onValueHelpRequested_Group: function() {

			this._oBasicSearchField = new SearchField();
			if (!this.pDialog2) {
				this.pDialog2 = this.loadFragment({
					name: "projectGL.view.fragment.GroupValueHelp"
				});
			}
			this.pDialog2.then(function(oDialog2) {

				var oFilterBar = oDialog2.getFilterBar();
				this._oVHD = oDialog2;
				// Initialise the dialog with model only the first time. Then only open it

				this.getView().addDependent(oDialog2);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);
				
				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchField.attachSearch(function() {
					oFilterBar.search();
				});
				
				if (this._bDialogInitialized2) {
					var bFilters = [];
					var CoATokens = this._oMultiInput.getTokens()
					if (CoATokens.length) { // 계정과목표 선택에 맞게 계정 그룹 테이블 필터링
						CoATokens.forEach( (oToken) => { bFilters.push(new Filter("AcctGroup_coa", FilterOperator.EQ, oToken.getKey() ) ) } )
						this._filterTable(new Filter({
							filters: bFilters,
							and: false
						}));
					} else {
						this._filterTable(new Filter({
							filters: bFilters,
							and: true
						}));
					}

					// Re-set the tokens from the input and update the table
					oDialog2.setTokens([]);
					oDialog2.setTokens(this._oMultiInput2.getTokens());
					oDialog2.update();
					oDialog2.open();
					return;
				}

				oDialog2.getTableAsync().then(function (oTable) {

					oTable.setModel(this.oProductsModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "AcctGroup>/",
							events: {
								dataReceived: function() {
									oDialog2.update();
								}
							}
						});
						oTable.addColumn(new UIColumn({label: "계정과목표", template: "AcctGroup>AcctGroup_coa"}));
						oTable.addColumn(new UIColumn({label: "계정 그룹", template: "AcctGroup>AcctGroup_number"}));
						oTable.addColumn(new UIColumn({label: "의 미", template: "AcctGroup>AcctGroup_name"}));
					}
					oDialog2.update();
				}.bind(this));

				var bFilters = [];
				var CoATokens = this._oMultiInput.getTokens()
				if (CoATokens.length) {
					CoATokens.forEach( (oToken) => { bFilters.push(new Filter("AcctGroup_coa", FilterOperator.EQ, oToken.getKey() ) ) } )
					this._filterTable(new Filter({
						filters: bFilters,
						and: false
					}));
				} else {
					this._filterTable(new Filter({
						filters: bFilters,
						and: true
					}));
				}

				oDialog2.setTokens(this._oMultiInput2.getTokens());
				
				// set flag that the dialog is initialized
				this._bDialogInitialized2 = true;
				oDialog2.open();
			}.bind(this));
		},
		onFilterBarSearch_Group: function (oEvent) {
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
					new Filter({ path: "AcctGroup_number", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "AcctGroup_coa", operator: FilterOperator.Contains, value1: sSearchQuery }),
					new Filter({ path: "AcctGroup_name", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
		onValueHelpOkPress_Group: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			var AcctGroup = this.getView().getModel("AcctGroup").oData;
			var coaTokens = [];

			for(var i =0;i<aTokens.length;i++){
				aTokens[i].mProperties.text = aTokens[i].mProperties.key;

				var GroupKey = aTokens[i].mProperties.key;
				for(var j = 0 ; j < AcctGroup.length ; j++){
					if(GroupKey == AcctGroup[j].AcctGroup_number) {
						coaTokens.push( new Token({text: AcctGroup[j].AcctGroup_coa, key: AcctGroup[j].AcctGroup_coa}) )
					}
				}
			}

			coaTokens = coaTokens.reduce((prev, now) => {
				if (!prev.some(obj => obj.mProperties.key === now.mProperties.key)) prev.push(now);
					return prev;
			}, []); // coaTokens 안에 중복된 key값을 가진 토큰을 제거(reduce : 배열 중복값 제거)

			this._oMultiInput.setTokens(coaTokens);
			this._oMultiInput2.setTokens(aTokens);
			this._oVHD.close();
		},

		onValueHelpCancelPress_Group: function () {
			this._oVHD.close();
		},


	
	});
});