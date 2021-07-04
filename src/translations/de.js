module.exports = {
  // The localised name for the language
  language_name: "Deutsche",
  // Internal: The direction of text (ltr or rtl)
  language_direction: "ltr",

  // These are the buttons on the top bar.
  home_btn: "Startseite",
  back_btn: "Zurück",
  refresh_btn: "Neu laden",
  me_btn: "Profil/Einstellungen",
  log_out_btn: "Abmelden",
  copy_token_btn: "Token kopieren",
  renew_lease_btn: "Token erneuern",
  
  // General Notification Messages
  notification_copy_success: "In Zwischenablage kopiert.",
  not_implemented: "Noch nicht implementiert",

  // Copyable Modal
  copy_modal_download_btn: "Download",
  copy_modal_copy_btn: "Kopieren",
  copy_modal_close_btn: "Schließen",

  // Generic Loading Text
  content_loading: "Laden..",

  // Copyable Input Box
  copy_input_box_copy_icon_text: "Kopie Knopf",

  // File Upload Input
  file_upload_input_btn: "Datei hochladen",

  // Me Page
  me_page_title: "Proil/Einstellungen",
  me_seal_vault_btn: "Vault versiegeln",
  me_copy_token_btn: "Token kopieren",
  me_renew_lease_btn: "Neuen Token anfordern",
  me_change_language_btn: "Sprache ändern",

  // Home Page
  home_page_title: "Startseite",
  home_vaulturl_text: "Vault URL: {{text}}",
  home_password_generator_btn: "Passwortgenerator",
  home_your_token_expires_in: "Ihr Token läuft ab in {{date, until_date}}",
  home_secrets_title: "Secrets",
  home_secrets_description: "Anzeigen, Erstellen und Bearbeiten von Secrets.",
  home_access_title: "Zugriff",
  home_access_description: "Verwalte wer oder was, wie zugriff auf den Vault hat.",
  home_policies_title: "Richtlinien",
  home_policies_description: "Verwalte Richtlinien und Berechtigungen.",

  // Secrets Home Page
  secrets_home_page_title: "Secrets",
  secrets_home_new_secrets_engine_button: "Neue Secrets erstellen",

  // New Secrets Engine Page
  new_secrets_engine_title: "Neue Secrets erstellen",
  new_secrets_engine_kv_title: "Key/Value",
  new_secrets_engine_kv_description: "For storing key/value mapped secrets.",
  new_secrets_engine_totp_title: "TOTP",
  new_secrets_engine_totp_description: "For handing Time-based One Time Pass (TOTP) codes.",
  new_secrets_engine_transit_title: "Transit",
  new_secrets_engine_transit_description:
    "Für das entschlüsseln und verschüsseln ihne die datein zu speichern.",

  // New KV Engine Page
  new_kv_engine_title: "New Key/Value Engine",
  new_kv_engine_name_input: "Name",
  new_kv_engine_version_1: "Version 1",
  new_kv_engine_version_2: "Version 2",
  new_kv_engine_create_btn: "Erstellen",

  // New KV Engine Page
  new_totp_engine_title: "New TOTP Engine",
  new_totp_engine_name_input: "Name",
  new_totp_engine_create_btn: "Erstellen",

  // New Transit Engine Page
  new_transit_engine_title: "New Transit Engine",
  new_transit_engine_name_input: "Name",
  new_transit_engine_create_btn: "Erstellen",

  // Unseal Page
  unseal_vault_text: "Entsiegeln des Vaults",
  unseal_submit_key_btn: "Key abschicken",
  unseal_input_btn: "Zur Manuellen Key eingabe wechseln.",
  unseal_qr_btn: "Zur QR Key einabe wechseln",
  unseal_key_input_placeholder: "Key",
  unseal_keys_progress: "Keys: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  set_language_title: "Sprache ändern",
  set_language_btn: "Sprache ändern",

  // Password Generator Page
  password_generator_title: "Passwortgenerator",
  password_generator_length_title: "Die länge des passworts muss zwischen ({{min}}/{{max}}) sein.",
  password_generator_generate_btn: "Passwort generieren",

  // Login Page
  log_in_title: "Login",
  log_in_with_token: "Token",
  log_in_with_username: "Benutzername",
  log_in_token_input: "Token",
  log_in_username_input: "Benutzername",
  log_in_password_input: "Passwort",
  log_in_btn: "Login",
  log_in_token_login_error: "Invalider Token",

  // Key Value Delete Page
  kv_delete_title: "K/V Delete",
  kv_delete_text: "Bist du sicher das du das löschen möchtest?",
  kv_delete_btn: "Löschen",
  kv_delete_suffix: " (Löschen)",

  // Key Value New Page
  kv_new_title: "K/V New",
  kv_new_suffix: " (new)",
  kv_new_path: "Relative Path",
  kv_new_create_btn: "Leeres Secret erstellen.",

  // Key Value Secret Page
  kv_secret_title: "K/V Secret",
  kv_secret_deleted_text:
    "This secret version has been soft deleted but remains restorable, do you want to restore it?",
  kv_secret_restore_btn: "Restore Secret Version",
  kv_secret_loading: "Lade Secret..",
  kv_secret_delete_btn: "Löschen",
  kv_secret_delete_all_btn: "Alle versionen löschen",
  kv_secret_delete_version_btn: "Version {{ version }} löschen",
  kv_secret_edit_btn: "Bearbeiten",
  kv_secret_versions_btn: "Versionen",

  // Key Value Secret Editor Page
  kv_sec_edit_title: "K/V Edit",
  kv_sec_edit_btn: "Bearbeiten",
  kv_sec_edit_loading: "Lade Editor...",
  kv_sec_edit_invalid_json_err: "Invalides JSON",
  kv_sec_edit_suffix: " (Bearbeiten)",

  // Key Value Secret Versions Page
  kv_sec_versions_title: "K/V Versions",
  kv_sec_versions_suffix: " (Versionen)",

  // Key Value View/List Secrets Page
  kv_view_title: "K/V View",
  kv_view_cubbyhole_text:
    "Bei cubbyhole, können secrets gespeichert werden, solange dein Token gültig ist. Sobald der Token nicht mehr gültig ist, werden die Secrets gelöscht und können daher auch nur mit dem jetzigen Token gültig ist."
  kv_view_new_btn: "Neu",
  kv_view_delete_btn: "Löschen",
  kv_view_none_here_text: "Es scheint so als hättest du noch keine Secrets hier. Möchtest du eins erstellen?",

  // TOTP View Page
  totp_view_title: "TOTP",
  totp_view_new_btn: "Neu",
  totp_view_delete_btn: "Löschen",
  totp_view_secret_delete_btn: "Löschen",
  totp_view_loading: "Loading TOTP Codes..",
  totp_view_empty: "You seem to have no TOTP codes here, would you like to create one?",
  totp_view_loading_box: "Lädt..",

  // New TOTP Key Page
  totp_new_title: "New TOTP Key",
  totp_new_suffix: " (Neu)",
  totp_new_name_text: "TOTP Key Name",
  totp_new_info:
    "Du brauchst entweder einen key oder URI. Eine URI ist bevorzugt es könnte aber sein, dass diese nicht funkoniert. Scanne einfach den QR Code und kopiere die URL.",
  totp_new_uri_input: "URI",
  totp_new_key_input: "Key",
  totp_new_add_btn: "Add TOTP Key",
  totp_new_switch_to_qr_btn: "zu QR Code wechseln",
  totp_new_switch_back_to_manual_input_btn: "Zurück zur manuellen eingabe", 
  // TOTP Delete Page
  totp_delete_title: "Delete TOTP Key", 
  totp_delete_suffix: " (löschen)",
  totp_delete_text: "Are you sure you want to delete this TOTP secret?",
  totp_delete_button: "Löschen",

  // Transit View Page
  transit_view_title: "Transit View",
  transit_view_new_btn: "Neu",
  transit_view_delete_btn: "Löschen",
  transit_view_none_here_text:
    "You seem to have no transit keys here, would you like to create one?",

  transit_new_key_title: "New Transit Key",
  transit_new_key_name_input: "Name",
  transit_new_key_create_btn: "Erstellen",
  transit_new_key_suffix: " (Neu)",

  // Transit View Secret Page
  transit_view_secret_title: "Transit Secret View",
  transit_view_encrypt_text: "Verschlüsseln",
  transit_view_encrypt_icon_text: "Versschlüssel Icon",
  transit_view_encrypt_description: "Encrypt some plaintext or base64 encoded binary.",
  transit_view_decrypt_text: "Entschlüsseln",
  transit_view_decrypt_description: "Decrypt some cyphertext.",
  transit_view_decrypt_icon_text: "Entschlüsselungs Icon",
  transit_view_rewrap_text: "Rewrap",
  transit_view_rewrap_description: "Rewrap ciphertext using a different key version.",
  transit_view_rewrap_icon_text: "Rewrap Icon",

  // Transit Encrypt Page
  transit_encrypt_title: "Transit Encrypt",
  transit_encrypt_suffix: " (verschlüsseln)",
  transit_encrypt_input_placeholder: "Normaler-Text oder base64",
  transit_encrypt_already_encoded_checkbox: "Ist der text schon in base64 verschlüsselt?",
  transit_encrypt_encrypt_btn: "Verschlüsseln",
  transit_encrypt_encryption_result_modal_title: "Verachlüsselungs ergebnis",

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

  // Delete Secret Engine Page
  delete_secrets_engine_title: "Delete Secret Engine ({{mount}})",
  delete_secrets_engine_message:
    "Are you sure you want to delete this secrets engine and all the data stored within? This can't be reversed.",
  delete_secrets_engine_delete_btn: "Delete",

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
  auth_common_password: "Passwort",
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

