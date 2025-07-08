# NgPessoas

Sistema de gerenciamento de pessoas desenvolvido em Angular 17 com Material Design.

## 📋 Descrição

O NgPessoas é uma aplicação web para cadastro e consulta de pessoas, desenvolvida com Angular 17 e Angular Material. O sistema permite cadastrar novas pessoas e consultar pessoas cadastradas através do CPF.

## 🚀 Funcionalidades Implementadas

### ✅ Cadastro de Pessoas

- Formulário em uma modal para cadastro de novas pessoas
- Validação de campos obrigatórios
- Validação de CPF
- Validação de e-mail
- Verificação de CPF único
- Máscara de CPF e telefone

### ✅ Consulta de Pessoas

- Busca de pessoas por CPF
- Exibição de todos os dados da pessoa encontrada
- Tratamento de erro para pessoa não encontrada
- Máscara de CPF
- Validação de CPF

### ✅ Validações Implementadas

- **CPF**: Validação do CPF com formato 000.000.000-00
- **Nome**: Mínimo 3 caracteres, máximo 100 caracteres
- **E-mail**: Validação de e-mail
- **Telefone**: Formato (00) 00000-0000
- **Sexo**: Opções: Masculino, Feminino, Outro

### ✅ Tecnologias Utilizadas

- **Angular 17** - Framework principal
- **Angular Material** - Componentes de UI
- **Reactive Forms** - Formulários reativos
- **RxJS** - Programação reativa
- **Jest** - Testes unitários
- **In-Memory Web API** - API simulada para desenvolvimento

## 🛠️ Passo a Passo para Configurar e Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/camilakadi/ng-pessoas.git
cd ng-pessoas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o servidor de desenvolvimento

```bash
npm start
# ou
ng serve
```

### 4. Acesse a aplicação

Abra o navegador e acesse: `http://localhost:4200`

## 🧪 Instruções para Rodar os Testes

### Executar todos os testes

```bash
npm test
# ou
npx jest
```

### Executar testes com coverage

```bash
npm run test:coverage
# ou
npx jest --coverage
```

### Executar testes em modo watch

```bash
npm run test:watch
# ou
npx jest --watch
```

### Executar testes em modo CI

```bash
npx jest --ci --coverage --watchAll=false
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── form-header/           # Cabeçalho do formulário
│   │   ├── pessoa-consulta/       # Componente de consulta
│   │   └── pessoa-form-modal/     # Modal de cadastro
│   ├── models/
│   │   └── pessoa.model.ts        # Interface Pessoa
│   ├── services/
│   │   └── pessoa.service.ts      # Serviço de CRUD
│   └── mocks/
│       └── in-memory-data.service.ts  # API simulada
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes unitários
- `npm run test:coverage` - Executa testes com coverage
- `npm run test:watch` - Executa testes em modo watch

## 📊 Dados de Exemplo

O sistema vem com 11 pessoas pré-cadastradas para teste:

- Camila Kadi (CPF: 543.134.150-25)
- Matheus Moreira (CPF: 611.129.480-66)
- Pedro Almeida Lima (CPF: 587.683.400-95)
- E outros...

## 🎯 Como Usar

1. **Consultar Pessoa**:

- Digite um CPF e clique em "Buscar"
- Limpar para resetar o campo

2. **Cadastrar Pessoa**:

- Clique no botão "Novo Cadastro" e preencha o formulário e clique em "Cadastrar",
- "Limpar" resetar os campos e "Cancelar" para fechar a modal

## 🔒 Validações de Segurança

- Validação do CPF
- Verificação de CPF único no sistema
- Validação de formato de e-mail
- Campos obrigatórios validados

## 📝 Licença

Este projeto foi desenvolvido por Camila.
