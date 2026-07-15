# Shared RN

Biblioteca compartilhada de componentes e tema usada pelo main app, microapps e examples.

## O Que Exporta

- `LoadingScreen`
- `AppBar`
- `Card`
- `PrimaryButton`
- `theme`, `colors`, `spacing`, `radius`
- **Request core** (`src/core/http`): `httpClient`, `configureHttpClient`, interceptors, `HttpError`, `mockAdapter` / `fetchAdapter`

### Request core

Todos os `services/` dos microapps MUST usar `httpClient` do `shared-rn` (não `fetch`/`axios` direto).

```ts
import {configureHttpClient, httpClient, mockAdapter} from 'shared-rn';

configureHttpClient({
  adapter: mockAdapter, // POC — troque por fetchAdapter + baseURL em produção
  getAuthToken: async () => token, // interceptor de Authorization
});

const response = await httpClient.get('/pedidos');
```

Interceptors padrão: header `X-Client`, auth Bearer via `getAuthToken`, cadeia de request/response/error.

## Consumidores

- `microapp-main-app-rn`
- `microapp1-rn`
- `microapp2-rn`
- `microapp3-rn`
- Examples dos microapps

## Uso Pelo Main App

O fluxo recomendado fica centralizado no main repo:

```sh
cd ../microapp-main-app-rn
yarn setup:microapps:local
yarn start
```

Para voltar as dependencias para Git refs:

```sh
cd ../microapp-main-app-rn
yarn point-local
```

## Desenvolvimento Da Lib

Rode comandos da lib apenas quando estiver trabalhando nela diretamente:

```sh
yarn typecheck
yarn prepare
```

Nao rode `yarn install` neste pacote no fluxo normal. As dependencias devem ser resolvidas pelo main app.
