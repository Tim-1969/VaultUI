module.exports = {
  // The localised name for the language
  "language_name": "русский",

  // These are the buttons on the top bar.
  "home_btn": "Главная страница",
  "back_btn": "Назад",
  "refresh_btn": "Обновить",
  "me_btn": "Профиль/параметры",
  // These are the page titles
  "home_page_title": "Главная страница",
  // Me Page
  "me_page_title": "Профиль/параметры",
  "log_out_btn": "Выход",
  "copy_token_btn": "Копировать код",
  "renew_lease_btn": "Продлить действие кода",
  "change_language_btn": "Выбор языка",

  // Home Page
  "vaulturl_text": "Адрес хранилища: {{text}}",
  "password_generator_btn": "Генератор паролей",
  "your_token_expires_in": "Ключ годен до: {{date, until_date}}"

  // Unseal Page
  "unseal_vault_text": "Раскрыть хранилище",
  "submit_key_btn": "Отправить ключ",
  "unseal_input_btn": "Ввести ключ вручную",
  "unseal_qr_btn": "Ввести ключ через QR-код",
  "key_input_placeholder": "Ключ",
  "unseal_keys_progress": "Ключи: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  "set_language_title": "Выбор языка",
  "set_language_btn": "Выбрать язык",

  // Password Generator Page
  "password_generator_title": "Генератор паролей",
  "gen_password_btn": "Генерировать",

  // Login Page
  "log_in_title": "Вход",
  "log_in_with_token": "Вход с ключём",
  "log_in_with_username": "Вход по имени",
  "token_input": "Ключ",
  "username_input": "Имя пользователя",
  "password_input": "Пароль",
  "log_in_btn": "Войти",

  // Key Value Delete Page
  "kv_delete_title": "Удаление ключа/значения",
  "kv_delete_text": "Вы уверены, что хотите удалить это?",
  "kv_delete_btn": "Удалить",
  "kv_delete_suffix": " (удалить)",

  // Key Value New Page
  "kv_new_title": "Новый ключ/значение",
  "kv_new_suffix": " (новый)",
  "kv_new_path": "Относительный путь",
  "kv_new_create_btn": "Создать пустые тайные данные",

  // Key Value Secret Page
  "kv_secret_title": "Тайные ключи/значения",
  "kv_secret_deleted_text": "Тайная версия данных была удалена, но может быть восстановлена. Вы хотите восстановить её?",
  "kv_secret_restore_btn": "Восстановить тайную версию",
  "kv_secret_loading": "Загрузка тайных данных..",
  "kv_secret_delete_btn": "Удалить",
  "kv_secret_delete_all_btn": "Удалить все версии",
  "kv_secret_delete_version_btn": "Удалить версию {{ version }}",
  "kv_secret_edit_btn": "Редактировать",
  "kv_secret_versions_btn": "Версии",

  // Key Value Secret Editor Page
  "kv_sec_edit_title": "Редактировать ключи/значения",
  "kv_sec_edit_btn": "Редактировать",
  "kv_sec_edit_loading": "Загрузка редактора..",
  "kv_sec_edit_invalid_json_err": "Некорректный JSON",
  "kv_sec_edit_suffix": " (редакт.)",

  // Key Value Secret Versions Page
  "kv_sec_versions_title": "Версии ключей/значений",
  "kv_sec_versions_suffix": " (редакт.)",

  // Key Value View/List Secrets Page
  "kv_view_title": "Просмотр ключей/значений",
  "kv_view_cubbyhole_text": "При использовании cubbyhole, тайные данные можно хранить до тех пор, пока действителен ваш код доступа. Они будут удалены при истечении кода и могут быть просмотрены только с использованием этого кода.",
  "kv_view_new_btn": "Создать",
  "kv_view_none_here_text": "У вас на данный момент нет тайных данных. Хотите ли вы их создать?",

  // TOTP View Page
  "totp_view_title": "TOTP",
  "totp_view_new_btn": "Добавить ключ TOTP",
  "totp_view_loading": "Загрузка кодов TOTP..",
  "totp_view_empty": "У вас на данный момент нет кодов TOTP. Хотите ли вы их создать?",
  "totp_view_loading_box": "Загрузка..",

  // New TOTP Key Page
  "totp_new_title": "Новый ключ TOTP",
  "totp_new_suffix": " (новый)",
  "totp_new_name_text": "Имя ключа TOTP",


}
