import { JSX } from "preact";
import i18next from "i18next";

export type FileUploadInputProps = {
  name: string;
};

export function FileUploadInput(props: FileUploadInputProps): JSX.Element {
  return (
    <div uk-form-custom="target: true">
      <a class="uk-form-icon" uk-icon="icon: upload" role="img" />
      <input name={props.name} type="file" />
      <input
        class="uk-input uk-form-width-medium"
        type="text"
        placeholder={i18next.t("file_upload_input_btn")}
      />
    </div>
  );
}
