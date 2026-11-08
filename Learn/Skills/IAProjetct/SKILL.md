---
name: ia-project
description: Da comando para a ia exeutar com este estilo de programação com ia origentada.
---


# IA Project

Disponibiliza commandos e passo a passos para poder orientar a Ia no desenvolvimento do projeto.

Quando este skill é invocada ela vai exeutar o passo a passo abaixo.

Ele pode invocar esta skill com os parametros: -c / -check (vai executar o script para checar a estrutura dos arquivos e gerar tasks), -i / -incoerencies (a ia deve analisas os todos da pasta/projeto e encontrar incoerencias, regras conflitantes, redundancias das regras, arquivos que não seguem as regras dos projeto, etc), -t / -teste (executa o script RunTests.cmd)

## 1 Passo

try:
    if exist(Tasks.md && Agent.md && Rules.md && Arquiteture.md):
        do nothing
    else:
        run StartIAProject.cmd
    
catch:
    print: Ocorreu um erro ao criar os arquivos: {erro do console}
    return null (não exetutar os promixmos passos)

run passo 2

## Passo 2

read Rules.md
add context
read Arquiteture.md
add context
read Tasks.md
add context

var waitTime = 0 min
var tasksLeft = 0
to 1
print: Exsecutando tasks
for task in tasks.md:
    if task.stutus = backlog:
        print: Executando Task {tasks.number}
        execute task
    else:
        pass
print: Todas as tasks finalizadas
to 2
tasksLeft = read lenght(Tasks.md.stutus.backlog)
if tasksLef> 0:
    waitTime = 0 min
    go to 1
else:
    if exist parameter -check:
        run ProjectCheck.cmd
    if exist parameter -incoerencies:
        for file in *.md:
            found incoerencie
            if founded:
                create task in Tasks.md
    tests = run RunTests.cmd
    if exist tests.erro:
        for erro in tests.erro:
            create task in Tasks.md
    if waitTime < 5 min:
        print: Esperando o usuario analisar as respostas
        wait 1 min
        waitTime = waitTime + 1 min
        go to 2
    else:
        print: Sem tasks e tempo de espera finalizado. Se quise continuar, invoque novamete a skill
        return null (não fazer mais nada, só saia)


# Scripts

- Esta skill pode executar os scripts abaixo.
- Ao executar os scripts a IA deve usar o recurso de interação da propriea IDLE de perguntas com o usuario para ir respondendo as perguntas feitas pelo script

## StartIAProject.cmd

- Verifica se existe os arquivos Tasks.md && Agent.md && Rules.md && Arquiteture.md, e se não existir cria ele usando o template

## ProjectCheck.cmd

- Valida se existe os arquivos obrigados de arcordo com a arquitetura e senão existe nenhum arquivo a mais
-Para cada arquivo a mais ou a menos cria uma task in tasks.md

## TasksFormate.cmd

- Formata este arquivo usando 100% script
- Titula da tasks tudo maiusculo
- Corrige espacamentos
- ordena posiçao das tasks

## RunTests.cmd

- Executa os scripts de teste do app, se encontrado erro retorna o log

# Contexto

## Agent.md

??

## Rules.md

-Contem as regras do projeto, toda tasks que você executar você tem que que seguir estas regras. Elas são unamines. Caso não seja ´possivel retorna na tasks porque não pode seguir a regra e não faça nada, só informe o usuario  na resposta da task

## Arquiteture.md

- Contem a arquitetura do projeto, você não pode criar nenhum arquivo que quebre alguma regra da arquitetura. Elas são unamines. Caso não seja ´possivel retorna na tasks porque não pode seguir a regra e não faça nada, só informe o usuario na resposta da task

## Tasks.md

-cada task tem um titulo MD padrão por seu numero, status e tipo, os três são obrigatorios
-sempre ordenadas crescente pelo numero. Se estiver esrrada rode o script TasksFormate.cmd
-no titulo todas as letras maiusculas. Se estiver esrrada rode o script TasksFormate.cmd
-status: done (foi finalizada e deve ser lida somente para contexto da ia), pendent (a ia respondeu), becklog (a ia ainda não processou)
-tipos: ask (a ia não pode realizar nenhuma mudança no projeto), todo (a ia deve editar aquivos ou executar comando no terminal)
- só deve existir dois subtitulos: "## User" (obrigatorio), "## IA (opcional)". Não pode existir outros subitutuos, só dois e só estes
- deve validar ser eles tem conteudo tamboem >0. Se ia não existir não precisa validar conteudi
-A ia não pode alterar a respota do usuario, somente aplicar um corretor ortografico tanto em portugues, como ingles como na estrutura Markdown
-A IA só pode trabalhar em tasks com status backlog, e quando devolve uma resposta (seja sucesso ou falha) ela coloca para status pendente
- é o usario que analisa a resposta e coloca done ou volta para backlog para a ia trabalhar novamente com mais contexto que o usuario colocar mais contexto
- a ia só pode corrigir a artografia e estrutura da perunta do usuario, não pode mudar palavras ou informações a mais ou a menos


- Exemplo de arquivo tasks.md. Veja que as respostas curtas, direto ao ponto, informativas. Lembre se que o MD te permite ter links, tabela, explressoes latex, diff, blocos de código, etc.
- Na duvida sempre sente seguir o mesmo padrão de linguagem usado nas outras tasks ja projessadas do arquivo
 ```md
# 1 DONE [TODO]

## User

    Criar um arquivo index.html

## IA
    Arquivos index.html foi criado


# 2 PENDENT [ASK]

## User

    A recomendação é criar uma pasta chamada "CSS" ou "css"?

## IA
    

# 3 PENDENT [TODO]

## User

    Criar um arquivo styles.CSS

## IA
    Não criei arquivo styles.CSS porque vai comtra Rules.md que manda criar "styles.css" e tem que ser dentro da pasta "css"

# 4 BECKLOG [TODO]

## User

    Criar uma função de multiplicação em index.js

```

- Muitas vezers o usuaria, por praticidade vai escrever tasks que fogem totalmente da estrutura do arquivo, nestes casos, a IA vai primeiro formatar corretamente a estrutura da task. Veja exemplo do antes e depois
* Antes
```md
#
crie um arquivo index.html
```
* Depois
```md
# 5 PENDENT [TODO]

## User
    Crie o arquivo `index.html`.

## IA
    Arquivo ![index.html](./index.html) criado.
```

-Se não tiver status, ele é backlog
-o tipo é: se viver ponto final é todo, se tiver ? é ask. Se não tiver nada a IA que escolhe o tipo