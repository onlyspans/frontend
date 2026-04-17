# Локальный Authentik (Docker Compose)

Инфраструктура для поднятия [Authentik](https://goauthentik.io/) рядом с разработкой: единый IdP (OIDC), без отдельного микросервиса «авторизации» с дублированием пользователей.

## Роль в архитектуре

**Authentik** — единственный сервис учётных записей: пароли, MFA, внешние входы (GitHub и др.). Прикладной бэкенд **не хранит пароли** и **не выдаёт свои refresh-токены вместо Authentik**. Он либо проверяет **access token OIDC** (JWT от Authentik) по JWKS, либо участвует в **authorization code flow** с Authentik как единственным IdP. Бизнес-данные в вашей БД можно связывать с пользователем по стабильному **`sub`** (и при необходимости email) из токена.

**Фронтенд этого репозитория** сейчас ориентирован на отдельный Auth API (`VITE_AUTH_API_URL` в корневом `.env.example`). Переход на «только Authentik» — отдельная задача: OIDC-клиент (в т.ч. PKCE) против Authentik и работа с токенами, которые выдаёт Authentik. Здесь достаточно зафиксировать: в Authentik создаются **Application** и **Provider (OIDC)**; в настройках провайдера указываются redirect URI приложения, например `http://localhost:<порт>/...` для локальной разработки.

## Запуск

1. Скопируйте `.env.example` в `.env` в этой папке и задайте обязательные переменные:
   - `PG_PASS` — пароль PostgreSQL;
   - `AUTHENTIK_SECRET_KEY` — секретный ключ инстанса (длинная случайная строка; см. [документацию](https://docs.goauthentik.io/install-config/install/docker-compose/)).
2. При необходимости задайте `COMPOSE_PORT_HTTP` / `COMPOSE_PORT_HTTPS` (по умолчанию `9000` / `9443`).
3. Из каталога `infra/authentik`:

   ```bash
   docker compose up -d
   ```

4. Откройте веб-интерфейс: `http://localhost:<COMPOSE_PORT_HTTP>` (по умолчанию `http://localhost:9000`).
5. Первый запуск: создайте учётную запись администратора через мастер настройки (bootstrap).

Каталоги `./data`, `./certs`, `./custom-templates` монтируются в контейнеры; не коммитьте `.env` с секретами.

## `compose.yml`

Файл основан на [официальном `compose.yml`](https://docs.goauthentik.io/compose.yml). Для **локальной разработки без outposts** у сервиса `worker` **не смонтирован** `docker.sock` (в upstream он нужен для сценариев с Docker/outposts). Если вам нужен полный паритет с официальным файлом — добавьте в `worker.volumes` строку `/var/run/docker.sock:/var/run/docker.sock` по документации Authentik.

## GitHub (OAuth)

Ниже — практический минимальный сценарий, чтобы кнопка GitHub появилась на форме входа, а пользователь мог залогиниться.

### Шаг 1 — создать Source в Authentik

1. В админке Authentik откройте **Directory → Federation & Social login**.
2. Создайте **GitHub** source.
3. Задайте **Slug** (например `github`). Он попадёт в callback URL.

### Шаг 2 — создать OAuth App в GitHub

1. Откройте [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers) и создайте **New OAuth App**.
2. Вставьте **Authorization callback URL** в формате Authentik:

   `http://localhost:<порт>/source/oauth/callback/<slug>/`

   где `<порт>` — ваш `COMPOSE_PORT_HTTP` (по умолчанию `9000`), а `<slug>` — slug source из шага выше (например `github`).
3. Скопируйте **Client ID** и **Client Secret**.

### Шаг 3 — связать GitHub app с source в Authentik

1. Вернитесь в созданный GitHub source в Authentik.
2. Вставьте **Client ID** и **Client Secret**.
3. Сохраните.

### Шаг 4 — показать кнопку GitHub на странице входа

Чтобы источник был доступен пользователям на форме логина, добавьте его в login-flow:

1. Откройте **Flows and Stages**.
2. Найдите flow входа (обычно *default authentication flow* / *default login flow*).
3. Добавьте stage для социальных источников (по документации: *add sources to the default login page*) и включите ваш GitHub source.

Ссылка: [Sources / social login](https://docs.goauthentik.io/users-sources/sources/) и [добавление источников на login](https://docs.goauthentik.io/users-sources/sources/#add-sources-to-the-default-login-page).

### Проверка

- Откройте страницу входа (обычно `http://localhost:9000/if/flow/default-authentication-flow/` или просто главную с редиректом на логин).
- Убедитесь, что появилась кнопка **GitHub**.
- Попробуйте войти — после успешного OAuth Authentik создаст/свяжет пользователя (в зависимости от настроек source).

## Google (OAuth)

Настройка Google делается тем же принципом: создаём source в Authentik, создаём OAuth Client в Google Cloud Console, прописываем callback с правильным slug, затем добавляем source на страницу логина.

### Шаг 1 — создать Source в Authentik

1. В админке Authentik откройте **Directory → Federation & Social login**.
2. Создайте **Google** source.
3. Задайте **Slug** (например `google`).

### Шаг 2 — создать OAuth Client в Google

1. В Google Cloud Console создайте **OAuth client ID** (тип приложения — Web application).
2. В **Authorized redirect URIs** укажите callback Authentik:

   `http://localhost:<порт>/source/oauth/callback/<slug>/`

   где `<порт>` — ваш `COMPOSE_PORT_HTTP` (по умолчанию `9000`), а `<slug>` — slug source из шага выше (например `google`).
3. Скопируйте **Client ID** и **Client Secret**.

### Шаг 3 — связать Google app с source в Authentik

1. В Google source в Authentik вставьте **Client ID** и **Client Secret**.
2. Сохраните.

### Шаг 4 — показать кнопку Google на странице входа

Аналогично GitHub:

1. Откройте **Flows and Stages**.
2. В default login/authentication flow добавьте/настройте stage с источниками и включите **Google** source.

### Проверка

- На странице входа должны появиться кнопки **Google** и **GitHub** (если включены оба).

## Логин и пароль (локальные пользователи)

Используются стандартные **flows** Authentik: идентификация (username/email) и пароль. Пользователи и хэши паролей хранятся в **PostgreSQL** этого стека, не в отдельном сервисе. См. [Flows & Stages](https://docs.goauthentik.io/add-secure-apps/flows-stages/) и раздел про default authentication flow в документации.

## TOTP (MFA)

Включение MFA делается через **stages**: enrollment TOTP для первичной привязки и стадия проверки одноразового кода на flow входа (в зависимости от версии — *Authenticator validation* или эквивалент). Секреты TOTP хранятся в Authentik. См. [Flows & Stages](https://docs.goauthentik.io/add-secure-apps/flows-stages/) и разделы про MFA.

## Профиль пользователя (имя, фамилия и др.)

В Authentik доступны в том числе:

- **username**, **email**, поле **name** (часто как отображаемое / полное имя);
- **`attributes`** — произвольные ключи (JSON), удобно для **имени и фамилии отдельно** (`given_name`, `family_name` или свои ключи).

Для входа через **GitHub** настройте **property mappings**, чтобы claims попадали в поля пользователя и `attributes`: [Property Mappings](https://docs.goauthentik.io/add-secure-apps/providers/property-mappings/).

Если нужно явно запрашивать имя и фамилию при **локальной регистрации** — используйте **enrollment flow** со стадией **Prompt** (и при необходимости политики); значения сохраняются в профиле и `attributes`.

## Ссылки

- [Docker Compose installation](https://docs.goauthentik.io/install-config/install/docker-compose/)
- [Users and Sources](https://docs.goauthentik.io/users-sources/sources/)
