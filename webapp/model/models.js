sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {

        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        fetchToken: function (sPrefix) {
            var sToken;
            jQuery.ajax({
                url: sPrefix + "/bpmworkflowruntime/v1/xsrf-token",
                method: "GET",
                async: false,
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: (result, xhr, data) => {
                    sToken = data.getResponseHeader("X-CSRF-Token");
                },
                error: (data) => {
                    sToken = "";
                }
            });

            return sToken;
        },

        raiseWorkflow: function (sPrefix, sToken, sDefinitionId, oContext) {
            return new Promise((fResolve, fReject) => {
                jQuery.ajax({
                    url: sPrefix + "/bpmworkflowruntime/v1/workflow-instances",
                    type: "POST",
                    data: JSON.stringify({
                        definitionId: sDefinitionId,
                        context: oContext
                    }),
                    headers: {
                        "X-CSRF-Token": sToken,
                        "Content-Type": "application/json"
                    },
                    async: true,
                    success: (result, xhr, data) => {
                        fResolve({
                            Result: result,
                            Xhr: xhr,
                            Data: data
                        })
                    },
                    error: (data) => {
                        fReject(data.responseText);
                    }
                });
            });
        }
    };
});