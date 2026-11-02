<!-- a ideia é transformar isso em um .cmd que realiza pergintar e cria um .md de regras otimizado para o projeto -->

# Regras para seguir estritamente

## Codigo geral

- Interface em portugues/ingles(??)
- Variaveis/nomes de funções do codigo em ingles
- variavis não podem ser resumidas, tipo usar "i" para interator, etc.
- Sempre tentar segmentar o maximo possivel o código/funções/omponentes para otmizar a modulariedade e rezudir redundancias e aumentar a manutenção. etc 
- Pririor sempre a reutilização de um componente/função, tente modificar ele se necessario ou quebrado em dois/ou mais se necessario. Só se não for possivel que deve criar um novo
- Ter sempre niveis de componentes/funções do tipo b
- Centralizae toda as configurações em `.env`: variáveis locais e segredos,etc
- Quando sugerir componentes ou libs, explique por que a exceção é necessária (ex.: `idb` para IndexedDB). Sempre prefira soluções nativas e leves.
- Sempre sugerir usar libs quando elas paresentam uma solução mais leve/rápida, ou simplifique o codigo
- comentario no inicio de todo arquivo salando qual é sua função

## Intercefe
- Não mostrar para o usuario nomes de caminhos, variaveis ids, textos técnicos ou instruções internas que o usuário final não precisa ver, como caminhos de arquivos, nomes de manifestos, detalhes de servidor, mensagens de depuração ou stack traces.
- - Registrar detalhes técnicos no console/logs para diagnóstico. Na interface, usar mensagens breves, claras e orientadas ao usuário.

## Autenticatio
- jwt, token, oauth, etc (a ideia é rodar o script e escolher aquela que melhor se encaixa)

<!-- TODO: criar um script que valida a estrutura de arquivos do projeto. Remocomendação: Agent.md, Todo.md,arquitetura.mdetc  -->