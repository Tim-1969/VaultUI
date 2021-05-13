import { Margin } from "../../elements/Margin";
import { Option } from "../../elements/Option";
import { Page } from "../../types/Page";
import { changePage, setErrorText, setPageContent } from "../../pageUtils";
import { makeElement } from "../../htmlUtils";
import { pageState } from "../../globalPageState";
import { reloadNavBar } from "../../elements/NavBar";
import i18next from "i18next";
import {newMount} from "../../api/sys/newMount";

export class NewKVEnginePage extends Page {
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
              placeholder: i18next.t("new_kv_engine_name_input"),
              name: "name",
            },
          }),
        ),
        Margin(
          makeElement({
            tag: "select",
            class: ["uk-select", "uk-form-width-medium"],
            attributes: {
              name: "version",
            },
            children: [
              Option(i18next.t("new_kv_engine_version_2"), "2"),
              Option(i18next.t("new_kv_engine_version_1"), "1"),
            ]
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
          text: i18next.t("new_kv_engine_create_btn"),
          attributes: {
            type: "submit",
          },
        }),
      ],
    }) as HTMLFormElement;

    setPageContent(newEngineForm);

    newEngineForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(newEngineForm);

      const name = formData.get("name") as string;
      const version = formData.get("version") as string;

      try {
        await newMount({
          name: name,
          type: "kv",
          options: {
            version: version
          }
        });
        pageState.currentMountType = "kv-v" + version;
        pageState.currentBaseMount = name + "/";
        await changePage("KEY_VALUE_VIEW");
      } catch (e) {
        const error = e as Error;
        setErrorText(error.message);
      }
    });
  }
  get name(): string {
    return i18next.t("new_kv_engine_title");
  }
}
