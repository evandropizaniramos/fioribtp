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
            }
            
		});
	});
