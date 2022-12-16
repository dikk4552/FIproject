sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
	"use strict";
    
    let glNUM, glURL;

	return Controller.extend("projectGL.controller.GLdetail", {
		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("GLdetail").attachPatternMatched(this.onRoutePatternMatched, this);

			var oData = { editMode : false };
			var editModel = new JSONModel(oData);
			this.getView().setModel(editModel, "editModel");
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
            this.byId("coaInput").setValue(this.getView().getModel("GLModel").getProperty("/GL_coa"));
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
            
        }
	});
});

