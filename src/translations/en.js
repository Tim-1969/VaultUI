module.exports = {
  // The localised name for the language
  language_name: "English",
  // Internal: The direction of text (ltr or rtl)
  language_direction: "ltr",

  // These are the buttons on the top bar.
  home_btn: "Home",
  back_btn: "Back",
  refresh_btn: "Refresh",
  me_btn: "Me/Settings",

  // General Notification Messages
  notification_copy_success: "Copied to clipboard.",
  not_implemented: "Not Yet Implemented",

  // Copyable Modal
  copy_modal_download_btn: "Download",
  copy_modal_copy_btn: "Copy",
  copy_modal_close_btn: "Close",

  // Generic Loading Text
  content_loading: "Loading..",

  // Copyable Input Box
  copy_input_box_copy_icon_text: "Copy Button",

  // File Upload Input
  file_upload_input_btn: "Upload File",

  // Me Page
  me_page_title: "Me/Settings",
  me_log_out_btn: "Log Out",
  me_seal_vault_btn: "Seal Vault",
  me_copy_token_btn: "Copy Token",
  me_renew_lease_btn: "Renew Token Lease",
  me_change_language_btn: "Change Language",

  // Home Page
  home_page_title: "Home",
  home_vaulturl_text: "Vault URL: {{text}}",
  home_password_generator_btn: "Password Generator",
  home_your_token_expires_in: "Your token expires in {{date, until_date}}",
  home_secrets_title: "Secrets",
  home_secrets_description: "View, create and manage secrets.",
  home_access_title: "Access",
  home_access_description: "Manage who and what has access to vault and how they can authenticate.",
  home_policies_title: "Policies",
  home_policies_description: "Manage policies and permissions.",

  // Secrets Home Page
  secrets_home_page_title: "Secrets",
  secrets_home_new_secrets_engine_button: "New Secrets Engine",

  // New Secrets Engine Page
  new_secrets_engine_title: "New Secrets Engine",
  new_secrets_engine_kv_title: "Key/Value",
  new_secrets_engine_kv_description: "For storing key/value mapped secrets.",
  new_secrets_engine_totp_title: "TOTP",
  new_secrets_engine_totp_description: "For handing Time-based One Time Pass (TOTP) codes.",
  new_secrets_engine_transit_title: "Transit",
  new_secrets_engine_transit_description:
    "For doing encryption/decryption without storing the data.",

  // New KV Engine Page
  new_kv_engine_title: "New Key/Value Engine",
  new_kv_engine_name_input: "Name",
  new_kv_engine_version_1: "Version 1",
  new_kv_engine_version_2: "Version 2",
  new_kv_engine_create_btn: "Create",

  // New KV Engine Page
  new_totp_engine_title: "New TOTP Engine",
  new_totp_engine_name_input: "Name",
  new_totp_engine_create_btn: "Create",

  // New Transit Engine Page
  new_transit_engine_title: "New Transit Engine",
  new_transit_engine_name_input: "Name",
  new_transit_engine_create_btn: "Create",

  // Unseal Page
  unseal_vault_text: "Unseal the Vault",
  unseal_submit_key_btn: "Submit Key",
  unseal_input_btn: "Switch to Manual Key Input",
  unseal_qr_btn: "Switch to QR Key Input",
  unseal_key_input_placeholder: "Key",
  unseal_keys_progress: "Keys: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  set_language_title: "Set Language",
  set_language_btn: "Set Language",

  // Password Generator Page
  password_generator_title: "Password Generator",
  password_generator_length_title: "Password Length ({{min}}/{{max}})",
  password_generator_generate_btn: "Generate Password",

  // Login Page
  log_in_title: "Login",
  log_in_with_token: "Token",
  log_in_with_username: "Username",
  log_in_token_input: "Token",
  log_in_username_input: "Username",
  log_in_password_input: "Password",
  log_in_btn: "Login",
  log_in_token_login_error: "Invalid Token",

  // Key Value Delete Page
  kv_delete_title: "K/V Delete",
  kv_delete_text: "Are you sure you want to delete this?",
  kv_delete_btn: "Delete",
  kv_delete_suffix: " (delete)",

  // Key Value New Page
  kv_new_title: "K/V New",
  kv_new_suffix: " (new)",
  kv_new_path: "Relative Path",
  kv_new_create_btn: "Create Empty Secret",

  // Key Value Secret Page
  kv_secret_title: "K/V Secret",
  kv_secret_deleted_text:
    "This secret version has been soft deleted but remains restorable, do you want to restore it?",
  kv_secret_restore_btn: "Restore Secret Version",
  kv_secret_loading: "Loading Secret..",
  kv_secret_delete_btn: "Delete",
  kv_secret_delete_all_btn: "Delete All Versions",
  kv_secret_delete_version_btn: "Delete Version {{ version }}",
  kv_secret_edit_btn: "Edit",
  kv_secret_versions_btn: "Versions",

  // Key Value Secret Editor Page
  kv_sec_edit_title: "K/V Edit",
  kv_sec_edit_btn: "Edit",
  kv_sec_edit_loading: "Loading Editor..",
  kv_sec_edit_invalid_json_err: "Invalid JSON",
  kv_sec_edit_suffix: " (edit)",

  // Key Value Secret Versions Page
  kv_sec_versions_title: "K/V Versions",
  kv_sec_versions_suffix: " (versions)",

  // Key Value View/List Secrets Page
  kv_view_title: "K/V View",
  kv_view_cubbyhole_text:
    "In cubbyhole, secrets can be stored as long as the lease of your token is valid. They will be deleted when lease is expired and can only be viewed by your current token.",
  kv_view_new_btn: "New",
  kv_view_none_here_text: "You seem to have no secrets here, would you like to create one?",

  // TOTP View Page
  totp_view_title: "TOTP",
  totp_view_new_btn: "New",
  totp_view_delete_btn: "Delete",
  totp_view_loading: "Loading TOTP Codes..",
  totp_view_empty: "You seem to have no TOTP codes here, would you like to create one?",
  totp_view_loading_box: "Loading..",

  // New TOTP Key Page
  totp_new_title: "New TOTP Key",
  totp_new_suffix: " (new)",
  totp_new_name_text: "TOTP Key Name",
  totp_new_info:
    "You need either a key or a URI, URI prefered but may not work. Just scan the QR code and copy the URL.",
  totp_new_uri_input: "URI",
  totp_new_key_input: "Key",
  totp_new_add_btn: "Add TOTP Key",
  totp_new_switch_to_qr_btn: "Switch to QR Input",
  totp_new_switch_back_to_manual_input_btn: "Switch back to manual input",

  // TOTP Delete Page
  totp_delete_title: "Delete TOTP Key",
  totp_delete_suffix: " (delete)",
  totp_delete_text: "Are you sure you want to delete this TOTP secret?",
  totp_delete_button: "Delete",

  // Transit View Page
  transit_view_title: "Transit View",
  transit_view_new_btn: "New",
  transit_view_none_here_text:
    "You seem to have no transit keys here, would you like to create one?",

  transit_new_key_title: "New Transit Key",
  transit_new_key_name_input: "Name",
  transit_new_key_create_btn: "Create",
  transit_new_key_suffix: " (new)",

  // Transit View Secret Page
  transit_view_secret_title: "Transit Secret View",
  transit_view_encrypt_text: "Encrypt",
  transit_view_encrypt_icon_text: "Encryption Icon",
  transit_view_encrypt_description: "Encrypt some plaintext or base64 encoded binary.",
  transit_view_decrypt_text: "Decrypt",
  transit_view_decrypt_description: "Decrypt some cyphertext.",
  transit_view_decrypt_icon_text: "Decryption Icon",
  transit_view_rewrap_text: "Rewrap",
  transit_view_rewrap_description: "Rewrap ciphertext using a different key version.",
  transit_view_rewrap_icon_text: "Rewrap Icon",

  // Transit Encrypt Page
  transit_encrypt_title: "Transit Encrypt",
  transit_encrypt_suffix: " (encrypt)",
  transit_encrypt_input_placeholder: "Plaintext or base64",
  transit_encrypt_already_encoded_checkbox: "Is the data already encoded in base64?",
  transit_encrypt_encrypt_btn: "Encrypt",
  transit_encrypt_encryption_result_modal_title: "Encryption Result",

  // Transit Decrypt Page
  transit_decrypt_title: "Transit Decrypt",
  transit_decrypt_suffix: " (decrypt)",
  transit_decrypt_input_placeholder: "Cyphertext",
  transit_decrypt_decode_checkbox: "Should the plaintext be base64 decoded?",
  transit_decrypt_decrypt_btn: "Decrypt",
  transit_decrypt_decryption_result_modal_title: "Decryption Result",

  // Transit Rewrap Page
  transit_rewrap_title: "Transit Rewrap",
  transit_rewrap_suffix: " (rewrap)",
  transit_rewrap_version_option_text: "{{version_num}}",
  transit_rewrap_latest_version_option_text: "{{version_num}} (latest)",
  transit_rewrap_input_placeholder: "Cyphertext",
  transit_rewrap_rewrap_btn: "Rewrap",
  transit_rewrap_result_modal_title: "Rewrap Result",

  // Access Home
  access_home_page_title: "Access",
  access_auth_methods_title: "Authentication Methods",
  access_auth_methods_description: "View and manage the allowed authentication methods.",
  access_entities_title: "Entities",
  access_entities_description: "View and manage who and what can access the vault.",
  access_groups_title: "Groups",
  access_groups_description: "View and manage groups of entities.",
  access_leases_title: "Leases",
  access_leases_description: "View and manage the leases of entities.",

  // Auth Home Page
  auth_home_title: "Auth",
  auth_home_view_config: "View Config",
  auth_home_edit_config: "Edit Config",

  // Auth View Config Page
  auth_view_config_title: "Auth View Config",
  auth_view_config_suffix: " (view config)",
  auth_view_config_type: "Type",
  auth_view_config_path: "Path",
  auth_view_config_description: "Description",
  auth_view_config_accessor: "Accessor",
  auth_view_config_local: "Local",
  auth_view_config_seal_wrap: "Seal Wrap",
  auth_view_config_list_when_unauth: "List when unauthenticated?",
  auth_view_config_default_lease_ttl: "Default Lease TTL",
  auth_view_config_max_lease_ttl: "Max Lease TTL",
  auth_view_config_token_type: "Token Type",

  // UserPass Common
  auth_common_username: "Username",
  auth_common_password: "Password",
  auth_common_zero_default: "When one of these fields is 0, that means use the default value",
  auth_common_generated_tokens: "These settings apply to the tokens generated when logging in",
  auth_common_cidrs: "Bound CIDRs",
  auth_common_exp_max_ttl: "Explicit Maximum TTL",
  auth_common_max_ttl: "Maximum TTL",
  auth_common_default_policy_attached: "Do Not Attach 'default' Policy",
  auth_common_max_token_uses: "Maximum Uses",
  auth_common_token_peroid: "Period (seconds)",
  auth_common_policies: "Policies",
  auth_common_initial_ttl: "Initial TTL",
  auth_common_type: "Token Type",

  // userpass Users List
  userpass_users_list_title: "Users List",
  userpass_user_list_new_btn: "New",

  // userpass User View
  userpass_user_view_title: "User View",
  userpass_user_view_edit_btn: "Edit",
  userpass_user_view_delete_btn: "Delete",

  // userpass user edit
  userpass_user_edit_title: "User Edit",
  userpass_user_edit_submit_btn: "Submit",

  // userpass user new
  userpass_user_new_title: "New User",
  userpass_user_new_create_btn: "Create",

  userpass_user_delete_title: "Delete User",
  userpass_user_delete_text:
    "Are you sure you want to delete this user? This action can't be reversed.",
  userpass_user_delete_btn: "Delete User",

  // Policies Home
  policies_home_title: "Policies",
  policies_home_new_btn: "New",

  // Policy View
  policy_view_title: "Policy View ({{policy}})",
  policy_view_edit_btn: "Edit",
  policy_view_delete_btn: "Delete",

  // Policy New
  policy_new_title: "Create New Policy",
  policy_new_name_placeholder: "Policy Name",
  policy_new_create_btn: "Create",
  policy_new_already_exists: "This policy already exists.",

  policy_edit_title: "Edit Policy ({{policy}})",
  policy_edit_edit_btn: "Edit",

  // Policy Delete
  policy_delete_title: "Delete Policy ({{policy}})",
  policy_delete_text:
    "Are you sure you want to delete this policy? It can't be reversed and there is a chance that all permissions will break.",
  policy_delete_btn: "Delete Policy",
};
