sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },
        toRequest : function (){
          this.getOwnerComponent().getRouter().navTo("Request");
        },
        toCompany : function (){
          this.getOwnerComponent().getRouter().navTo("GridCompany");
        },
        toMaterial : function(){
          this.getOwnerComponent().getRouter().navTo("GridMaterial");

        }
      });
    }
  );
  