sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"../model/formatter"
], 

function(Controller, JSONModel, MessageBox, formatter) {
	"use strict";
	let sObjectId, sUrl;

	return Controller.extend("projectDoc.controller.Docdetail", {
		formatter : formatter,
				
		onInit: async function () {
			const myRoute = this.getOwnerComponent().getRouter().getRoute("Docdetail");
			myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);			
			console.log(myRoute);
		

		},


		onMyRoutePatternMatched: async function (oEvent) {

			sObjectId = oEvent.getParameter("arguments").num; 
			console.log(sObjectId);

			sUrl = "/docservice/Doc/" + sObjectId; 
			console.log(sUrl);

			const Docmain = await $.ajax({      
                type: "get",
                url: sUrl
            });
			console.log(Docmain);
            let DocModel = new JSONModel(Docmain);
            this.getView().setModel(DocModel, "DocModel");
			console.log(this.getView().getModel("DocModel"));
			var table = this.getView().getModel("DocModel").oData
			var arr=[];
			var tabledata = {
					Doc_NO : 1,
					Doc_CD : "C",
					Doc_D_acct :table.Doc_C_acct,
					Doc_D_amount : table.Doc_C_amount,
					Doc_D_cost : table.Doc_C_cost,
					Doc_D_prof : table.Doc_C_prof,
					Doc_b :""
				}
			var tabledata2 = {
					Doc_NO : 2,
					Doc_CD : "D",
					Doc_D_acct :table.Doc_D_acct,
					Doc_D_amount : table.Doc_D_amount,
					Doc_D_cost : table.Doc_D_cost,
					Doc_D_prof : table.Doc_D_prof,
					Doc_b :""
				}
				arr.push(tabledata);
				arr.push(tabledata2);
				
			let DoctableModel = new JSONModel(arr);
			this.getView().setModel(DoctableModel, "DoctableModel");

			
			
		},		

		onDelete: async function (sUrl) {

			MessageBox.confirm("정말 삭제하시겠습니까?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				
				onClose : function (sAction) {
					this.onClose(sAction)
				}.bind(this)
			});
					
		},
		onClose: async function (oAction) {
			if (oAction === 'YES') {
	
			sUrl = "/docservice/Doc/" + sObjectId; 
			console.log(sUrl);	

			await $.ajax({      
				type: "DELETE",
				url: sUrl
			});
			this.onBack();
			

			}else{
				return false;
			}},
		

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("Docmain");
		}

	});
});