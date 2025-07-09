# 🧪 Teste Técnico - Teddy Open Finance

Este projeto foi desenvolvido como parte do processo seletivo para a **Teddy Open Finance**. O objetivo principal é construir uma **API para encurtamento de URLs**, com suporte a cadastro de usuários, autenticação e gerenciamento de URLs individuais.

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) é um framework Node.js com TypeScript, baseado em módulos e injeção de dependência. Ideal para construir **APIs escaláveis e performáticas**, como este encurtador de links.
- [Prisma](https://www.prisma.io/) é um ORM moderno que facilita o acesso ao banco de dados com **tipagem segura e comandos simples** para criar, ler, atualizar e deletar dados.  
- [PostgreSQL](https://www.postgresql.org/) é um banco de dados relacional robusto e open-source, usado para **armazenar usuários, URLs e dados de autenticação**.
- [Swagger](https://swagger.io/) gera a **documentação interativa da API** automaticamente, com base nos decorators do NestJS. Permite visualizar e testar endpoints facilmente. 
- [Logger](https://docs.nestjs.com/techniques/logger) padrão do Nest para registrar informações, erros e ações da aplicação, ajudando no **debug e monitoramento**.


---

## 🧱 Funcionalidades da API

✔️ Encurtamento de URLs, com ou sem autenticação  
✔️ Cadastro e login de usuários  
✔️ Redirecionamento de URLs encurtadas  
✔️ Listagem de URLs por usuário autenticado  
✔️ Atualização e exclusão de URLs  
✔️ Suporte a autenticação via Bearer Token  
✔️ Documentação interativa com Swagger  
✔️ Logs centralizados com Logger

---

## 📋 Pré-requisitos

- O sistema foi desenvolvido com a **última versão estável do Node.js**.
- É necessário ter o **PostgreSQL** instalado e rodando localmente para persistência dos dados.
- É recomendado ter o **Yarn** ou **npm** para gerenciar as dependências do projeto.
- Para facilitar a execução, é possível utilizar **Docker** com `docker-compose`.

  > ❗ Caso **não utilize Docker**, será necessário configurar o ambiente manualmente:
  > - Garantir que o PostgreSQL esteja rodando localmente
  > - Criar um arquivo `.env` na raiz do projeto com as variáveis necessárias:
  >
  > ```env
  > DATABASE_URL=
  > JWT_SECRET=
  > REDIS_URL=
  > ```
  > Um exemplo completo pode ser encontrado no arquivo `.env.example`.


## ⚙️ Como executar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/Gleis0nLemos/shorter-url
cd shorter-url
```

> ### Caso não use Docker, execute esses comandos 

1. Instale todas as dependências
```bash
npm install
```
2. Inicie a API
```bash
npm run start:dev
```
3. Em um terminal a parte, rode as migrações que geram as tabelas do banco
```bash
npm run migrate
```
