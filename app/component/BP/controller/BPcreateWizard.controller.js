sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageBox, Fragment) {
	"use strict";

	return Controller.extend("projectBP.controller.BPcreateWizard", {
		onInit: async function () {
			this.getOwnerComponent().getRouter().getRoute("BPcreateWizard").attachPatternMatched(this.onMyRoutePatternMatched, this);

			this._wizard = this.byId("BPcreateWizard");
			this._oNavContainer = this.byId("BPcreateWizardContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

			this.onSetWizardModel();
			
			const Region = await $.ajax({
				type: "get",
				url: "/bpservice/Region"
			  });
			  let RegionModel = new JSONModel(Region.value);
			  this.getView().setModel(RegionModel,"RegionModel");

			const Cocd = await $.ajax({
				type: "get",
				url: "/glservice/CoCd"
			});
			var CocdModel = new JSONModel(Cocd.value);
			this.getView().setModel(CocdModel, "CocdModel");	
			
			const BPcreate = await $.ajax({
				type: "get",
				url: "/bpservice/PayTerm"
			});

			let PayTermModel = new JSONModel(BPcreate.value);
			this.getView().setModel(PayTermModel, "PayTermModel");
		},

		onMyRoutePatternMatched: function(oEvent) {
			let CreateNum = oEvent.getParameter("arguments").num;
			this._createNum = CreateNum;
			let now = new Date();
			let Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0') + "-"
				+ now.getDate().toString().padStart(2, '0');
			this._todayDate = Today;
			
			console.log(this._createNum);
			console.log(this._todayDate);
			this.setDefaultValue();
		},

		setDefaultValue: function() {
			this.getView().byId("BP_number").setText(this._createNum);
			this.getView().byId("BP_createdate1").setText(this._todayDate);
			this.getView().byId("BP_createdate2").setText(this._todayDate);
		},

		onSetWizardModel: function() {
            var oData = {
                BP_category : ""
            }
            let wizardModel = new JSONModel(oData);
            this.getView().setModel(wizardModel,"wizardModel");
		},

		onCreate: async function () {
			// let temp = new JSONModel(this.temp).oData;
			let temp = {};
			temp.BP_number = this._createNum;
			temp.BP_createdate = this._todayDate;
			temp.BP_category = this.getView().getModel("wizardModel").getProperty("/BP_category");
			temp.BP_name = this.getView().getModel("wizardModel").getProperty("/BP_name");
			temp.BP_title = this.getView().getModel("wizardModel").getProperty("/BP_title");
			temp.BP_street = this.getView().getModel("wizardModel").getProperty("/BP_street");
			temp.BP_house = this.getView().getModel("wizardModel").getProperty("/BP_house");
			temp.BP_zipcode = this.getView().getModel("wizardModel").getProperty("/BP_zipcode");
			temp.BP_city = this.getView().getModel("wizardModel").getProperty("/BP_city");
			temp.BP_country = this.getView().getModel("wizardModel").getProperty("/BP_country");
			temp.BP_language = this.getView().getModel("wizardModel").getProperty("/BP_language");
			temp.BP_cocd = this.getView().getModel("wizardModel").getProperty("/BP_cocd");
			temp.BP_payterm = this.getView().getModel("wizardModel").getProperty("/BP_payterm");
			temp.BP_manager = this.getView().getModel("wizardModel").getProperty("/BP_manager");
			temp.BP_estdate = this.getView().getModel("wizardModel").getProperty("/BP_estdate");
			temp.BP_tin = this.getView().getModel("wizardModel").getProperty("/BP_tin");
			temp.BP_industry = this.getView().getModel("wizardModel").getProperty("/BP_industry");
			temp.BP_phone = this.getView().getModel("wizardModel").getProperty("/BP_phone");
			temp.BP_fax = this.getView().getModel("wizardModel").getProperty("/BP_fax");
			temp.BP_email = this.getView().getModel("wizardModel").getProperty("/BP_email");
			temp.BP_website = this.getView().getModel("wizardModel").getProperty("/BP_website");


			await $.ajax({
				type: "POST",
				url: "/bpservice/BP",
				contentType: "application/json;IEEE754Compatible=true",
				data: JSON.stringify(temp)
			});

		},

        goToGeneralStep: function () {
			var selectedKey = this.byId("categorySelection").getSelectedKey();

			switch (selectedKey) {
				case "개인":
					this.byId("BPcategoryStep").setNextStep(this.getView().byId("PerGeneralStep"));
					break;
				case "조직":
				default:
					this.byId("BPcategoryStep").setNextStep(this.getView().byId("OrgGeneralStep"));
					break;
			}
		},

        // 범주를 변경했을 때 나타나는 창
		setCategory: function () {
			this.setDiscardableProperty({
				message: "카테고리를 변경하시겠습니까?",
				discardStep: this.byId("BPcategoryStep"),
			});
		},

		setDiscardableProperty: function (params) {
			if (this._wizard.getProgressStep() !== params.discardStep) {
				MessageBox.warning(params.message, {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {  // 클릭 : 예 wizardModel>/BP_category
							this._wizard.discardProgress(params.discardStep);
							this.onSetWizardModel();
							this.setDefaultValue();
						} else { // 클릭 : 아니오 wizardModel>/BP_category
						}
					}.bind(this)
				});
			} else {
				return
			}
		},
		
		handleWizardCancel: function() {
			this._handleMessageBoxOpen_Cancel("생성을 취소하시겠습니까?", "warning");
		},
		handleWizardBack: function() {
			this._handleMessageBoxOpen_Back("조회 화면으로 이동하시겠습니까?", "warning");
		},
		handleWizardSubmit: function () {
			this._handleMessageBoxOpen_Submit("생성하시겠습니까?", "confirm");
		},
		_handleMessageBoxOpen_Submit: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
						this.onCreate();
						this.onSetWizardModel();
						this.navBackToMain();
					}
				}.bind(this)
			}); // Submit 클릭하고 Yes 누르면 생성 데이터 저장까지 하게 설정
		},
		_handleMessageBoxOpen_Cancel: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
						this.onSetWizardModel();
						this.setDefaultValue();
						this._navBackToList();
					}
				}.bind(this)
			});
		},
		_handleMessageBoxOpen_Back: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
						this.onSetWizardModel();
						this.navBackToMain();
					}
				}.bind(this)
			});
		},

		completedHandler: function () {
			this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
		},
		
		navBackToMain: function () {
			this._navBackToStep(this.byId("BPcategoryStep"));
			this.getOwnerComponent().getRouter().navTo("BPmain");
		},
		_navBackToList: function () {
			this._navBackToStep(this.byId("BPcategoryStep"));
		},
		_navBackToPerGeneralStep: function () {
			this._navBackToStep(this.byId("PerGeneralStep"));
		},
		_navBackToOrgGeneralStep: function () {
			this._navBackToStep(this.byId("OrgGeneralStep"));
		},
		_navBackToStandardStep: function () {
			this._navBackToStep(this.byId("StandardStep"));
		},
		_navBackToCompanyStep: function () {
			this._navBackToStep(this.byId("CompanyStep"));
		},
		_navBackToStep: function (step) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(step);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this._oNavContainer.to(this._oWizardContentPage);
		},

		// 필수 입력란 제어하는 코드
		checkPerGeneralStep: function () {
			var firstName = this.getView().getModel("wizardModel").getProperty("/BP_name") || "";
			var title = this.getView().getModel("wizardModel").getProperty("/BP_title") || "";
			if (firstName.length == 0 || title.length ==0) {
				this._wizard.invalidateStep(this.byId("PerGeneralStep"));
			} else {
				this._wizard.validateStep(this.byId("PerGeneralStep"));
			}
		},
		checkOrgGeneralStep: function () {
			var comName = this.getView().getModel("wizardModel").getProperty("/BP_name") || "";
			if (comName.length == 0) {
				this._wizard.invalidateStep(this.byId("OrgGeneralStep"));
			} else {
				this._wizard.validateStep(this.byId("OrgGeneralStep"));
			}
		},
		checkStandardStep: function () {
			var BP_street = this.getView().getModel("wizardModel").getProperty("/BP_street") || "";
			var BP_house = this.getView().getModel("wizardModel").getProperty("/BP_house") || "";
			var BP_zipcode = this.getView().getModel("wizardModel").getProperty("/BP_zipcode") || "";
			var BP_city = this.getView().getModel("wizardModel").getProperty("/BP_city") || "";
			var BP_country = this.getView().getModel("wizardModel").getProperty("/BP_country") || "";
			var BP_language = this.getView().getModel("wizardModel").getProperty("/BP_language") || "";
			
			if (BP_street.length == 0 || BP_house.length == 0 || BP_zipcode.length == 0 || BP_city.length == 0 ||
				BP_country.length == 0 || BP_language.length == 0) {
				this._wizard.invalidateStep(this.byId("StandardStep"));
			} else {
				this._wizard.validateStep(this.byId("StandardStep"));
			}
		},
		checkCompanyStep: function () {
			var BP_cocd = this.getView().getModel("wizardModel").getProperty("/BP_cocd") || "";
			var BP_payterm = this.getView().getModel("wizardModel").getProperty("/BP_payterm") || "";
			var BP_manager = this.getView().getModel("wizardModel").getProperty("/BP_manager") || "";
			var BP_estdate = this.getView().getModel("wizardModel").getProperty("/BP_estdate") || "";
			var BP_tin = this.getView().getModel("wizardModel").getProperty("/BP_tin") || "";
			var BP_industry = this.getView().getModel("wizardModel").getProperty("/BP_industry") || "";
			var BP_phone = this.getView().getModel("wizardModel").getProperty("/BP_phone") || "";
			var BP_fax = this.getView().getModel("wizardModel").getProperty("/BP_fax") || "";
			var BP_email = this.getView().getModel("wizardModel").getProperty("/BP_email") || "";
			var BP_website = this.getView().getModel("wizardModel").getProperty("/BP_website") || "";
			
			if (BP_cocd.length == 0 || BP_payterm.length == 0 || BP_manager.length == 0 || BP_estdate.length == 0 ||
				BP_tin.length == 0 || BP_industry.length == 0 || BP_phone.length == 0 || BP_fax.length == 0
				|| BP_email.length == 0 || BP_website.length == 0) {
				this._wizard.invalidateStep(this.byId("CompanyStep"));
			} else {
				this._wizard.validateStep(this.byId("CompanyStep"));
			}
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
        this._pValueHelpDialog.then(function (oValueHelpDialog) {
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