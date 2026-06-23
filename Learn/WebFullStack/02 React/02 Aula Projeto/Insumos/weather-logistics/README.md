# Weather Logistics

App React para monitoramento de clima voltado para logística.

## Como rodar

1. Abra o terminal em `weather-logistics`
2. Instale dependências se ainda não tiver:

```bash
npm install
```

3. Inicie o app:

```bash
npm start
```

4. Abra `http://localhost:3000`

## Configuração da API

Antes de usar, substitua `SUA_API_KEY_DO_OPENWEATHER` em `src/services/weatherService.js` pela sua chave do OpenWeather.

## Estrutura principal

- `src/App.js` — componente principal
- `src/components/` — componentes UI
- `src/services/weatherService.js` — lógica de chamada da API
- `src/App.css` — estilos customizados
