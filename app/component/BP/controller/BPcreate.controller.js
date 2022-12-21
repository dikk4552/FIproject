sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        'sap/ui/core/Fragment',
        "sap/ui/core/syncStyleClass",
    ],
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox, Fragment, syncStyleClass) {
        "use strict";

        return Controller.extend("projectBP.controller.BPcreate", {

            onInit: function () {
                // this - Controller
                // Controller._initModel()
                this._initModel();

                const myRoute = this.getOwnerComponent().getRouter().getRoute("BPcreate");
                myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
            },

            _initModel: async function () {
                this.getView()
                    .setModel(
                        new JSONModel({}),
                        'BPcreate'
                    );

                const Cocd = await $.ajax({
                    type: "get",
                    url: "/glservice/CoCd"
                });
                var CocdModel = new JSONModel(Cocd.value);
                this.getView().setModel(CocdModel, "CocdModel");

                const Region = await $.ajax({
                    type: "get",
                    url: "/bpservice/Region"
                });
                let RegionModel = new JSONModel(Region.value);
                this.getView().setModel(RegionModel,"RegionModel");
            },

            /**
             * url에 접근할때마다 발생하는 이벤트 함수
             * @param {sap.ui.base.Event} oEvent 
             */
            onMyRoutePatternMatched: function (oEvent) {
                /**
                 * s - string
                 * a - array
                 * o - object
                 * b - boolean
                 * i - number
                 */
                let oArguments = oEvent.getParameter('arguments');
                let sCategory = oArguments.category;

                const oBPModel = this.getView().getModel('BPcreate');
                let sTitle = '', iBP_category = 1, sName = '';

                if (sCategory === 'A') {
                    sTitle = '개인 생성';
                    iBP_category = 1;
                    sName = '이름 :'

                }

                if (sCategory === 'B') {
                    sTitle = '조직 생성';
                    iBP_category = 2;
                    sName = '조직명 :'
                }

                oBPModel.setProperty('/', {
                    title: sTitle,
                    BP_category: iBP_category,
                    name: sName
                });

                this.onClearField();
                this.onDataView(sCategory);
                let CreateNum = oEvent.getParameter("arguments").num;
                this._createNum = CreateNum;
                let now = new Date();
                let Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0') + "-"
                    + now.getDate().toString().padStart(2, '0');
                this._Today = Today;

                this.getView().byId("BP_number").setText(CreateNum);
                this.getView().byId("BP_createdate").setText(Today);


            },

            /**
             * 지급조건 필터링
             */
            _filter_BP_payterm: function (sCategory) {
                const oComboBox = this.byId('BP_payterm');

                let aFilter = [];
                if (sCategory === 'A') {
                    aFilter = new Filter('PayTerm_accttype', 'EQ', 'Customer');
                }

                if (sCategory === 'B') {
                    aFilter = new Filter('PayTerm_accttype', 'EQ', 'Vendor');
                }
            },
            onDataView: async function (sCategory) {
                const BPcreate = await $.ajax({
                    type: "get",
                    url: "/bpservice/PayTerm"
                });

                let PayTermModel = new JSONModel(BPcreate.value);
                this.getView().setModel(PayTermModel, "PayTermModel");

                this._filter_BP_payterm(sCategory);

            },


            onCreate: async function () {
                // let temp = new JSONModel(this.temp).oData;
                let temp = {};
                temp.BP_number = this._createNum;
                temp.BP_category = this.byId('BP_category').getText() === '1' ? '개인' : '조직';
                temp.BP_name = this.byId("BP_name").getValue();
                temp.BP_street = this.byId("BP_street").getValue()
                temp.BP_house = this.byId("BP_house").getValue()
                temp.BP_zipcode = this.byId("BP_zipcode").getValue()
                temp.BP_city = this.byId("BP_city").getValue()
                temp.BP_country = this.byId("BP_country").getValue();
                temp.BP_language = this.byId("BP_language").getValue();
                temp.BP_cocd = this.byId("BP_cocd").getSelectedKey();
                temp.BP_payterm = this.byId("BP_payterm").getSelectedKey();
                temp.BP_manager = this.byId("BP_manager").getValue();
                temp.BP_createdate = this._Today;
                temp.BP_estdate = this.byId("BP_manager").getValue();
                temp.BP_tin = this.byId("BP_tin").getValue();
                temp.BP_industry = this.byId("BP_industry").getValue();
                temp.BP_phone = this.byId("BP_phone").getValue();
                temp.BP_fax = this.byId("BP_fax").getValue();
                temp.BP_email = this.byId("BP_email").getValue();
                temp.BP_website = this.byId("BP_website").getValue();
 
                console.log(temp);

                var bValidationError = false;
                for (var key in temp) {
                    if (temp[key] === '') {
                        bValidationError = true;
                    }
                }
                temp.BP_title = this.byId("BP_title").getSelectedKey();

                if (!bValidationError) {
                    await $.ajax({
                        type: "POST",
                        url: "/bpservice/BP",
                        contentType: "application/json;IEEE754Compatible=true",
                        data: JSON.stringify(temp)
                    });
                    this.onBack();
                } else {
                    MessageBox.alert("입력이 완료되지 않았습니다.");
                }



            },

            onClearField: function () {
                this.getView().byId("BP_name").setValue("");
                this.getView().byId("BP_title").setValue("");
                this.getView().byId("BP_street").setValue("");
                this.getView().byId("BP_house").setValue("");
                this.getView().byId("BP_zipcode").setValue("");
                this.getView().byId("BP_city").setValue("");
                this.getView().byId("BP_country").setValue("");
                this.getView().byId("BP_language").setValue("");
                this.getView().byId("BP_cocd").setValue("");
                this.getView().byId("BP_payterm").setValue("");
                this.getView().byId("BP_manager").setValue("");
                this.getView().byId("BP_estdate").setValue("");
                this.getView().byId("BP_tin").setValue("");
                this.getView().byId("BP_industry").setValue("");
                this.getView().byId("BP_phone").setValue("");
                this.getView().byId("BP_fax").setValue("");
                this.getView().byId("BP_email").setValue("");
                this.getView().byId("BP_website").setValue("");
            },
            onBack: function () {
                this.getOwnerComponent().getRouter().navTo("BPmain");
            },

            // Country Single Value Help Funtion 구현

            onValueHelpCountry: function () {
                var oView = this.getView();
                // Fragment를 load해주는 과정
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "projectBP.view.fragment.CountrySingleValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function(oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },
            handleSearch: function (oEvent) {
                var aFilters = [];
                var sValue = oEvent.getParameter("value");
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "Reg_number", operator: FilterOperator.Contains, value1: sValue }),
                        new Filter({ path: "Reg_name", operator: FilterOperator.Contains, value1: sValue })
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
                var text = aContexts.map(function (oContext) { return oContext.getObject().Reg_number; })
                this.byId("BP_country").setValue(text);
            },

        });
    });
