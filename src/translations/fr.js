module.exports = {
  // The localised name for the language
  "language_name": "Français",
  
  // These are the buttons on the top bar.
  "home_btn": "Accueil",
  "back_btn": "Retour",
  "refresh_btn": "Rafraichir",
  "me_btn": "Profil/Paramètres",

  // Me Page
  "me_page_title": "Profil/Paramètres",
  "log_out_btn": "Déconnexion",
  "copy_token_btn": "Copier le jeton",
  "renew_lease_btn": "Renouveler le jeton",
  "change_language_btn": "Changer la langue",

  // Home Page
  "home_page_title": "Accueil",
  "vaulturl_text": "Adresse du Vault: {{text}}",
  "password_generator_btn": "Générateur de mot de passe",
  "your_token_expires_in": "Votre jeton expire dans {{date, until_date}}",

  // Unseal Page
  "unseal_vault_text": "Ouvrir le Vault",
  "submit_key_btn": "Ajouter la clé",
  "unseal_input_btn": "Basculer en entrée de clé manuelle",
  "unseal_qr_btn": "Basculer en entrée de QR code",
  "key_input_placeholder": "Clé",
  "unseal_keys_progress": "Clés: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  "set_language_title": "Langue",
  "set_language_btn": "Changer la langue",

  // Password Generator Page
  "password_generator_title": "Générateur de mot de passe",
  "gen_password_btn": "Générer le mot de passe",

  // Login Page
  "log_in_title": "Connexion",
  "log_in_with_token": "Jeton",
  "log_in_with_username": "Nom d'utilisateur",
  "token_input": "Jeton",
  "username_input": "Nom d'utilisateur",
  "password_input": "Mot de passe",
  "log_in_btn": "Se connecter",

  // Key Value Delete Page
  "kv_delete_title": "Suppression clé/valeur",
  "kv_delete_text": "Voulez-vous vraiment supprimer ceci ?",
  "kv_delete_btn": "Supprimer",
  "kv_delete_suffix": " (supprimé)",

  // Key Value New Page
  "kv_new_title": "Nouvelle clé/valeur",
  "kv_new_suffix": " (nouveau)",
  "kv_new_path": "Chemin relatif",
  "kv_new_create_btn": "Créer un secret vide",

  // Key Value Secret Page
  "kv_secret_title": "Clé/valeur secrète",
  "kv_secret_deleted_text": "Cette version secrète a été supprimée temporairement mais reste restaurable, voulez-vous la restaurer ?",
  "kv_secret_restore_btn": "Restaurer la version secrète",
  "kv_secret_loading": "Chargement du secret..",
  "kv_secret_delete_btn": "Supprimer",
  "kv_secret_delete_all_btn": "Supprimer toutes les versions",
  "kv_secret_delete_version_btn": "Supprimer la version {{ version }}",
  "kv_secret_edit_btn": "Éditer",
  "kv_secret_versions_btn": "Versions",

  // Key Value Secret Editor Page
  "kv_sec_edit_title": "Édition clé/valeur",
  "kv_sec_edit_btn": "Éditer",
  "kv_sec_edit_loading": "Chargement de l'éditeur..",
  "kv_sec_edit_invalid_json_err": "Code JSON invalide",
  "kv_sec_edit_suffix": " (édité)",

  // Key Value Secret Versions Page
  "kv_sec_versions_title": "Versions clé/valeur",
  "kv_sec_versions_suffix": " (édité)",

  // Key Value View/List Secrets Page
  "kv_view_title": "Visionneuse clé/valeur",
  "kv_view_cubbyhole_text": "Dans cubbyhole, les secrets peuvent être stockés aussi longtemps que la validité de votre jeton. Ils seront supprimés quand le délai est expiré et ne peuvent être lus qu'avec votre jeton actuel.",
  "kv_view_new_btn": "Nouveau",
  "kv_view_none_here_text": "Vous semblez ne pas avoir de secrets ici, voulez-vous en créer un ?",

  // TOTP View Page
  "totp_view_title": "TOTP",
  "totp_view_new_btn": "Ajouter une clé TOTP",
  "totp_view_loading": "Chargement des codes TOTP..",
  "totp_view_empty": "Vous ne semblez pas avoir de code TOTP ici, voulez-vous en créer un ?",
  "totp_view_loading_box": "Chargement..",

  // New TOTP Key Page
  "totp_new_title": "Nouvelle clé TOTP",
  "totp_new_suffix": " (nouveau)",
  "totp_new_name_text": "Nom de clé TOTP",
  "totp_new_info": "Vous avez besoin soit d'une clé ou d'une URI, une URI est recommandée mais peut ne pas fonctionner. Scannez simplement le QR code et copiez l'adresse.",
  "totp_new_uri_input": "URI",
  "totp_new_key_input": "Clé",
  "totp_new_add_btn": "Ajouter clé TOTP",


}