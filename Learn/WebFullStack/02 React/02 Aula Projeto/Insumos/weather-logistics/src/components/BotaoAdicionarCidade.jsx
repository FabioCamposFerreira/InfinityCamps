export default function BotaoAdicionarCidade({ onClick }) {
  return (
    <button className="btn btn-primary btn-lg w-100 mb-4" onClick={onClick}>
      + Adicionar Cidade
    </button>
  );
}
