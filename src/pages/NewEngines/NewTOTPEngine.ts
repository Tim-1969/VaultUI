import { Margin } from "../../elements/Margin";
import { Page } from "../../PageSystem/Page";
import { makeElement } from "../../htmlUtils";
import { newMount } from "../../api/sys/newMount";
import { setErrorText } from "../../pageUtils";
import i18next from "i18next";

export class NewTOTPEnginePage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    const newEngineForm = makeElement({
      tag: "form",
      children: [
        Margin(
          makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "text",
              placeholder: i18next.t("new_totp_engine_name_input"),
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
          text: i18next.t("new_totp_engine_create_btn"),
          attributes: {
            type: "submit",
          },
        }),
      ],
    }) as HTMLFormElement;

    await this.router.setPageContent(newEngineForm);

    newEngineForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(newEngineForm);

      const name = formData.get("name") as string;

      try {
        await newMount({
          name: name,
          type: "totp",
        });
        this.state.currentMountType = "totp";
        this.state.currentBaseMount = name + "/";
        await this.router.changePage("TOTP");
      } catch (e) {
        const error = e as Error;
        setErrorText(error.message);
      }
    });
  }
  get name(): string {
    return i18next.t("new_totp_engine_title");
  }
}
