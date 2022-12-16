sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project1.controller.Home", {

        onBP_list: function () {
            this.getOwnerComponent().getRouter().navTo("BP");
        },
        onGL_list: function () {
            this.getOwnerComponent().getRouter().navTo("GL");
        },
        onDoc_list: function () {
            this.getOwnerComponent().getRouter().navTo("Doc");
        }
    });
});