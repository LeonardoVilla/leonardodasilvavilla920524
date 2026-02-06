# 🐾 Gerenciador de Pets - Frontend Next.js
🔗 **Aplicação em produção (Vercel):**  
[Acessar o projeto](https://leonardodasilvavilla920524-bshrsnqmh.vercel.app/)

Aplicação web moderna para gerenciamento de pets e tutores, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## Tutorial Docker

### Pré-requisitos
- Docker Desktop instalado e em execução

### Primeiro passo
- Clone este repositório e acesse a pasta do projeto antes de rodar os comandos Docker.

Windows (PowerShell):

```powershell
git clone https://github.com/LeonardoVilla/leonardodasilvavilla920524.git
cd leonardodasilvavilla920524

# Se preferir confirmar a pasta:
dir
```

Linux/macOS:

```bash
git clone https://github.com/LeonardoVilla/leonardodasilvavilla920524.git
cd leonardodasilvavilla920524

# Se preferir confirmar a pasta:
ls
```

### Passo a passo para executar o projeto com Docker (produção)

```bash
# Build e subida dos containers
docker compose up -d --build

# Verificar status
docker compose ps

# Ver logs do app
docker compose logs -f app
```

### Acesso
- Abra no navegador: http://localhost:3000

### Encerrar

```bash
docker compose down
```

## Informações do Projeto

- **Vaga**: ANALISTA DE TI - PERFIL PROFISSIONAL/ESPECIALIDADE - Engenheiro da Computação - Sênior 
- **Projeto:**: ANEXO II-B - Projeto Desenvolvedor Front End 
- **Data de Inscrição**: 27 de janeiro de 2026
- **Status**: ✅ Completo
- **Repositório**: Repositório Privado

## Funcionalidades Implementadas

### ✅ Requisitos Gerais
- [x] Consumo de dados em tempo real com `fetch`
- [x] Layout responsivo (mobile, tablet, desktop)
- [x] Tailwind CSS para estilização
- [x] Lazy Loading de rotas com App Router + `next/dynamic` (Pets e Tutores)
- [x] TypeScript com tipagem completa
- [x] Boas práticas de organização e componentização
- [x] Testes unitários básicos (Jest)

### ✅ Requisitos Específicos

#### 1. Tela Inicial - Listagem de Pets
- [x] GET `/v1/pets` - Listagem paginada
- [x] Cards com foto, nome, espécie, idade (e raça quando disponível)
- [x] Paginação (10 por página)
- [x] Busca por nome
- [x] Botão para novo pet

#### 2. Tela de Detalhamento do Pet
- [x] GET `/v1/pets/{id}` - Detalhes completos
- [x] Exibição de tutores vinculados
- [x] Destaque no nome do pet
- [x] Link para tutores
- [x] Editar pet

#### 3. Tela de Cadastro/Edição de Pet
- [x] POST `/v1/pets` - Novo pet
- [x] PUT `/v1/pets/{id}` - Editar pet
- [x] Campos: nome, espécie, idade, raça
- [x] Validações
- [x] Formulário responsivo

> Observação sobre **Espécie**: o frontend exibe `Espécie` quando a API retorna o campo e mostra **"Não informada"** quando não existir.
> Para não quebrar o CRUD caso a API ainda não aceite o campo, o app tenta enviar `especie` e, se receber erro **400**, faz um retry sem esse campo.

#### 4. Upload de Foto - Pet
- [x] POST `/v1/pets/{id}/fotos` - Upload
- [x] Exibição da foto no card
- [x] DELETE `/v1/pets/{id}/fotos/{fotoId}` - Remover

#### 5. Tela de Cadastro/Edição de Tutor
- [x] POST `/v1/tutores` - Novo tutor
- [x] PUT `/v1/tutores/{id}` - Editar tutor
- [x] Campos: nome, telefone, endereço, email, CPF
- [x] Máscaras de input (CPF, telefone)
- [x] Validações

#### 6. Upload de Foto - Tutor
- [x] POST `/v1/tutores/{id}/fotos` - Upload
- [x] DELETE `/v1/tutores/{id}/fotos/{fotoId}` - Remover

#### 7. Detalhamento do Tutor
- [x] GET `/v1/tutores/{id}` - Detalhes com pets
- [x] Listagem de pets vinculados
- [x] POST `/v1/tutores/{id}/pets/{petId}` - Vincular pet
- [x] DELETE `/v1/tutores/{id}/pets/{petId}` - Desvincular pet

#### 8. Autenticação
- [x] POST `/autenticacao/login` - Login com JWT
- [x] PUT `/autenticacao/refresh` - Renovação de token
- [x] Gerenciamento de tokens no localStorage

### ✅ Requisitos para Sênior
- [x] Health Checks
- [x] Testes unitários (10+ testes)
- [x] Padrão Facade com BehaviorSubject (RxJS)
- [x] Lazy Loading de rotas

## Arquitetura

```
src/
├── app/                       # App Router, paginas e layout
│   ├── api/
│   │   └── health/route.ts    # Health check
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Listagem de pets
│   ├── login/
│   │   └── page.tsx           # Pagina de login
│   ├── pets/
│   │   ├── [id]/
│   │   │   ├── page.tsx        # Wrapper da rota dinamica
│   │   │   └── PetDetailPage.tsx
│   │   └── layout.tsx          # Lazy loading
│   └── tutores/
│       ├── page.tsx            # Wrapper da listagem
│       ├── TutoresPage.tsx
│       ├── [id]/
│       │   ├── page.tsx        # Wrapper da rota dinamica
│       │   └── TutorDetailPage.tsx
│       └── layout.tsx          # Lazy loading
├── components/                # Componentes reutilizaveis
│   ├── Footer.tsx
│   ├── LoginModal.tsx
│   ├── Navbar.tsx
│   ├── PetForm.tsx
│   ├── PetsCarousel.tsx
│   ├── TutorForm.tsx
│   └── __tests__/
│       ├── Navbar.test.tsx
│       ├── PetForm.test.tsx
│       └── TutorForm.test.tsx
├── hooks/                     # Hooks customizados
│   └── useAuth.ts             # Autenticacao e sessao
├── services/                  # Logica de API (Facade Pattern)
│   ├── api.test.ts
│   ├── api.ts
│   ├── auth.ts
│   ├── baseUrl.ts
│   ├── facade.ts
│   ├── pets.ts
│   ├── storage.ts
│   └── tutores.ts
├── types/                     # Tipos TypeScript
│   ├── api.ts
│   └── jest-dom.d.ts
└── utils/                     # Utilitarios
    ├── validation.test.ts
    └── validation.ts

public/
└── icone-de-cao-e-gato.avif

middleware.ts                 # Middleware do Next.js
```

## Como Executar

### Pré-requisitos
- Node.js 18+
- pnpm ou npm

### Instalação Local

```bash
# Instalar dependências
pnpm install

# Se voce nao tiver pnpm instalado
npm install

# Configurar variáveis de ambiente
echo 'NEXT_PUBLIC_API_URL=https://pet-manager-api.geia.vip' > .env.local

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir no navegador: http://localhost:3000
```

### Credenciais Padrão
- **Username**: admin
- **Password**: admin

## Testes

### Local (recomendado)

```bash
# Executar testes
pnpm test

# Teste com cobertura
pnpm test:coverage
```

### Docker

> Observacao: a imagem de runtime instala apenas dependencias de producao, entao os testes nao rodam dentro do container final.

```bash
# Executar testes usando o stage de build
docker build --target builder -t pet-manager-builder .
docker run --rm pet-manager-builder pnpm test
```

### Testes Implementados
- ✅ Validações (CPF, email, telefone, nome, idade)
- ✅ Máscaras (CPF, telefone)
- ✅ apiFetch com autenticação
- ✅ Tratamento de erros
- ✅ Componentes: Navbar, PetForm, TutorForm, Footer, LoginModal, PetsCarousel
- ✅ Hook: useAuth
- ✅ Services: auth, pets, tutores, facade, baseUrl, storage
- ✅ 10+ testes unitários

## Docker

```bash
# Build da imagem
docker build -t pet-manager:latest .

# Executar container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://pet-manager-api.geia.vip pet-manager:latest

# Com docker-compose (producao)
docker compose up -d --build
```

## Build para Produção

```bash
pnpm build
pnpm start
```

## API Integration

Base URL: `https://pet-manager-api.geia.vip`

### Endpoints Implementados
- ✅ POST `/autenticacao/login` - Login
- ✅ PUT `/autenticacao/refresh` - Renovar token
- ✅ GET/POST/PUT/DELETE `/v1/pets` - CRUD de pets
- ✅ POST/DELETE `/v1/pets/{id}/fotos` - Fotos de pets
- ✅ GET/POST/PUT/DELETE `/v1/tutores` - CRUD de tutores
- ✅ POST/DELETE `/v1/tutores/{id}/fotos` - Fotos de tutores
- ✅ POST/DELETE `/v1/tutores/{id}/pets/{petId}` - Vincular/desvincular pets

## Features Principais

### Autenticação
- ✅ Login com JWT
- ✅ Refresh token automático
- ✅ Proteção de rotas
- ✅ Logout seguro

### Validações
- ✅ CPF (validação real)
- ✅ Email
- ✅ Telefone (10 e 11 dígitos)
- ✅ Nome (mínimo 3 caracteres)
- ✅ Idade (1 a 50 anos)

### Máscaras
- ✅ CPF: `000.000.000-00`
- ✅ Telefone: `(00) 90000-0000` ou `(00) 0000-0000`

### UX/UI
- ✅ Paginação intuitiva
- ✅ Busca em tempo real
- ✅ Loading indicators
- ✅ Mensagens de erro amigáveis
- ✅ Modais para ações
- ✅ Responsivo

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

## Tecnologias

- Next.js 16.1.4
- TypeScript 5
- Tailwind CSS 3
- Jest
- Docker
- pnpm

## Checklist de Entrega

- [x] Implementação completa dos requisitos
- [x] Layout responsivo
- [x] TypeScript com tipagem
- [x] 10+ testes unitários
- [x] Lazy Loading de rotas
- [x] Docker & docker-compose
- [x] README detalhado
- [x] Commits pequenos e explicativos
- [x] Clean Code
- [x] Tratamento de erros

## O que não foi feito (solicitado no edital, mas não consta na API)

- **Campo “espécie” do pet**: solicitado no edital, porém a documentação da API não expõe esse campo nos DTOs de pet e não retorna esse dado nos endpoints de pets. Por isso, não foi implementado no formulário, listagem e detalhamento.

---

**Data de Conclusão**: 02 de fevereiro de 2026  
**Status**: ✅ Completo  
**Versão**: 1.0.0
