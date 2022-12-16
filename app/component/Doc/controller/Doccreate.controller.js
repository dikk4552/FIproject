sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/m/MessageBox"

    ],
    function (Controller, JSONModel, Filter, MessageBox) {
        "use strict";

        let CreateNum;

        return Controller.extend("projectDoc.controller.Doccreate", {

            onInit: function () {
                this._initModel();
                const myRoute = this.getOwnerComponent().getRouter().getRoute("Doccreate");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
            },

            _initModel: function () {
                let tableData = [{
                    Doc_NO: 1,
                    Doc_CD: 'C'
                }, {
                    Doc_NO: 2,
                    Doc_CD: 'D'
                }];

                this.getView()
                    .setModel(
                        new JSONModel(tableData),
                        'createDoc'
                    )
            },


            onMyRoutePatternMatched: async function (oEvent) {
                this._initModel();
                this.onClearField();
                CreateNum = oEvent.getParameter("arguments").num;
                this._createNum = CreateNum;

                this.getView().byId("Doc_number").setText(CreateNum);


                const Cocd = await $.ajax({
                    type: "get",
                    url: "/glservice/CoCd"
                });

                var CocdModel = new JSONModel(Cocd.value);
                this.getView().setModel(CocdModel, "CocdModel");


            },


            onCreate: async function () {
                console.log(this.byId("Doc_text").getValueStateText());
                
                const oView = this.getView(),
                    oCreateModel = oView.getModel('createDoc'),
                    oTableData = oCreateModel.getProperty('/');

                let Test = this.getView().byId("Docmain").getBinding("rows");
                console.log(Test);

                // let temp = new JSONModel(this.temp).oData;
                let temp = {};
                temp.Doc_number = this._createNum;
                temp.Doc_cocd = this.byId("Doc_cocd").getSelectedKey();
                temp.Doc_postdate = this.byId("Doc_postdate").getValue();
                temp.Doc_docdate = this.byId("Doc_docdate").getValue();
                temp.Doc_type = this.byId("Doc_type").getSelectedKey();
                temp.Doc_curr = this.byId("Doc_curr").getSelectedKey();
                temp.Doc_text = this.byId("Doc_text").getValue();
                temp.Doc_ref = this.byId("Doc_ref").getValue();
                temp.Doc_C_acct = Test.oList[0].Doc_C_acct
                temp.Doc_C_amount = Number(Test.oList[0].Doc_C_amount);
                temp.Doc_C_cost = Test.oList[0].Doc_C_cost
                temp.Doc_C_prof = Test.oList[0].Doc_C_prof
                temp.Doc_D_acct = Test.oList[1].Doc_D_acct
                temp.Doc_D_amount = Number(Test.oList[1].Doc_D_amount);
                temp.Doc_D_cost = Test.oList[1].Doc_D_cost
                temp.Doc_D_prof = Test.oList[1].Doc_D_prof

                console.log(temp);
                // var bValidationError=false;
                // for(var key in temp){
                //   if(temp[key]===''){
                //     bValidationError=true;
                //   }
                // }
                // if(!bValidationError){
                await $.ajax({
                    type: "POST",
                    url: "/docservice/Doc",
                    contentType: "application/json;IEEE754Compatible=true",
                    data: JSON.stringify(temp)
                })

                console.log(temp);
                this.onBack();
                // }else{
                //   MessageBox.alert("입력이 완료되지 않았습니다.");
                // }

            },

            onClearField: function () {
                let Test = this.getView().byId("Docmain");
                console.log(Test);
                return;


                this.getView().byId("Doc_cocd").setSelectedKey("");
                this.getView().byId("Doc_postdate").setValue("");
                this.getView().byId("Doc_docdate").setValue("");
                this.getView().byId("Doc_type").setSelectedKey("");
                this.getView().byId("Doc_curr").setSelectedKey("");
                this.getView().byId("Doc_text").setValue("");
                this.getView().byId("Doc_ref").setValue("");
                this.getView().byId("Doc_D_acct").setValue("");
                this.getView().byId("Doc_D_amount").setValue("");
                this.getView().byId("Doc_D_cost").setValue("");
                this.getView().byId("Doc_D_prof").setValue("");
                // this.getView().byId("Doc_C_acct").setValue("");
                // this.getView().byId("Doc_C_amount").setValue("");
                // this.getView().byId("Doc_C_cost").setValue("");
                // this.getView().byId("Doc_C_prof").setValue("");
                this.getView().byId("Doc_b").setValue("");

            },


            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("Docmain");
            }

        });
    });
