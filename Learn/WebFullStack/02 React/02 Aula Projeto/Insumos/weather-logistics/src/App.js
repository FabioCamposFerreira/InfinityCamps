import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import CidadeCard from './components/CidadeCard';
import BotaoAdicionarCidade from './components/BotaoAdicionarCidade';
import InputCidade from './components/InputCidade';
import { buscarClimaCidade, definirNivelAlerta } from './services/weatherService';

export default function App() {
  const [cidades, setCidades] = useState([]);
  const [mostraInput, setMostraInput] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleAdicionarCidade = async (nomeCidade) => {
    setCarregando(true);
    setErro('');

    try {
      const dadosClima = await buscarClimaCidade(nomeCidade);
      const nivelAlerta = definirNivelAlerta(dadosClima.precipitacao, dadosClima.condicao);

      const novaCidade = {
        id: Date.now(),
        ...dadosClima,
        nivelAlerta
      };

      setCidades((prev) => [...prev, novaCidade]);
      setMostraInput(false);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleRemoverCidade = (idCidade) => {
    setCidades((prev) => prev.filter((cidade) => cidade.id !== idCidade));
  };

  return (
    <div className="app-container">
      <header className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <h1>🚚 Dashboard de Monitoramento de Clima</h1>
          <p className="mb-0">Logística & Entregas</p>
        </div>
      </header>

      <div className="container">
        {!mostraInput && <BotaoAdicionarCidade onClick={() => setMostraInput(true)} />}

        {mostraInput && (
          <InputCidade onAdicionar={handleAdicionarCidade} onFechar={() => setMostraInput(false)} />
        )}

        {carregando && (
          <div className="alert alert-info">⏳ Buscando dados de clima...</div>
        )}

        {erro && (
          <div className="alert alert-danger" role="alert">❌ {erro}</div>
        )}

        <div className="cidades-lista">
          {cidades.length === 0 ? (
            <div className="alert alert-secondary text-center">
              Nenhuma cidade adicionada ainda. Clique em "Adicionar Cidade" para começar.
            </div>
          ) : (
            cidades.map((cidade) => (
              <div key={cidade.id} className="position-relative">
                <CidadeCard
                  cidade={cidade.cidade}
                  temperatura={cidade.temperatura}
                  condicao={cidade.condicao}
                  precipitacao={cidade.precipitacao}
                  nivelAlerta={cidade.nivelAlerta}
                />
                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoverCidade(cidade.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
