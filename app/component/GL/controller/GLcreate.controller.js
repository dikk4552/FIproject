sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("projectGL.controller.GLcreate", {
        onInit: function() {
            this.getOwnerComponent().getRouter().getRoute("GLcreate").attachPatternMatched(this.onRoutePatternMatched, this);
        },
        onRoutePatternMatched: function (oEvent) {
            this.onClearField();
        },
        onClearField: function() {
			this.byId("gl").setValue("");
            this.byId("coa").setValue("");
            this.byId("accttype").setSelectedKey("");
            this.byId("acctgroup").setValue("");
            this.byId("pltype").setValue("");
            this.byId("function").setValue("");
            this.byId("shorttext").setValue("");
            this.byId("longtext").setValue("");
        },
        onCreate: async function() {
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
        onCancel: function() {
            this.getOwnerComponent().getRouter().navTo("GL");
        }
    });
});