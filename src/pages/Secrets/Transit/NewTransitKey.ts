import { Margin } from "../../../elements/Margin";
import { Option } from "../../../elements/Option";
import { Page } from "../../../types/Page";
import { SecretTitleElement } from "../SecretTitleElement";
import { makeElement } from "z-makeelement";
import { newTransitKey } from "../../../api/transit/newTransitKey";
import { setErrorText } from "../../../pageUtils";
import i18next from "i18next";

export class NewTransitKeyPage extends Page {
  constructor() {
    super();
  }
  async render(): Promise<void> {
    const newTransitKeyForm = makeElement({
      tag: "form",
      children: [
        Margin(
          makeElement({
            tag: "input",
            class: ["uk-input", "uk-form-width-medium"],
            attributes: {
              required: "true",
              type: "text",
              placeholder: i18next.t("transit_new_key_name_input"),
              name: "name",
            },
          }),
        ),
        Margin(
          makeElement({
            tag: "select",
            class: ["uk-select", "uk-form-width-medium"],
            attributes: {
              name: "type",
            },
            children: [
              "aes128-gcm96",
              "aes256-gcm96",
              "chacha20-poly1305",
              "ed25519",
              "ecdsa-p256",
              "ecdsa-p384",
              "ecdsa-p521",
              "rsa-2048",
              "rsa-3072",
              "rsa-4096",
            ].map((type): HTMLElement => Option(type, type)),
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
          text: i18next.t("transit_new_key_create_btn"),
          attributes: {
            type: "submit",
          },
        }),
      ],
    }) as HTMLFormElement;

    await this.router.setPageContent(newTransitKeyForm);

    newTransitKeyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(newTransitKeyForm);

      const name = formData.get("name") as string;
      const type = formData.get("type") as string;

      try {
        await newTransitKey(this.state.currentBaseMount, {
          name: name,
          type: type,
        });
        this.state.currentSecret = name;
        await this.router.changePage("TRANSIT_VIEW_SECRET");
      } catch (e) {
        const error = e as Error;
        setErrorText(error.message);
      }
    });
  }

  async getPageTitle(): Promise<Element | string> {
    return await SecretTitleElement(this.router, i18next.t("transit_new_key_suffix"));
  }

  get name(): string {
    return i18next.t("transit_new_key_title");
  }
}
