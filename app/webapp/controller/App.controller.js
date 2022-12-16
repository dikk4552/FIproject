sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onHome : function(){
          this.getOwnerComponent().getRouter().navTo("Home")
        },
        onMenuGL : function() {
          this.getOwnerComponent().getRouter().navTo("GL")
        }
        }
      );
    }
  );
  