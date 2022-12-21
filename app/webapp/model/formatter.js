sap.ui.define([],function(){
    "use strict";
    return {
        numberWithCommas: function(x) {
            return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    };
});