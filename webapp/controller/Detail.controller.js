sap.ui.define([
	"dexco/ui5products/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController) {
		"use strict";

		return BaseController.extend("dexco.ui5products.controller.Detail", {
			onInit: function () {
                this.attachRoute("ToDetail", this.onRouteMatched);
            },
            
            onRouteMatched: function (oEvent) {
                var oArguments = oEvent.getParameter("arguments"),
                    oPage = this.byId("pageDetail");
                
                oPage.bindElement(`/Products(${oArguments.ProductID})`);
            },

            onEdit: function (oEvent) {
                var oModel = this.getView().getModel("control"),
                oData = oModel.getData();
                
                oData.Enabled = !oData.Enabled;

                oModel.setData(oData);
            }
		});
	});
