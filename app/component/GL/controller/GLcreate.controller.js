sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, JSONModel, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("projectGL.controller.GLcreate", {
        onInit: async function () {
            this.getOwnerComponent().getRouter().getRoute("GLcreate").attachPatternMatched(this.onRoutePatternMatched, this);

            const GL = await $.ajax({
                type: "get",
                url: "/glservice/GL"
            });
            let GLAcct = new JSONModel(GL.value);
            this.getView().setModel(GLAcct, "GLAcct");

            const CoA = await $.ajax({
                type: "get",
                url: "/glservice/CoA"
            });
            let GLCoA = new JSONModel(CoA.value);
            this.getView().setModel(GLCoA, "GLCoA");

            const Group = await $.ajax({
                type: "get",
                url: "/glservice/AcctGroup"
            });
            let AcctGroup = new JSONModel(Group.value);
            this.getView().setModel(AcctGroup, "AcctGroup");

        },
        onRoutePatternMatched: function (oEvent) {
            this.onClearField();
        },
        onClearField: function () {
            this.byId("gl").setValue("");
            this.byId("coa").setValue("");
            this.byId("accttype").setSelectedKey("");
            this.byId("acctgroup").setValue("");
            this.byId("pltype").setValue("");
            this.byId("function").setValue("");
            this.byId("shorttext").setValue("");
            this.byId("longtext").setValue("");
        },
        onCreate: async function () {
            let inputData = {
				GL_number:		String(this.byId("gl").getValue()),
                GL_coa:			String(this.byId("coa").getValue()),
                GL_accttype:	String(this.byId("accttype").getSelectedKey()),
                GL_acctgroup:	String(this.byId("acctgroup").getValue()),
                GL_pltype:		String(this.byId("pltype").getValue()),
                GL_function:	String(this.byId("function").getValue()),
                GL_shorttext:	String(this.byId("shorttext").getValue()),
                GL_longtext:	String(this.byId("longtext").getValue()),
                GL_deletion:    false
            };
            await $.ajax({
                type: "POST",
                url: "/glservice/GL",
                data: JSON.stringify(inputData),
                contentType: "application/json;IEEE754Compatible=true"
            });
            this.onCancel();
        },
        onCancel: function () {
            this.getOwnerComponent().getRouter().navTo("GLhome");
        },

        // 선택 : GL계정 Value Help Fragment 

        onOpenGLDialog: function () {
            var oView = this.getView();
            // Fragment를 load해주는 과정
            if (!this._pValueHelpDialog_GL) {
                this._pValueHelpDialog_GL = Fragment.load({
                    id: oView.getId(),
                    name: "projectGL.view.fragment.GLAcctSingleValueHelp",
                    controller: this
                }).then(function (_pValueHelpDialog_GL) {
                    oView.addDependent(_pValueHelpDialog_GL);
                    return _pValueHelpDialog_GL;
                });
            }
            this._pValueHelpDialog_GL.then(function (_pValueHelpDialog_GL) {
                _pValueHelpDialog_GL.open();
            }.bind(this));
        },
        handleSearchGL: function (oEvent) {
            var aFilters = [];
            var sValue = oEvent.getParameter("value");
            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "GL_number", operator: FilterOperator.Contains, value1: sValue }),
                    new Filter({ path: "GL_coa", operator: FilterOperator.Contains, value1: sValue }),
                    new Filter({ path: "GL_shorttext", operator: FilterOperator.Contains, value1: sValue })
                ],
                and: false
            }));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(aFilters);
        },
        handleCloseGL: function (oEvent) {
            // reset the filter
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            var text = aContexts.map(function (oContext) { return oContext.getObject().GL_number; })
            var coatext = aContexts.map(function (oContext) { return oContext.getObject().GL_coa; })
            this.byId("gl").setValue(text);
            this.byId("coa").setValue(coatext);
        },

        /*         // 선택 : 계정과목표 Value Help Fragment 
        
                onOpenCoaDialog: function () {
                    var oView = this.getView();
                    // Fragment를 load해주는 과정
                    if (!this._pValueHelpDialog_Coa) {
                        this._pValueHelpDialog_Coa = Fragment.load({
                            id: oView.getId(),
                            name: "projectGL.view.fragment.CoASingleValueHelp",
                            controller: this
                        }).then(function (_pValueHelpDialog_Coa) {
                            oView.addDependent(_pValueHelpDialog_Coa);
                            return _pValueHelpDialog_Coa;
                        });
                    }
                    this._pValueHelpDialog_Coa.then(function(_pValueHelpDialog_Coa) {
                        _pValueHelpDialog_Coa.open();
                    }.bind(this));
                },
                handleSearch: function (oEvent) {
                    var aFilters = [];
                    var sValue = oEvent.getParameter("value");
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "CoA_number", operator: FilterOperator.Contains, value1: sValue }),
                            new Filter({ path: "CoA_name", operator: FilterOperator.Contains, value1: sValue })
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
                    var text = aContexts.map(function (oContext) { return oContext.getObject().CoA_number; })
                    this.byId("coa").setValue(text);
                }, */

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
            this._pValueHelpDialog_Group.then(function (_pValueHelpDialog_Group) {
                _pValueHelpDialog_Group.open();
                var aFilters = [];
                var coatext = this.byId("coa").getValue();
                aFilters.push(new Filter("AcctGroup_coa", FilterOperator.Contains, coatext));
                this.byId("selectDialog").getBinding("items").filter(aFilters);
            }.bind(this));

            // 선택된 계정과목표에 따라 fragment의 테이블을 필터링


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
            this.byId("acctgroup").setValue(text);
        },
    });
});