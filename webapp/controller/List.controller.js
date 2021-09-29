sap.ui.define([
	"dexco/ui5products/controller/BaseController"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController) {
		"use strict";

		return BaseController.extend("dexco.ui5products.controller.List", {
			onInit: function () {
                this.attachRoute("ToList", this.onRouteMatched);
            },

            onRouteMatched: function (oEvent) {
                
            },
            
            onListItemPress: function (oEvent) {
                var oSource = oEvent.getSource(),
                    oContext = oSource.getBindingContext(),
                    oObject = oContext.getObject();

                this.getRouter().navTo("ToDetail", {
                    ProductID: oObject.ProductID
                });
            }
		});
	});
