module.exports = {
  // The localised name for the language
  language_name: "русский",
  // Internal: The direction of text (ltr or rtl)
  language_direction: "ltr",

  // These are the buttons on the top bar.
  home_btn: "Главная страница",
  back_btn: "Назад",
  refresh_btn: "Обновить",
  me_btn: "Профиль/параметры",

  // General Notification Messages
  notification_copy_success: "Текст скопирован в буфер обмена.",
  not_implemented: "Функция ещё не реализована",

  // Copyable Modal
  copy_modal_download_btn: "Загрузить",
  copy_modal_copy_btn: "Копировать",
  copy_modal_close_btn: "Закрыть",

  // Generic Loading Text
  content_loading: "Загрузка..",

  // Copyable Input Box
  copy_input_box_copy_icon_text: "Копировать",

  // File Upload Input
  file_upload_input_btn: "Загрузить файл",

  // Me Page
  me_page_title: "Профиль/параметры",
  me_log_out_btn: "Выход",
  me_seal_vault_btn: "Закрыть хранилище",
  me_copy_token_btn: "Копировать код доступа",
  me_renew_lease_btn: "Продлить действие кода доступа",
  me_change_language_btn: "Выбор языка",

  // Home Page
  home_page_title: "Главная страница",
  home_vaulturl_text: "Адрес хранилища: {{text}}",
  home_password_generator_btn: "Генератор паролей",
  home_your_token_expires_in: "Продолжительность ключа: {{date, until_date}}",
  home_secrets_title: "Тайны",
  home_secrets_description: "Просмотр, создание и управление тайнами.",
  home_access_title: "Доступ",
  home_access_description:
    "Управление доступом к хранилищу и способами аутентификации пользователей.",
  home_policies_title: "Политика",
  home_policies_description: "Управление политикой и правами доступа.",

  // Secrets Home Page
  secrets_home_page_title: "Тайны",
  secrets_home_new_secrets_engine_button: "Новый обработчик тайн",

  // New Secrets Engine Page
  new_secrets_engine_title: "Новый обработчик тайн",
  new_secrets_engine_kv_title: "Ключ/значение",
  new_secrets_engine_kv_description: 'Для хранения тайн в формате пар "ключ/значение".',
  new_secrets_engine_totp_title: "TOTP",
  new_secrets_engine_totp_description:
    "Для хранения одноразовых кодов, создаваемых алгоритмом TOTP.",
  new_secrets_engine_transit_title: "Transit",
  new_secrets_engine_transit_description: "Для шифрования/расшифрования данных без их хранения.",

  // New KV Engine Page
  new_kv_engine_title: 'Новый обработчик пар "ключ/значение"',
  new_kv_engine_name_input: "Имя",
  new_kv_engine_version_1: "Версия 1",
  new_kv_engine_version_2: "Версия 2",
  new_kv_engine_create_btn: "Создать",

  // New KV Engine Page
  new_totp_engine_title: "Новый обработчик TOTP",
  new_totp_engine_name_input: "Имя",
  new_totp_engine_create_btn: "Создать",

  // New Transit Engine Page
  new_transit_engine_title: "Новый обработчик Transit",
  new_transit_engine_name_input: "Имя",
  new_transit_engine_create_btn: "Создать",

  // Unseal Page
  unseal_vault_text: "Раскрыть хранилище",
  unseal_submit_key_btn: "Отправить ключ",
  unseal_input_btn: "Ввести ключ вручную",
  unseal_qr_btn: "Ввести ключ через QR-код",
  unseal_key_input_placeholder: "Ключ",
  unseal_keys_progress: "Ключи: {{progress}}/{{keys_needed}}",

  // Language Selector Page
  set_language_title: "Выбор языка",
  set_language_btn: "Выбрать язык",

  // Password Generator Page
  password_generator_title: "Генератор паролей",
  password_generator_length_title: "Длина пароля ({{min}}/{{max}})",
  password_generator_generate_btn: "Генерировать",

  // Login Page
  log_in_title: "Вход",
  log_in_with_token: "Вход с кодом доступа",
  log_in_with_username: "Вход по имени",
  log_in_token_input: "Код доступа",
  log_in_username_input: "Имя пользователя",
  log_in_password_input: "Пароль",
  log_in_btn: "Войти",
  log_in_token_login_error: "Неправильный код доступа",

  // Key Value Delete Page
  kv_delete_title: "Удаление ключа/значения",
  kv_delete_text: "Вы уверены, что хотите удалить это?",
  kv_delete_btn: "Удалить",
  kv_delete_suffix: " (удалить)",

  // Key Value New Page
  kv_new_title: "Новый ключ/значение",
  kv_new_suffix: " (новый)",
  kv_new_path: "Относительный путь",
  kv_new_create_btn: "Создать пустые тайные данные",

  // Key Value Secret Page
  kv_secret_title: "Тайные ключи/значения",
  kv_secret_deleted_text:
    "Тайная версия данных была удалена, но может быть восстановлена. Вы хотите восстановить её?",
  kv_secret_restore_btn: "Восстановить тайную версию",
  kv_secret_loading: "Загрузка тайных данных..",
  kv_secret_delete_btn: "Удалить",
  kv_secret_delete_all_btn: "Удалить все версии",
  kv_secret_delete_version_btn: "Удалить версию {{ version }}",
  kv_secret_edit_btn: "Редактировать",
  kv_secret_versions_btn: "Версии",

  // Key Value Secret Editor Page
  kv_sec_edit_title: "Редактировать ключи/значения",
  kv_sec_edit_btn: "Редактировать",
  kv_sec_edit_loading: "Загрузка редактора..",
  kv_sec_edit_invalid_json_err: "Некорректный JSON",
  kv_sec_edit_suffix: " (редакт.)",

  // Key Value Secret Versions Page
  kv_sec_versions_title: "Версии ключей/значений",
  kv_sec_versions_suffix: " (версии)",

  // Key Value View/List Secrets Page
  kv_view_title: "Просмотр ключей/значений",
  kv_view_cubbyhole_text:
    "При использовании cubbyhole, тайные данные можно хранить до тех пор, пока действителен ваш код доступа. Они будут удалены при истечении кода и могут быть просмотрены только с использованием этого кода.",
  kv_view_new_btn: "Создать",
  kv_view_none_here_text: "У вас на данный момент нет тайных данных. Хотите ли вы их создать?",

  // TOTP View Page
  totp_view_title: "TOTP",
  totp_view_new_btn: "Добавить",
  totp_view_secret_delete_btn: "Удалить",
  totp_view_loading: "Загрузка кодов TOTP..",
  totp_view_empty: "У вас на данный момент нет кодов TOTP. Хотите ли вы их создать?",
  totp_view_loading_box: "Загрузка..",

  // New TOTP Key Page
  totp_new_title: "Новый ключ TOTP",
  totp_new_suffix: " (новый)",
  totp_new_name_text: "Имя ключа TOTP",
  totp_new_info:
    "Необходим либо ключ, либо адрес URI. Лучше всего использовать URI, но он может не сработать. Отсканируйте QR-код и скопируйте его адрес.",
  totp_new_uri_input: "URI",
  totp_new_key_input: "Ключ",
  totp_new_add_btn: "Добавить ключ TOTP",
  totp_new_switch_to_qr_btn: "Использовать ввод QR-кода",
  totp_new_switch_back_to_manual_input_btn: "Использовать ручной ввод данных",

  // TOTP Delete Page
  totp_delete_title: "Удалить ключ TOTP",
  totp_delete_suffix: " (удалить)",
  totp_delete_text: "Вы уверены, что хотите удалить эту тайну TOTP?",
  totp_delete_button: "Удалить",

  // Transit View Page
  transit_view_title: "Просмотр Transit",
  transit_view_new_btn: "Новый ключ",
  transit_view_none_here_text: "У вас нет ключей Transit, хотите ли вы их создать?",

  transit_new_key_title: "Новый ключ Transit",
  transit_new_key_name_input: "Имя",
  transit_new_key_create_btn: "Создать",
  transit_new_key_suffix: " (новый)",

  // Transit View Secret Page
  transit_view_secret_title: "Просмотр тайных данных Transit",
  transit_view_encrypt_text: "Зашифровать",
  transit_view_encrypt_icon_text: "Значок шифрования",
  transit_view_encrypt_description: "Зашифровать текст или двоичные данные, закодированные base64.",
  transit_view_decrypt_text: "Расшифровать",
  transit_view_decrypt_description: "Расшифровать шифр-текст.",
  transit_view_decrypt_icon_text: "Значок расшифрования",
  transit_view_rewrap_text: "Перешифровать",
  transit_view_rewrap_description: "Перешифровать шифр-текст, используя другую версию ключа.",
  transit_view_rewrap_icon_text: "Значок перешифрования",

  // Transit Encrypt Page
  transit_encrypt_title: "Шифрование Transit",
  transit_encrypt_suffix: " (шифр.)",
  transit_encrypt_input_placeholder: "Текст или base64",
  transit_encrypt_already_encoded_checkbox: "Данные уже закодированы в base64?",
  transit_encrypt_encrypt_btn: "Зашифровать",
  transit_encrypt_encryption_result_modal_title: "Результат шифрования",

  // Transit Decrypt Page
  transit_decrypt_title: "Расшифрование Transit",
  transit_decrypt_suffix: " (расшифр.)",
  transit_decrypt_input_placeholder: "Шифр-текст",
  transit_decrypt_decode_checkbox: "Нужно ли раскодировать текст из base64?",
  transit_decrypt_decrypt_btn: "Расшифровать",
  transit_decrypt_decryption_result_modal_title: "Результат расшифрования",

  // Transit Rewrap Page
  transit_rewrap_title: "Перешифрование Transit",
  transit_rewrap_suffix: " (перешифр.)",
  transit_rewrap_version_option_text: "{{version_num}}",
  transit_rewrap_latest_version_option_text: "{{version_num}} (последняя версия)",
  transit_rewrap_input_placeholder: "Шифр-текст",
  transit_rewrap_rewrap_btn: "Перешифровать",
  transit_rewrap_result_modal_title: "Результат перешифрования",

  // Access Home
  access_home_page_title: "Доступ",
  access_auth_methods_title: "Методы аутентификации",
  access_auth_methods_description: "Просмотр и управление разрешёнными методами аутентификации.",
  access_entities_title: "Сущности",
  access_entities_description:
    "Просмотр и управление пользователями и объектами, имеющих доступ к хранилищу.",
  access_groups_title: "Группы",
  access_groups_description: "Просмотр и управление группами сущностей.",
  access_leases_title: "Коды доступа",
  access_leases_description: "Просмотр и управление кодами доступа.",

  // Auth Home Page
  auth_home_title: "Аутентификация",
  auth_home_view_config: "Просмотр настроек",
  auth_home_edit_config: "Редактирование настроек",

  // Auth View Config Page
  auth_view_config_title: "Просмотр настроек аутентификации",
  auth_view_config_suffix: " (просм. настр.)",
  auth_view_config_type: "Тип",
  auth_view_config_path: "Путь",
  auth_view_config_description: "Описание",
  auth_view_config_accessor: "Ссылка ключа доступа",
  auth_view_config_local: "Локальный",
  auth_view_config_seal_wrap: "Дополнительное шифрование",
  auth_view_config_list_when_unauth: "Отображать без аутентификации?",
  auth_view_config_default_lease_ttl: "Срок действия по умолчанию",
  auth_view_config_max_lease_ttl: "Максимальный срок действия",
  auth_view_config_token_type: "Тип кода доступа",

  // UserPass Common
  auth_common_username: "Имя пользователя",
  auth_common_password: "Пароль",
  auth_common_zero_default:
    "Когда в поле указано значение 0, будет использовано значение по умолчанию",
  auth_common_generated_tokens:
    "Эти параметры будут применяться к кодам доступа, создаваемым при входе в систему",
  auth_common_cidrs: "Разрешённые IP-адреса (CIDR)",
  auth_common_exp_max_ttl: "Явный максимальный срок",
  auth_common_max_ttl: "Максимальный срок",
  auth_common_default_policy_attached: "Не применять политику по умолчанию",
  auth_common_max_token_uses: "Максимальное кол-во применений кодов доступа",
  auth_common_token_peroid: "Период (в секундах)",
  auth_common_policies: "Политика",
  auth_common_initial_ttl: "Изначальный срок",
  auth_common_type: "Тип кодов доступа",

  // userpass Users List
  userpass_users_list_title: "Список пользователей",
  userpass_user_list_new_btn: "Новый пользователь",

  // userpass User View
  userpass_user_view_title: "Просмотр пользователя",
  userpass_user_view_edit_btn: "Редактировать",
  userpass_user_view_delete_btn: "Удалить",

  // userpass user edit
  userpass_user_edit_title: "Редактирование пользователя",
  userpass_user_edit_submit_btn: "Отправить",

  // userpass user new
  userpass_user_new_title: "Новый пользователь",
  userpass_user_new_create_btn: "Создать",

  userpass_user_delete_title: "Удаление пользователя",
  userpass_user_delete_text:
    "Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.",
  userpass_user_delete_btn: "Удалить пользователя",

  // Policies Home
  policies_home_title: "Политика",
  policies_home_new_btn: "Новая политика",

  // Policy View
  policy_view_title: "Просмотр политики ({{policy}})",
  policy_view_edit_btn: "Редактировать",
  policy_view_delete_btn: "Удалить",

  // Policy New
  policy_new_title: "Создание новой политики",
  policy_new_name_placeholder: "Название политики",
  policy_new_create_btn: "Создать",
  policy_new_already_exists: "Данная политика уже существует.",

  policy_edit_title: "Редактирование политики ({{policy}})",
  policy_edit_edit_btn: "Редактировать",

  // Policy Delete
  policy_delete_title: "Удаление политики ({{policy}})",
  policy_delete_text:
    "Вы уверены, что хотите удалить эту политику? Данное действие нельзя отменить, и есть возможность, что будут испорчены права доступа.",
  policy_delete_btn: "Удалить политику",
};
