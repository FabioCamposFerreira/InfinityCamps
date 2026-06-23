import { FaCloud, FaCloudRain } from 'react-icons/fa';

export default function CidadeCard({ cidade, temperatura, condicao, precipitacao, nivelAlerta }) {
  const obterCorAlerta = () => {
    switch (nivelAlerta) {
      case 'vermelho':
        return 'border-danger';
      case 'amarelo':
        return 'border-warning';
      default:
        return 'border-success';
    }
  };

  const obterIcone = () => {
    if (condicao.toLowerCase().includes('chuva') || condicao.toLowerCase().includes('rain')) {
      return <FaCloudRain size={40} className="text-primary" />;
    }
    return <FaCloud size={40} className="text-secondary" />;
  };

  const obterMensagemAlerta = () => {
    switch (nivelAlerta) {
      case 'vermelho':
        return '⚠️ ALERTA: Risco alto de atraso';
      case 'amarelo':
        return '⚠️ AMARELO: Monitore a situação';
      default:
        return '✅ VERDE: Seguro para entrega';
    }
  };

  return (
    <div className={`card mb-3 border-3 ${obterCorAlerta()}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {obterIcone()}
            <h5 className="card-title mt-2">{cidade}</h5>
          </div>
          <div className="text-end">
            <h3 className="mb-0">{temperatura}°C</h3>
            <p className="text-muted mb-2">{condicao}</p>
            <small className="text-secondary">Precipitação: {precipitacao}%</small>
          </div>
        </div>
        <div className="mt-3">
          <p className="mb-0 small">{obterMensagemAlerta()}</p>
        </div>
      </div>
    </div>
  );
}
