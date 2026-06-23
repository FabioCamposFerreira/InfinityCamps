import axios from 'axios';

const API_KEY = 'c793a69d754bdae7776b0cc84536c4b6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function buscarClimaCidade(cidade) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: cidade,
        units: 'metric',
        lang: 'pt_br',
        appid: API_KEY
      }
    });

    const dados = response.data;

    return {
      cidade: dados.name,
      temperatura: Math.round(dados.main.temp),
      condicao: dados.weather[0].main,
      precipitacao: dados.clouds.all,
      umidade: dados.main.humidity
    };
  } catch (erro) {
    console.error('Erro ao buscar clima:', erro);
    throw new Error(`Não consegui encontrar a cidade: ${cidade}`);
  }
}

export function definirNivelAlerta(precipitacao, condicao) {
  if (precipitacao > 70 || condicao.toLowerCase().includes('rain')) {
    return 'vermelho';
  }
  if (precipitacao > 40) {
    return 'amarelo';
  }
  return 'verde';
}
