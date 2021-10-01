sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("dexco.ui5products.controller.BaseController", {

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            attachRoute: function (sRoute, fRouteMatched) {
                this.getRouter().getRoute(sRoute).attachPatternMatched(fRouteMatched, this);
            },

            getText: function (sText, aArgs) {
                var oModel = this.getOwnerComponent().getModel("i18n");

                if (!oModel) {
                    oModel = new sap.ui.model.resource.ResourceModel({
                        bundleName: "dexco.ui5products.i18n.i18n"
                    });

                    this.getOwnerComponent().setModel(oModel, "i18n");
                }

                return oModel.getResourceBundle().getText(sText, aArgs);
            }
            
		});
	});
