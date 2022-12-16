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
        onBP : function(){
          this.getOwnerComponent().getRouter().navTo("BP")
        },

        onGL : function(){
          this.getOwnerComponent().getRouter().navTo("GL")
        },

        onDoc : function(){
          this.getOwnerComponent().getRouter().navTo("Doc")
        }

        }
      );
    }
  );
  