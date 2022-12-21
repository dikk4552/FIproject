sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {

        onHome : function(){
          this.getOwnerComponent().getRouter().navTo("Home");
        },
        onBPmain : function() {
          this.getOwnerComponent().getRouter().navTo("BP");
        },
        onDocmain : function() {
          this.getOwnerComponent().getRouter().navTo("Doc");
        },

        onGL : function(){
          this.getOwnerComponent().getRouter().navTo("GL");
        }
      

        }
      );
    }
  );
  