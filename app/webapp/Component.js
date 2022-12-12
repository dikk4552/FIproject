/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
// 앱 설정 유지 기능

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "project1/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                //구성요소가 인스턴스화 될 때 SAPUI5에 의해 자동으로 시작
                // 구성요소의 메타데이터 섹션에서 설명자 파일에 대한 참조 정의
                // !init 함수 재정의 시 구성요소의 init 함수 호출 -> 나중에 라우터 초기화

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);