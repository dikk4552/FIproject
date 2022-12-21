sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator) {
	"use strict";
    
    let glNUM, glURL;

	return Controller.extend("projectGL.controller.GLdetail", {
		onInit: async function () {
			this.getOwnerComponent().getRouter().getRoute("GLdetail").attachPatternMatched(this.onRoutePatternMatched, this);

			var oData = { editMode : false };
			var editModel = new JSONModel(oData);
			this.getView().setModel(editModel, "editModel");

            const Group = await $.ajax({
				type: "get",
				url: "/glservice/AcctGroup"
			});
			let AcctGroup = new JSONModel(Group.value);
			this.getView().setModel(AcctGroup,"AcctGroup");
		},
        onRoutePatternMatched: function (oEvent) {
            glNUM = oEvent.getParameter("arguments").num;
            glURL = "/glservice/GL/" + glNUM;
            this.onDataView();
        },
        onDataView: async function () {
            const getGL = await $.ajax({
                type: "get",
                url: glURL
            });
            let GLModel = new JSONModel(getGL);
            this.getView().setModel(GLModel, "GLModel");

            var glCoA = this.getView().getModel("GLModel").getProperty("/GL_coa");
            var cocdURL = "/glservice/CoCd?$filter=CoCd_coa%20eq%20%27"+glCoA+"%27";
            const getCoCd = await $.ajax({
                type: "get",
                url: cocdURL
            });
            let CoCdModel = new JSONModel(getCoCd);
            this.getView().setModel(CoCdModel, "CoCdModel");
            console.log(this.getView().getModel("CoCdModel"));
        },
		onEdit: function () {
            this.byId("accttypeInput").setSelectedKey(this.getView().getModel("GLModel").getProperty("/GL_accttype"));
            this.byId("acctgroupInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_acctgroup"));
            this.byId("pltypeInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_pltype"));
            this.byId("functionInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_function"));
            this.byId("shorttextInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_shorttext"));
            this.byId("longtextInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_longtext"));
            
			this.getView().getModel("editModel").setProperty("/editMode", true);   
		},
		onEditConfirm: async function () {
			let inputData = {
                GL_coa:			String(this.byId("coaInput").getValue()),
                GL_accttype:	String(this.byId("accttypeInput").getSelectedKey()),
                GL_acctgroup:	String(this.byId("acctgroupInput").getValue()),
                GL_pltype:		String(this.byId("pltypeInput").getValue()),
                GL_function:	String(this.byId("functionInput").getValue()),
                GL_shorttext:	String(this.byId("shorttextInput").getValue()),
                GL_longtext:	String(this.byId("longtextInput").getValue())
            };
            
            console.log(inputData);

            await $.ajax({
                type: "patch",
                url: glURL,
                data: JSON.stringify(inputData),
                contentType: "application/json;IEEE754Compatible=true"
            });
            
            this.getView().getModel("editModel").setProperty("/editMode", false);
            this.onDataView();
		},
		onEditCancel: function () {
            // this.byId("coaInput").setValue("");
            // this.byId("accttypeInput").setSelectedKey("");
            // this.byId("acctgroupInput").setValue("");
            // this.byId("pltypeInput").setValue("");
            // this.byId("functionInput").setValue("");
            // this.byId("shorttextInput").setValue("");
            // this.byId("longtextInput").setValue("");

            this.getView().getModel("editModel").setProperty("/editMode", false);
            // this.onBack();
		},
		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("GLhome");
		},
        onOpenAcctGroupDialog: function () {
            
        },

        // 선택 : 계정그룹 Value Help Fragment 

        onOpenAcctGroupDialog: function () {
            var oView = this.getView();
            // Fragment를 load해주는 과정
            if (!this._pValueHelpDialog_Group) {
                this._pValueHelpDialog_Group = Fragment.load({
                    id: oView.getId(),
                    name: "projectGL.view.fragment.GroupSingleValueHelp",
                    controller: this
                }).then(function (_pValueHelpDialog_Group) {
                    oView.addDependent(_pValueHelpDialog_Group);
                    return _pValueHelpDialog_Group;
                });
            }
            this._pValueHelpDialog_Group.then(function(_pValueHelpDialog_Group) {
                _pValueHelpDialog_Group.open();
                var aFilters = [];
                var coatext = this.byId("coa").getText();
                aFilters.push(new Filter("AcctGroup_coa", FilterOperator.Contains, coatext));
                this.byId("selectDialog").getBinding("items").filter(aFilters);
            }.bind(this));
        },
        handleSearchGroup: function (oEvent) {
            var aFilters = [];
            var sValue = oEvent.getParameter("value");
            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "AcctGroup_number", operator: FilterOperator.Contains, value1: sValue }),
                    new Filter({ path: "AcctGroup_coa", operator: FilterOperator.Contains, value1: sValue }),
                    new Filter({ path: "AcctGroup_name", operator: FilterOperator.Contains, value1: sValue })
                ],
                and: false
            }));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(aFilters);
        },
        handleCloseGroup: function (oEvent) {
            // reset the filter
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            var text = aContexts.map(function (oContext) { return oContext.getObject().AcctGroup_number; })
            this.byId("acctgroupInput").setValue(text);
        },          
	});
});

