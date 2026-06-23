import { useState } from 'react';

export default function InputCidade({ onAdicionar, onFechar }) {
  const [nomeCidade, setNomeCidade] = useState('');

  const handleBuscar = () => {
    if (nomeCidade.trim() === '') {
      alert('Digite o nome de uma cidade');
      return;
    }
    onAdicionar(nomeCidade);
    setNomeCidade('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="card mb-4 bg-light">
      <div className="card-body">
        <h5 className="card-title">Adicionar Nova Cidade</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Ex: São Paulo, Rio de Janeiro"
            value={nomeCidade}
            onChange={(e) => setNomeCidade(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success flex-grow-1" onClick={handleBuscar}>
            Buscar
          </button>
          <button className="btn btn-secondary" onClick={onFechar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
