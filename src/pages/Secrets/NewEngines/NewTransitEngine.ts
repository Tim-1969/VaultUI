import { Form } from "../../../elements/Form";
import { Margin } from "../../../elements/Margin";
import { Page } from "../../../types/Page";
import { makeElement } from "z-makeelement";
import { newMount } from "../../../api/sys/newMount";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class NewTransitEnginePage extends Page {
  constructor() {
    super();
  }
  async goBack(): Promise<void> {
    await this.router.changePage("SECRETS_HOME");
  }
  async render(): Promise<void> {
    await this.router.setPageContent(
      Form(
        [
          Margin(
            makeElement({
              tag: "input",
              class: ["uk-input", "uk-form-width-medium"],
              attributes: {
                required: "true",
                type: "text",
                placeholder: i18next.t("new_transit_engine_name_input"),
                name: "name",
              },
            }),
          ),
          makeElement({
            tag: "p",
            id: "errorText",
            class: "uk-text-danger",
          }),
          makeElement({
            tag: "button",
            class: ["uk-button", "uk-button-primary"],
            text: i18next.t("new_transit_engine_create_btn"),
            attributes: {
              type: "submit",
            },
          }),
        ],
        async (form: HTMLFormElement) => {
          const formData = new FormData(form);

          const name = formData.get("name") as string;

          try {
            await newMount({
              name: name,
              type: "transit",
            });
            this.state.secretMountType = "transit";
            this.state.baseMount = name + "/";
            await this.router.changePage("TRANSIT_VIEW");
          } catch (e) {
            const error = e as Error;
            setErrorText(error.message);
          }
        },
      ),
    );
  }
  get name(): string {
    return i18next.t("new_transit_engine_title");
  }
}
