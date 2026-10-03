# Pokédex — Trabalho Final de Frameworks Web I

Aplicação web interativa desenvolvida em **React** que consome a **PokéAPI** (https://pokeapi.co/) para listar, buscar, filtrar e exibir detalhes de Pokémons.

## Integrantes

- Luiz Felipe
- _(adicione aqui os demais integrantes do grupo)_

## Funcionalidades

- **Listagem com paginação:** os Pokémons são exibidos em cards na página inicial, com paginação de 20 itens por página.
- **Página de detalhes:** rota dinâmica `/pokemon/:id` com arte oficial, tipos, altura, peso, habilidades e estatísticas.
- **Busca em tempo real:** o campo de busca filtra os resultados conforme o usuário digita.
- **Filtro por tipo:** é possível filtrar por qualquer um dos 18 tipos, combinável com a busca.
- **Feedback ao usuário:** indicador de carregamento durante as requisições e mensagens de erro amigáveis com opção de tentar novamente.

## Tecnologias utilizadas

- **React** com **Vite** (via TanStack Start)
- **Axios** para as requisições HTTP à PokéAPI
- **TanStack Router** para o roteamento entre páginas (equivalente ao react-router-dom)
- **Tailwind CSS** para a estilização
- Hooks **useState**, **useEffect** e **useMemo** para gerenciamento de estado

## Estrutura do projeto

```
src/
├── components/        # Componentes reutilizáveis (cards, paginação, header, feedback)
├── lib/pokeapi.ts     # Serviço de acesso à API (axios) e tipos TypeScript
├── routes/
│   ├── index.tsx      # Página inicial: listagem, busca, filtros e paginação
│   └── pokemon/$id.tsx # Página de detalhes de um Pokémon
└── styles.css         # Tema e estilos globais
```

## Como executar localmente

Pré-requisito: [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/trabalho-final-Frameworks_Web_I.git
cd trabalho-final-Frameworks_Web_I

# 2. Instale as dependências
npm install

# 3. Execute o servidor de desenvolvimento
npm run dev
```

Depois, acesse `http://localhost:8080` no navegador.

## API utilizada

[PokéAPI](https://pokeapi.co/) — API pública e gratuita com dados de todos os Pokémons. Endpoints utilizados:

- `GET /pokemon?limit=&offset=` — listagem paginada
- `GET /pokemon/{id}` — detalhes de um Pokémon
- `GET /type/{tipo}` — Pokémons de um tipo específico
