sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("project1.controller.Home", {
        onInit: function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("Home");
            myRoute.attachPatternMatched(this.onMyRoutePatterMatched, this);
        },
        onMyRoutePatterMatched: async function () {
            const BP = await $.ajax({
                type: "get",
                url: "/bpservice/BP?$filter=BP_payterm eq '0001'"
            });
            console.log(BP);
            let BPModel = new JSONModel(BP.value);
            this.getView().setModel(BPModel, "BPModel");
            console.log(this.getView().getModel("BPModel"));
        },
		onBP_list: function () {
            this.getOwnerComponent().getRouter().navTo("BP");
        },
        onGL_list: function () {
            this.getOwnerComponent().getRouter().navTo("GL");
        },
		onDoc_list: function () {
            this.getOwnerComponent().getRouter().navTo("Doc");
        },
        onNews: function () {
            window.open('https://news.sap.com/'); 
        }
	});
});