module.exports = {
  // The localised name for the language
  "language_name": "English",

  // These are the buttons on the top bar.
  "home_btn": "Home",
  "back_btn": "Back",
  "refresh_btn": "Refresh",
  "me_btn": "Me/Settings",

  // General Notification Messages
  "notification_copy_success": "Copied to clipboard.",

  // Copyable Modal
  "copy_modal_download_btn": "Download",
  "copy_modal_copy_btn": "Copy",
  "copy_modal_close_btn": "Close",

  // Copyable Input Box
  "copy_input_box_copy_icon_text": "Copy Button",

  // Me Page
  "me_page_title": "Me/Settings",
  "log_out_btn": "Log Out",
  "seal_vault_btn": "Seal Vault",
  "copy_token_btn": "Copy Token",
  "renew_lease_btn": "Renew Token Lease",
  "change_language_btn": "Change Language",

  // Home Page
  "home_page_title": "Home",
  "vaulturl_text": "Vault URL: {{text}}",
  "password_generator_btn": "Password Generator",
  "your_token_expires_in": "Your token expires in {{date, until_date}}",

  // Unseal Page
  "unseal_vault_text": "Unseal the Vault",
  "submit_key_btn": "Submit Key",
  "unseal_input_btn": "Switch to Manual Key Input",
  "unseal_qr_btn": "Switch to QR Key Input",
  "key_input_placeholder": "Key",
  "unseal_keys_progress": "Keys: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  "set_language_title": "Set Language",
  "set_language_btn": "Set Language",

  // Password Generator Page
  "password_generator_title": "Password Generator",
  "gen_password_btn": "Generate Password",

  // Login Page
  "log_in_title": "Login",
  "log_in_with_token": "Token",
  "log_in_with_username": "Username",
  "token_input": "Token",
  "username_input": "Username",
  "password_input": "Password",
  "log_in_btn": "Login",

  // Key Value Delete Page
  "kv_delete_title": "K/V Delete",
  "kv_delete_text": "Are you sure you want to delete this?",
  "kv_delete_btn": "Delete",
  "kv_delete_suffix": " (delete)",

  // Key Value New Page
  "kv_new_title": "K/V New",
  "kv_new_suffix": " (new)",
  "kv_new_path": "Relative Path",
  "kv_new_create_btn": "Create Empty Secret",

  // Key Value Secret Page
  "kv_secret_title": "K/V Secret",
  "kv_secret_deleted_text": "This secret version has been soft deleted but remains restorable, do you want to restore it?",
  "kv_secret_restore_btn": "Restore Secret Version",
  "kv_secret_loading": "Loading Secret..",
  "kv_secret_delete_btn": "Delete",
  "kv_secret_delete_all_btn": "Delete All Versions",
  "kv_secret_delete_version_btn": "Delete Version {{ version }}",
  "kv_secret_edit_btn": "Edit",
  "kv_secret_versions_btn": "Versions",

  // Key Value Secret Editor Page
  "kv_sec_edit_title": "K/V Edit",
  "kv_sec_edit_btn": "Edit",
  "kv_sec_edit_loading": "Loading Editor..",
  "kv_sec_edit_invalid_json_err": "Invalid JSON",
  "kv_sec_edit_suffix": " (edit)",

  // Key Value Secret Versions Page
  "kv_sec_versions_title": "K/V Versions",
  "kv_sec_versions_suffix": " (edit)",

  // Key Value View/List Secrets Page
  "kv_view_title": "K/V View",
  "kv_view_cubbyhole_text": "In cubbyhole, secrets can be stored as long as the lease of your token is valid. They will be deleted when lease is expired and can only be viewed by your current token.",
  "kv_view_new_btn": "New",
  "kv_view_none_here_text": "You seem to have no secrets here, would you like to create one?",

  // TOTP View Page
  "totp_view_title": "TOTP",
  "totp_view_new_btn": "Add new TOTP key",
  "totp_view_loading": "Loading TOTP Codes..",
  "totp_view_empty": "You seem to have no TOTP codes here, would you like to create one?",
  "totp_view_loading_box": "Loading..",

  // New TOTP Key Page
  "totp_new_title": "New TOTP Key",
  "totp_new_suffix": " (new)",
  "totp_new_name_text": "TOTP Key Name",
  "totp_new_info": "You need either a key or a URI, URI prefered but may not work. Just scan the QR code and copy the URL.",
  "totp_new_uri_input": "URI",
  "totp_new_key_input": "Key",
  "totp_new_add_btn": "Add TOTP Key",

  // Transit View Page
  "transit_view_title": "Transit View",
  "transit_view_none_here_text": "You seem to have no transit keys here, would you like to create one?",

  // Transit View Secret Page
  "transit_view_secret_title": "Transit Secret View",
  "transit_view_encrypt_text": "Encrypt",
  "transit_view_encrypt_icon_text": "Encryption Icon",
  "transit_view_encrypt_description": "Encrypt some plaintext or base64 encoded binary.",
  "transit_view_decrypt_text": "Decrypt",
  "transit_view_decrypt_description": "Decrypt some cyphertext.",
  "transit_view_decrypt_icon_text": "Decryption Icon",

  // Transit Encrypt Page
  "transit_encrypt_title": "Transit Encrypt",
  "transit_encrypt_suffix": " (encrypt)",
  "transit_encrypt_input_placeholder": "Plaintext or base64",
  "transit_encrypt_already_encoded_checkbox": "Is the data already encoded in base64?",
  "transit_encrypt_encrypt_btn": "Encrypt",
  "transit_encrypt_encryption_result_modal_title": "Encryption Result",

  // Transit decrypt Page
  "transit_decrypt_title": "Transit Decrypt",
  "transit_decrypt_suffix": " (decrypt)",
  "transit_decrypt_input_placeholder": "Cyphertext",
  "transit_decrypt_decode_checkbox": "Should the plaintext be base64 decoded?",
  "transit_decrypt_decrypt_btn": "Decrypt",
  "transit_decrypt_decryption_result_modal_title": "Decryption Result",
}