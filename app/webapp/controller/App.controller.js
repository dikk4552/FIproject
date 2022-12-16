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
<<<<<<< HEAD
        onBPmain : function() {
          this.getOwnerComponent().getRouter().navTo("BP");
        }        ,
        onDocmain : function() {
          this.getOwnerComponent().getRouter().navTo("Doc");
        }
=======
        onBP : function(){
          this.getOwnerComponent().getRouter().navTo("BP")
        },

        onGL : function(){
          this.getOwnerComponent().getRouter().navTo("GL")
        },
>>>>>>> master

        onDoc : function(){
          this.getOwnerComponent().getRouter().navTo("Doc")
          },
        onMenuGL : function() {
          this.getOwnerComponent().getRouter().navTo("GL")
        }
        }
      );
    }
  );
  