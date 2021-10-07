sap.ui.define([
    "dexco/ui5products/controller/BaseController",
    "sap/m/MessageBox",
    'sap/ui/core/Core',
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Element',
    "dexco/ui5products/model/models"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (BaseController, MessageBox, Core, MessagePopover, MessageItem, Message, library, Element, models) {
        "use strict";

        var MessageType = library.MessageType;

        return BaseController.extend("dexco.ui5products.controller.Detail", {
            onInit: function () {
                this.attachRoute("ToDetail", this.onRouteMatched);
                this.attachRoute("ToDetailCreate", this.onRouteMatched);

                this.oView = this.getView();
                this._MessageManager = Core.getMessageManager();

                this._MessageManager.removeAllMessages();
                this._MessageManager.registerObject(this.oView.byId("pageDetail"), true);
                this.oView.setModel(this._MessageManager.getMessageModel(), "message");

                this.createMessagePopover();
            },

            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },

            createMessagePopover: function () {
                var that = this;

                this.oMP = new MessagePopover({
                    activeTitlePress: function (oEvent) {
                        var oItem = oEvent.getParameter("item"),
                            oPage = that.byId("pageDetail"),
                            oMessage = oItem.getBindingContext("message").getObject(),
                            oControl = Element.registry.get(oMessage.getControlId());

                        if (oControl) {
                            oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
                            setTimeout(function () {
                                oControl.focus();
                            }, 300);
                        }
                    },
                    items: {
                        path: "message>/",
                        template: new MessageItem(
                            {
                                title: "{message>message}",
                                subtitle: "{message>additionalText}",
                                groupName: { parts: [{ path: 'message>controlIds' }], formatter: this.getGroupName },
                                activeTitle: { parts: [{ path: 'message>controlIds' }], formatter: this.isPositionable },
                                type: "{message>type}",
                                description: "{message>message}"
                            })
                    },
                    groupItems: true
                });

                this.getView().byId("btnMP").addDependent(this.oMP);
            },

            getGroupName: function (sControlId) {
                return this.getText("{i18n>txtRequiredFields}");
            },

            isPositionable: function (sControlId) {
                return sControlId ? true : true;
            },

            handleRequiredField: function (oInput) {
                var sTarget = oInput.getBindingContext().getPath() + "/" + oInput.getBindingPath("value");

                this.removeMessageFromTarget(sTarget);

                if (!oInput.getValue()) {
                    this._MessageManager.addMessages(
                        new Message({
                            message: "A mandatory field is required",
                            type: MessageType.Error,
                            additionalText: oInput.getLabels()[0].getText(),
                            target: sTarget,
                            processor: this.getView().getModel()
                        })
                    );
                }
            },

            onChange: function (oEvent) {
                var oInput = oEvent.getSource();

                if (oInput.getRequired()) {
                    this.handleRequiredField(oInput);
                }
            },

            removeMessageFromTarget: function (sTarget) {
                this._MessageManager.getMessageModel().getData().forEach(function (oMessage) {
                    if (oMessage.target === sTarget) {
                        this._MessageManager.removeMessages(oMessage);
                    }
                }.bind(this));
            },

            buttonTypeFormatter: function () {
                var sHighestSeverity;
                var aMessages = this._MessageManager.getMessageModel().oData;
                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sHighestSeverity = "Negative";
                            break;
                        case "Warning":
                            sHighestSeverity = sHighestSeverity !== "Negative" ? "Critical" : sHighestSeverity;
                            break;
                        case "Success":
                            sHighestSeverity = sHighestSeverity !== "Negative" && sHighestSeverity !== "Critical" ? "Success" : sHighestSeverity;
                            break;
                        default:
                            sHighestSeverity = !sHighestSeverity ? "Neutral" : sHighestSeverity;
                            break;
                    }
                });

                return sHighestSeverity;
            },

            highestSeverityMessages: function () {
                var sHighestSeverityIconType = this.buttonTypeFormatter();
                var sHighestSeverityMessageType;

                switch (sHighestSeverityIconType) {
                    case "Negative":
                        sHighestSeverityMessageType = "Error";
                        break;
                    case "Critical":
                        sHighestSeverityMessageType = "Warning";
                        break;
                    case "Success":
                        sHighestSeverityMessageType = "Success";
                        break;
                    default:
                        sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
                        break;
                }

                return this._MessageManager.getMessageModel().oData.reduce(function (iNumberOfMessages, oMessageItem) {
                    return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
                }, 0) || "";
            },

            buttonIconFormatter: function () {
                var sIcon;
                var aMessages = this._MessageManager.getMessageModel().oData;

                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sIcon = "sap-icon://error";
                            break;
                        case "Warning":
                            sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
                            break;
                        case "Success":
                            sIcon = "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
                            break;
                        default:
                            sIcon = !sIcon ? "sap-icon://information" : sIcon;
                            break;
                    }
                });

                return sIcon;
            },

            onRouteMatched: function (oEvent) {
                var oArguments = oEvent.getParameter("arguments"),
                    sRoute = oEvent.getParameter("name"),
                    oPage = this.byId("pageDetail"),
                    oControlModel = this.getView().getModel("control"),
                    oControlData = oControlModel.getData();

                if (sRoute === "ToDetail") {
                    var oComponentModel = this.getOwnerComponent().getModel();
                    this.getView().setModel(oComponentModel);
                    oPage.bindElement(`/Products(${oArguments.ProductID})`);
                    oControlData.Enabled = false;
                    oControlData.ShowEdit = true;
                    oControlData.ShowFooter = false;
                    oControlData.Operation = "display";

                } else if (sRoute === "ToDetailCreate") {
                    var oModel = new sap.ui.model.json.JSONModel({
                        ProductID: null,
                        ProductName: "",
                        SupplierID: null,
                        CategoryID: null,
                        QuantityPerUnit: null,
                        UnitPrice: null,
                        UnitsInStock: null,
                        UnitsOnOrder: null,
                        ReorderLevel: null,
                        Discontinued: false
                    });
                    this.getView().setModel(oModel);
                    oPage.bindElement("/");
                    oControlData.Enabled = true;
                    oControlData.ShowEdit = false;
                    oControlData.ShowFooter = true;
                    oControlData.Operation = "create";
                }

                oControlModel.setData(oControlData);
                this.getView().setModel(oControlModel, "control");
            },

            onEdit: function (oEvent) {
                var oModel = this.getView().getModel("control"),
                    oData = oModel.getData();

                oData.Enabled = !oData.Enabled;
                oData.ShowFooter = !oData.ShowFooter;
                oData.Operation = oData.Enabled ? "edit" : "display";

                oModel.setData(oData);
            },

            getModulePath: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                return jQuery.sap.getModulePath(appPath);
            },

            onSave: function (oEvent) {
                var sToken = models.fetchToken(this.getModulePath()),
                    oObject = this.byId("pageDetail").getBindingContext().getObject();

                if (sToken) {
                    models.raiseWorkflow(this.getModulePath(), sToken, "dexco.productsworkflow", oObject)
                        .then((oData) => {
                            MessageBox.success(this.getText("txtNewWorkflow"), {
                                onClose: () => {
                                    this.getRouter().navTo("ToList");
                                }
                            });
                        })
                        .catch((sError) => {
                            MessageBox.error(sError);
                        });
                } else {
                    MessageBox.error(this.getText("txtTokenError"));
                }
            },

            onCancel: function (oEvent) {
                sap.m.MessageBox.confirm(this.getText("txtConfirmCancel"), {
                    title: this.getText("titleConfirmCancel"),
                    onClose: (oAction) => {
                        if (oAction === sap.m.MessageBox.Action.YES) {
                            var oModel = this.getView().getModel("control"),
                                oData = oModel.getData();

                            switch (oData.Operation) {
                                case "edit":
                                    oData.Enabled = !oData.Enabled;
                                    oData.ShowFooter = !oData.ShowFooter;
                                    oData.Operation = oData.Enabled ? "edit" : "display";

                                    oModel.setData(oData);
                                    break;
                                case "create":
                                    this.getRouter().navTo("ToList");
                                    break;
                            }
                        }
                    },
                    actions: [sap.m.MessageBox.Action.YES,
                    sap.m.MessageBox.Action.NO]
                });
            },

            onSupplierValueHelp: function (oEvent) {
                if (!this._oDialog) {
                    this._oDialog = new sap.ui.xmlfragment("dexco.ui5products.fragment.Supplier", this);
                    this.getView().addDependent(this._oDialog);
                }

                this._oDialog.open();
            },

            onSearchSupplier: function (oEvent) {
                var sValue = oEvent.getParameter("value"),
                    oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: "CompanyName",
                                operator: sap.ui.model.FilterOperator.Contains,
                                value1: sValue
                            })
                        ],
                        and: false
                    });

                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            onConfirmSupplier: function (oEvent) {
                var aContext = oEvent.getParameter("selectedContexts"),
                    oModel = this.getView().getModel(),
                    oPage = this.byId("pageDetail");

                if (aContext && aContext.length) {
                    var oObject = aContext[0].getObject();

                    oModel.setProperty(oPage.getBindingContext().getPath() + "/SupplierID", oObject.SupplierID);
                    oModel.setProperty(oPage.getBindingContext().getPath() + "/CompanyName", oObject.CompanyName);
                }

                oEvent.getSource().getBinding("items").filter([]);
            },

            onCancelSupplier: function (oEvent) {
                oEvent.getSource().getBinding("items").filter([]);
            }
        });
    });
