sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/core/Core",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/library",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea"
], function (Controller, JSONModel, Fragment, Filter, FilterOperator,Core, HorizontalLayout, VerticalLayout, Dialog, Button, Label, mobileLibrary, MessageToast, Text, TextArea) {

	"use strict";
    
    let glNUM, glURL;
	let oldGL, newGL;
	let historyURL;

	var ButtonType = mobileLibrary.ButtonType;
	var DialogType = mobileLibrary.DialogType;

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

			this.coaInput = this.byId("coa");
		},
        onRoutePatternMatched: function (oEvent) {
            glNUM = oEvent.getParameter("arguments").num;
            glURL = "/glservice/GL/" + glNUM;
            this.onDataView();
			console.log("?");
        },
        onDataView: async function () {
			const getGL = await $.ajax({
                type: "get",
                url: glURL
            });
            this.getView().setModel(new JSONModel(getGL), "GLModel");
 
			/*
			if ( this.getView().getModel("GLModel").getProperty("/GL_deletion") == true ) {
				this.getView().getModel("deleteModel").setData( {deleteMode : true} );
			} else {
				this.getView().getModel("deleteModel").setData( {deleteMode : false} );
			}
			*/

            var GLcoa = this.getView().getModel("GLModel").getProperty("/GL_coa");
            var cocdURL = "/glservice/CoCd?$filter=CoCd_coa%20eq%20%27"+GLcoa+"%27";    // GL의 CoA와 같은 CoA를 가지고 있는 Company Code를 get
            const getCoCd = await $.ajax({
                type: "get",
                url: cocdURL
            });
            this.getView().setModel(new JSONModel(getCoCd), "CoCdModel");
	
			const getHistory = await $.ajax({
				type: "get",
				url: "/glservice/History?$orderby=History_number%20desc&$filter=History_key%20eq%20%27"+glNUM+"%27"
			});
			this.getView().setModel(new JSONModel(getHistory), "HistoryModel");
        },
		onEdit: function () {
			oldGL = {
                GL_accttype:    this.getView().getModel("GLModel").getProperty("/GL_accttype"),
                GL_acctgroup:   this.getView().getModel("GLModel").getProperty("/GL_acctgroup"),
                GL_shorttext:   this.getView().getModel("GLModel").getProperty("/GL_shorttext"),
                GL_longtext:    this.getView().getModel("GLModel").getProperty("/GL_longtext")
            };

            this.byId("accttypeInput").setSelectedKey(oldGL.GL_accttype);
            this.byId("acctgroupInput").setValue(oldGL.GL_acctgroup);
            this.byId("shorttextInput").setValue(oldGL.GL_shorttext);
            this.byId("longtextInput").setValue(oldGL.GL_longtext);
            
			this.getView().getModel("editModel").setProperty("/editMode", true);
		},
		onEditConfirm: async function () {
			// debugger;

			newGL = {
                GL_accttype:	this.byId("accttypeInput").getSelectedKey(),
                GL_acctgroup:	this.byId("acctgroupInput").getValue(),
                GL_shorttext:	this.byId("shorttextInput").getValue(),
                GL_longtext:	this.byId("longtextInput").getValue()
            };

            await $.ajax({
                type: "patch",
                url: glURL,
                data: JSON.stringify(newGL),
                contentType: "application/json;IEEE754Compatible=true"
            });

			let newGLkeys = Object.keys(newGL);
			let newGLvalues = Object.values(newGL);
			let oldGLvalues = Object.values(oldGL);

            this.onHistory(newGLkeys, newGLvalues, oldGLvalues);
            this.getView().getModel("editModel").setProperty("/editMode", false);
		},
		onEditCancel: function () {
            this.getView().getModel("editModel").setProperty("/editMode", false);
		},
		onHistory: async function (newKeys, newValues, oldValues) {
            for ( var i=0; i < newKeys.length; i++ ) {
                if ( oldValues[i] !== newValues[i] ) {
                    const getHistoryNUM = await $.ajax({
                        type: "get",
                        url: "/glservice/History?$orderby=History_number%20desc&$top=1"
                    });
                    this.getView().setModel(new JSONModel(getHistoryNUM), "HistoryNUMModel");
                    let lastHistoryNUM = this.getView().getModel("HistoryNUMModel").getProperty("/value/0/History_number");

                    let historyData = {
                        History_number:        String(parseInt(lastHistoryNUM)+1),
                        History_table:        "GL",
                        History_key:        String(glNUM),
                        History_column:        String(newKeys[i]),
                        History_old:        String(oldValues[i]),
                        History_new:        String(newValues[i]),
                        History_datetime:    new Date()
                    };

                    await $.ajax({
                        type: "POST",
                        url: "/glservice/History",
                        data: JSON.stringify(historyData),
                        contentType: "application/json;IEEE754Compatible=true"
                    });
                }
            }
            this.onDataView();
        },
        onDelete: function () {
            if (!this.oDeleteDialog) {
				this.oDeleteDialog = new Dialog({
                    type: DialogType.Message,
					title: "삭제 확인",
					content: [
						new HorizontalLayout({
							content: [
								new VerticalLayout({
									width: "120px",
									content: [
										new Text({ text: "G/L 계정: "}),
										new Text({ text: "계정과목표: " }),
										new Text({ text: "계정 그룹: " })
									]
								}),
								new VerticalLayout({
									content: [
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_number") }),
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_coa") }),
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_acctgroup") })
									]
								})
							]
						}),
						new TextArea("deletionNote", {
							width: "100%",
							placeholder: "삭제 사유"
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "삭제",
						press: async function () {
							let oldDLT = {
								GL_deletion:	false,
								GL_delreason:	String("")
							};
							let newDLT = {
								GL_deletion:	true,
								GL_delreason:	Core.byId("deletionNote").getValue()
							};			
							await $.ajax({
								type: "patch",
								url: glURL,
								data: JSON.stringify(newDLT),
								contentType: "application/json;IEEE754Compatible=true"
							});

							let newDLTkeys = Object.keys(newDLT);
							let newDLTvalues = Object.values(newDLT);
							let oldDLTvalues = Object.values(oldDLT);
							this.onHistory(newDLTkeys, newDLTvalues, oldDLTvalues);

							// this.getView().getModel("deleteModel").setProperty("/deleteMode", true);
							this.oDeleteDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "취소",
						press: function () {
							this.oDeleteDialog.close();
						}.bind(this)
					})
				});
			}
			this.oDeleteDialog.open();
        },
		onRecover: function () {
			if (!this.oRecoverDialog) {
				this.oRecoverDialog = new Dialog({
                    type: DialogType.Message,
					title: "계정 복구 확인",
					content: [
						new HorizontalLayout({
							content: [
								new VerticalLayout({
									width: "120px",
									content: [
										new Text({ text: "G/L 계정: "}),
										new Text({ text: "계정과목표: " }),
										new Text({ text: "계정 그룹: " })
									]
								}),
								new VerticalLayout({
									content: [
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_number") }),
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_coa") }),
										new Text({ text: this.getView().getModel("GLModel").getProperty("/GL_acctgroup") })
									]
								})
							]
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "복구",
						press: async function () {							
							await $.ajax({
								type: "patch",
								url: glURL,
								data: JSON.stringify( { GL_deletion: false } ),
								contentType: "application/json;IEEE754Compatible=true"
							});
							this.onHistory(["GL_deletion"], [false], [true]);
							this.oRecoverDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "취소",
						press: function () {
							this.oRecoverDialog.close();
						}.bind(this)
					})
				});
			}
			this.oRecoverDialog.open();
		},
		onBack: function () {
			this.onEditCancel();
			this.getOwnerComponent().getRouter().navTo("GLmain");
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
                    new Filter({ path: "AcctGroup_name", operator: FilterOperator.Contains, value1: sValue })
                ],
                and: false
            }));
			aFilters.push(new Filter({ path: "AcctGroup_coa", operator: FilterOperator.Contains, value1: this.coaInput.getText() }))
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

