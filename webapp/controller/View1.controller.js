sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/library",
    "sap/tnt/library",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent",
  ],
  function (
    Device,
    Controller,
    JSONModel,
    Popover,
    Button,
    Dialog,
    Text,
    library,
    tntLibrary,
    ChartContainer,
    ChartContainerContent
  ) {
    "use strict";

    var ButtonType = library.ButtonType,
      PlacementType = library.PlacementType,
      NavigationListItemDesign = tntLibrary.NavigationListItemDesign;

    return Controller.extend("project1.controller.View1", {
      onInit: function () {
        var oSideBar = new sap.ui.model.json.JSONModel(
          sap.ui.require.toUrl("project1/model/data.json")
        );

        this.getView().setModel(oSideBar, "jsonModel");
        // this.getView().setModel(oSideBar);

        this._setToggleButtonTooltip(!Device.system.desktop);
        // console.log(this.getView());

        var oView = this.getView();

        this.adjustMyChartBox(oView, "idVizFrame1", "idCell1");
        this.adjustMyChartBox(oView, "idVizFrame2", "idCell2");
      },

      adjustMyChartBox: function (oView, sChartId, sBlockId) {
        var oVizFrame = oView.byId(sChartId);
        var oChartContainerContent = new ChartContainerContent({
          content: [oVizFrame],
        });
        var oChartContainer = new ChartContainer({
          content: [oChartContainerContent],
        });

        oChartContainer.setShowFullScreen(true);
        oChartContainer.setAutoAdjustHeight(true);
        oView.byId(sBlockId).addContent(oChartContainer);
      },

      onItemSelect: function (oEvent) {
        var oItem = oEvent.getParameter("item");
        this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
      },
      handleUserNamePress: function (event) {
        var oPopover = new Popover({
          showHeader: false,
          placement: PlacementType.Bottom,
          content: [
            new Button({
              text: "Feedback",
              type: ButtonType.Transparent,
            }),
            new Button({
              text: "Help",
              type: ButtonType.Transparent,
            }),
            new Button({
              text: "Logout",
              type: ButtonType.Transparent,
            }),
          ],
        }).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

        oPopover.openBy(event.getSource());
      },

      onSideNavButtonPress: function () {
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();

        this._setToggleButtonTooltip(bSideExpanded);

        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },

      onQuickActionPress: function (oEvent) {
        if (oEvent.oSource.getDesign() !== NavigationListItemDesign.Action) {
          return;
        }
        if (!this.oDefaultDialog) {
          this.oDefaultDialog = new Dialog({
            title: "Create Item",
            type: "Message",
            content: new Text({ text: "Create New Navigation List Item" }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "Create",
              press: function () {
                this.oDefaultDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Cancel",
              press: function () {
                this.oDefaultDialog.close();
              }.bind(this),
            }),
          });

          // to get access to the controller's model
          this.getView().addDependent(this.oDefaultDialog);
        }

        this.oDefaultDialog.open();
      },

      _setToggleButtonTooltip: function (bLarge) {
        var oToggleButton = this.byId("sideNavigationToggleButton");
        if (bLarge) {
          oToggleButton.setTooltip("Large Size Navigation");
        } else {
          oToggleButton.setTooltip("Small Size Navigation");
        }
      },
    });
  }
);
