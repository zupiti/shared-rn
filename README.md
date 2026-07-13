# Shared RN

Biblioteca compartilhada de componentes e tema usada pelo main app, microapps e examples.

## O Que Exporta

- `LoadingScreen`
- `AppBar`
- `Card`
- `PrimaryButton`
- `theme`, `colors`, `spacing`, `radius`

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
