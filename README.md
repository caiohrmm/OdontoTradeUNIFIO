# OdontoTrade

**Plataforma de compra e venda de materiais odontológicos entre estudantes da UNIFIO.**

---

## UNIFIO — Centro Universitário de Ourinhos

Projeto integrador desenvolvido por uma turma da **UNIFIO (Centro Universitário de Ourinhos)** com o objetivo de conectar alunos do curso de Odontologia para comprar, vender e trocar materiais usados no curso.

---

## O problema que queremos resolver

No curso de Odontologia, os estudantes **sempre precisam de novos materiais** para as disciplinas e práticas. Ao mesmo tempo, muitos têm em casa **materiais que já não usam** — de períodos anteriores, mudança de etapa do curso ou itens que sobraram.

Isso gera:

- **Gasto alto** com materiais novos quando há oferta de usados em bom estado.
- **Acúmulo** de materiais sem uso, ocupando espaço e sem destino.
- **Falta de um canal seguro e confiável** dentro da própria faculdade para esse tipo de negociação.

## O que o OdontoTrade faz

O **OdontoTrade** é uma plataforma pensada para o ambiente acadêmico da UNIFIO que permite:

- **Anunciar** materiais que você quer vender ou que não usa mais.
- **Buscar** materiais que outros alunos estão oferecendo, por categoria e filtros.
- **Organizar** anúncios por categorias (ex.: aparelhos, kits, livros).
- **Fotos** dos produtos via upload (Cloudinary).
- **Contato e negociação** entre comprador e vendedor — **sem intermediação de pagamento** pela plataforma (o combinado é entre os usuários).

Assim, quem precisa comprar encontra oferta dentro da faculdade, e quem quer se desapegar dá destino útil aos materiais.

---

## Equipe

| Nome | Atuação |
|------|--------|
| **Caio Henrique Rodrigues Martins** | Backend, banco de dados, deploy, aprovações e integrações; eventual apoio no frontend. |
| **Luis Felipe Viol** | Coleta de requisitos, análise de negócios com o público-alvo e documentação do software. |
| **Luiz Vinicius T. Auersvald** | Coleta de requisitos, análise de negócios com o público-alvo e documentação do software. |
| **Gabriel Messias** | Construção do frontend, conexão com a API e design. |
| **Vitor Lurici** | Construção do frontend, conexão com a API e design. |

---

## Visão geral deste repositório

Este repositório contém o **backend** do OdontoTrade: uma API REST em **Spring Boot** que oferece:

- Autenticação (registro e login com JWT)
- CRUD de anúncios (listings) com filtros e paginação
- Categorias para organizar os anúncios
- Upload de imagens (Cloudinary) — a API devolve a URL para usar nos anúncios
- Marcação de anúncio como vendido ou reservado

O frontend e a documentação de produto ficam em outros repositórios ou entregas da equipe.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Rodar localmente](#rodar-localmente)
- [Configurar banco (Neon)](#configurar-banco-neon-postgresql-na-nuvem)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [API: visão geral](#api-visão-geral)
- [Autenticação (JWT)](#autenticação-jwt)
- [Anúncios (Listings)](#anúncios-listings)
- [Upload de imagens (Cloudinary)](#upload-de-imagens-cloudinary)
- [Categorias](#categorias)
- [Endpoints técnicos](#endpoints-técnicos)
- [CORS e frontend](#cors-e-frontend)
- [Convenções do repositório](#convenções-do-repositório)

---

## Pré-requisitos

Para rodar o backend na sua máquina você precisa de:

| Item | Versão / Observação |
|------|----------------------|
| **Java** | 17 |
| **Maven** | 3.8+ |
| **Docker + Docker Compose** | Para subir o PostgreSQL local (recomendado para desenvolvimento) |
| **Conta Neon** | Opcional; para usar PostgreSQL na nuvem em vez do Docker |

---

## Rodar localmente

Passo a passo para subir a API no seu computador usando PostgreSQL no Docker.

### 1. Clonar o repositório (se ainda não tiver)

```bash
git clone <url-do-repositorio>
cd projetointegrador1
```

### 2. Subir o PostgreSQL

```bash
docker compose up -d
```

Isso sobe um container com PostgreSQL 16 na porta **5432**, banco **desapego**, usuário e senha **desapego** (configurados no `docker-compose.yml`).

### 3. Rodar a aplicação

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 4. Testar

- **API:** [http://localhost:8080](http://localhost:8080)
- **Health:** [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
- **Swagger (documentação interativa):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

No Swagger você pode testar registro, login, listagem de anúncios, categorias e upload (se tiver Cloudinary configurado).

---

## Configurar banco (Neon — PostgreSQL na nuvem)

Se preferir não usar Docker e conectar a um banco na nuvem:

1. Crie uma conta no [Neon](https://neon.tech) e um projeto.
2. Copie a **connection string** (algo como `postgresql://user:password@host/dbname?sslmode=require`).
3. Defina as variáveis de ambiente abaixo (ou use um arquivo `.env` que **não** seja commitado):

| Variável | Descrição |
|----------|-----------|
| `SPRING_DATASOURCE_URL` | URL JDBC. Formato: `jdbc:postgresql://HOST/NOME_DO_BANCO?sslmode=require` (substitua HOST e NOME_DO_BANCO pelos valores do Neon). |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco. |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco. |

**Exemplo no terminal (Linux/macOS):**

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
export SPRING_DATASOURCE_USERNAME="seu_usuario"
export SPRING_DATASOURCE_PASSWORD="sua_senha"
mvn spring-boot:run
```

**Exemplo no Windows (PowerShell):**

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME="seu_usuario"
$env:SPRING_DATASOURCE_PASSWORD="sua_senha"
mvn spring-boot:run
```

Se essas variáveis não forem definidas, a aplicação usa por padrão `localhost:5432`, compatível com o `docker-compose.yml`.

---

## Variáveis de ambiente

Resumo das variáveis que você pode precisar:

| Variável | Obrigatória? | Descrição |
|----------|----------------|-----------|
| `SPRING_DATASOURCE_URL` | Não (default: localhost) | URL JDBC do PostgreSQL. |
| `SPRING_DATASOURCE_USERNAME` | Não | Usuário do banco. |
| `SPRING_DATASOURCE_PASSWORD` | Não | Senha do banco. |
| `JWT_SECRET` | Não (há default de dev) | Chave para assinar o JWT. Em produção use um valor forte e único (mín. 32 caracteres). |
| `JWT_EXPIRATION_MS` | Não | Validade do token em milissegundos (ex.: 86400000 = 24h). |
| `FRONTEND_ORIGIN` | Não | Origem permitida para CORS (ex.: `http://localhost:3000`). |
| `CLOUDINARY_CLOUD_NAME` | Para upload | Nome da cloud no Cloudinary. |
| `CLOUDINARY_API_KEY` | Para upload | API key do Cloudinary. |
| `CLOUDINARY_API_SECRET` | Para upload | API secret do Cloudinary. |
| `CLOUDINARY_FOLDER` | Não | Pasta no Cloudinary (default: `desapego`). |
| `CLOUDINARY_MAX_FILE_SIZE_MB` | Não | Tamanho máximo do arquivo em MB (default: 5). |

---

## Stack técnica

| Item | Tecnologia |
|------|------------|
| Linguagem | Java 17 |
| Framework | Spring Boot 3 |
| Banco de dados | PostgreSQL (Neon ou Docker local) |
| ORM | Spring Data JPA (Hibernate) |
| Migrações | Flyway |
| Documentação da API | OpenAPI/Swagger (springdoc) |
| Autenticação | JWT (Spring Security) |
| Upload de imagens | Cloudinary |
| Build | Maven |

---

## API: visão geral

- **Base URL (local):** `http://localhost:8080`
- **Prefixo da API:** `/api/v1`
- **Documentação interativa:** [Swagger UI](http://localhost:8080/swagger-ui.html) (quando a aplicação estiver rodando)
- **OpenAPI (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

A maioria dos endpoints de negócio exige autenticação via header:

```http
Authorization: Bearer <seu_token_jwt>
```

O token é obtido em **POST /api/v1/auth/register** ou **POST /api/v1/auth/login**.

---

## Autenticação (JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/api/v1/auth/register` | Registrar usuário (nome, e-mail, senha). Retorna token JWT. |
| **POST** | `/api/v1/auth/login` | Login (e-mail, senha). Retorna token JWT. |
| **GET** | `/api/v1/users/me` | Dados do usuário logado. Requer `Authorization: Bearer <token>`. |

Exemplo de corpo para registro e login:

```json
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

Para login, use apenas `email` e `password`.

---

## Anúncios (Listings)

CRUD de anúncios com listagem paginada e filtros. **Consultas (listar e buscar por ID)** são públicas; **criar, editar e excluir** exigem autenticação e apenas o **dono** do anúncio pode editar ou excluir.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/api/v1/listings` | Criar anúncio (auth). Body: `title`, `description?`, `price?`, `categoryId?`, `imageUrls?`. |
| **GET** | `/api/v1/listings` | Listar (público). Query: `status?`, `sellerId?`, `categoryId?`, `search?`, `page=0`, `size=20`. |
| **GET** | `/api/v1/listings/{id}` | Buscar por ID (público). |
| **PUT** | `/api/v1/listings/{id}` | Atualizar (auth, dono). Campos opcionais: `title`, `description`, `price`, `status`, `categoryId`, `imageUrls`. |
| **DELETE** | `/api/v1/listings/{id}` | Excluir (auth, dono). |

- **Status:** `ACTIVE`, `SOLD`, `RESERVED` (para marcar como vendido ou reservado).
- **Imagens:** lista de URLs em `imageUrls`; as URLs podem ser obtidas pelo [endpoint de upload](#upload-de-imagens-cloudinary).
- **Categoria:** opcional; use `categoryId` no body e no filtro da listagem.

---

## Upload de imagens (Cloudinary)

Para anúncios com foto, o frontend (ou um cliente) envia a imagem para este endpoint; a API envia para o **Cloudinary** e devolve a **URL** para colocar em `imageUrls` do anúncio.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | `/api/v1/upload` | Enviar imagem (auth). `multipart/form-data`, campo **file**. Formatos: JPEG, PNG, GIF, WebP. Retorna `{ "data": { "url": "https://..." } }`. |

**Configuração:** defina no ambiente (valores no [Dashboard Cloudinary](https://console.cloudinary.com)):

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Opcionais: `CLOUDINARY_FOLDER` (default: `desapego`), `CLOUDINARY_MAX_FILE_SIZE_MB` (default: 5).  
Sem credenciais, o endpoint retorna **503** (Upload não configurado).

---

## Categorias

Categorias organizam os anúncios (ex.: Aparelhos, Kits, Livros). **Listar e buscar por ID** são públicos; **criar, editar e excluir** exigem autenticação.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **GET** | `/api/v1/categories` | Listar todas (público). Ordenado por nome. |
| **GET** | `/api/v1/categories/{id}` | Buscar por ID (público). |
| **POST** | `/api/v1/categories` | Criar (auth). Body: `name`, `slug?`, `description?`. |
| **PUT** | `/api/v1/categories/{id}` | Atualizar (auth). |
| **DELETE** | `/api/v1/categories/{id}` | Excluir (auth). Anúncios da categoria ficam sem categoria. |

O **slug** é um identificador único (ex.: `aparelhos`). Se não for informado, é gerado a partir do nome.

---

## Endpoints técnicos

| Endpoint | Descrição |
|----------|-----------|
| **GET** `/api/v1/health` | Healthcheck da API (status + timestamp). |
| **GET** `/actuator/health` | Health do Spring Boot Actuator. |
| **GET** `/swagger-ui.html` | Interface Swagger UI. |
| **GET** `/v3/api-docs` | Especificação OpenAPI em JSON. |

---

## CORS e frontend

O backend aceita requisições do frontend cuja origem estiver em **FRONTEND_ORIGIN**. Valor padrão: `http://localhost:3000`. Para mais de uma origem, use uma lista separada por vírgula (ex.: `http://localhost:3000,https://odontotrade.unifio.edu.br`).

---

## Convenções do repositório

- **Prefixo da API:** `/api/v1`
- **Pacote base:** `br.edu.unifio.odonto.desapego`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (ex.: `feat:`, `fix:`, `docs:`)
- **Branch principal:** `main`

Para regras de contribuição, branches e PRs, veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licença

Projeto acadêmico — **UNIFIO Centro Universitário de Ourinhos**.
