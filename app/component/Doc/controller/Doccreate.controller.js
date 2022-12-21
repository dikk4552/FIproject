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
                    Doc_CD: 'D'
                }, {
                    Doc_NO: 2,
                    Doc_CD: 'C'
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
                
                var check_table = await this.tablevalidate("Docmain");
                var check = await this.validate("simpleform");
                if(check===false||check_table==false){
                    sap.m.MessageBox.error("필수 값을 전부 입력해주세요.");
                    return;
                }
                console.log(this.byId("Doc_text").getValueStateText());

                const oView = this.getView(),
                    oCreateModel = oView.getModel('createDoc'),
                    oTableData = oCreateModel.getProperty('/');

                let Test = this.getView().byId("Docmain").getBinding("rows");
                console.log(Test);
                console.log(Test.oList[0].Doc_C_amount);

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
                temp.Doc_C_acct = Test.oList[1].Doc_D_acct
                temp.Doc_C_amount = Number(Test.oList[1].Doc_D_amount);
                temp.Doc_C_cost = Test.oList[1].Doc_D_cost
                temp.Doc_C_prof = Test.oList[1].Doc_D_prof
                temp.Doc_D_acct = Test.oList[0].Doc_D_acct
                temp.Doc_D_amount = Number(Test.oList[0].Doc_D_amount);
                temp.Doc_D_cost = Test.oList[0].Doc_D_cost
                temp.Doc_D_prof = Test.oList[0].Doc_D_prof

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
                

            },
            validate: function (form) {
                var check=true;
                var content = this.byId(form).getContent();
                for (var i = 0; i < content.length; i++) {
                    var item = content[i].mAggregations.items
                    for (var j = 0; j < item.length; j++) {
                        var element_type = item[j].getMetadata().getName().split('.')[2];
                        if (element_type === 'Input' || element_type === 'DatePicker' || element_type === 'ComboBox') {
                            item[j].setValueState("None");
                            item[j].setValueStateText(null);
                            if (item[j].mProperties.required == true) {
                                var element_value = item[j].mProperties.value;
                                if (element_value === '' || element_value === null || element_value === undefined) {
                                    item[j].setValueState("Error");
                                    item[j].setValueStateText("필수 값을 입력해주세요.");
                                    check=false;
                                }
                            }
                        }
                    }
                }

                return check;
            },
            tablevalidate : function(tableid){
                var check;
                var table_rows = this.byId(tableid).mAggregations.rows;
                for(var i=0; i<table_rows.length;i++){
                    var table_cells = table_rows[i].mAggregations.cells;
                    for(var j=0;j<table_cells.length;j++){
                        console.log(table_cells[j].getMetadata().getName());
                        var element_type = table_cells[j].getMetadata().getName().split('.')[2];

                        if (element_type === 'Input' || element_type === 'DatePicker' || element_type === 'ComboBox') {
                            console.log(table_cells[j].mProperties);
                            table_cells[j].setValueState("None");
                            table_cells[j].setValueStateText(null);
                            if (table_cells[j].mProperties.required == true) {
                                var element_value = table_cells[j].mProperties.value;
                                if (element_value === '' || element_value === null || element_value === undefined) {
                                    table_cells[j].setValueState("Error");
                                    table_cells[j].setValueStateText("필수 값을 입력해주세요.");
                                    check=false;
                                }
                            }
                        }
                    }

                }
                return check;
            },
            onClearField: function () {

                this.getView().byId("Doc_cocd").setSelectedKey(null);
                this.getView().byId("Doc_postdate").setValue(null);
                this.getView().byId("Doc_docdate").setValue(null);
                this.getView().byId("Doc_type").setSelectedKey(null);
                this.getView().byId("Doc_curr").setSelectedKey(null);
                this.getView().byId("Doc_text").setValue(null);
                this.getView().byId("Doc_ref").setValue(null);
                this.getView().byId("Doc_b").setValue(null);

            },


            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("Docmain");
            }

        });
    });
