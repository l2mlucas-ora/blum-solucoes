# Site Blum Soluções

Site institucional, link da bio e assistente de orçamento da **Blum Soluções**: elétrica e segurança eletrônica em Garopaba (SC) e região.
A arquitetura é a mesma do projeto Target: Astro estático e Cloudflare Pages, com uma Function de lead.

## Rodar

```bash
npm install
npm run dev          # http://localhost:4321  (sem /api/lead)
npm test             # /api/lead + roteiros do assistente (3 idiomas) + build + checagem de idiomas/links
npm run build && npx wrangler pages dev dist --binding LEAD_DEBUG=1   # com /api/lead, porta 8788
```

## Onde mudar o quê

| Quero mudar… | Arquivo |
|---|---|
| WhatsApp, horário, cidades atendidas, Instagram, CNPJ, domínio | `src/data/site.ts` (e `site` em `astro.config.mjs`) |
| Endereços das páginas em PT/EN/ES (slugs) | `src/i18n/routes.ts` |
| Textos de menu, rodapé, assistente, formulário e cookies (3 idiomas) | `src/i18n/ui.ts` |
| Serviços: textos, itens, FAQ e foto (3 idiomas) | `src/data/servicos.ts` |
| Perguntas gerais (home e busca do assistente, 3 idiomas) | `src/data/faq.ts` |
| Roteiro do assistente | `src/data/chat/pt.ts`, `en.ts`, `es.ts` (mesmos nós nos três) |
| Valores do pré-orçamento (ligar ou desligar) | `src/data/precos.ts` |
| Botões e campanhas da bio (`/bio/`, `/en/bio/`, `/es/bio/`, `?d=<id>`) | `src/data/bio.ts` |
| Textos das páginas | `src/views/*.astro` (cada view tem o dicionário PT/EN/ES no topo) |
| Fotos de obras (book/carrossel por serviço) | `src/data/portfolio.ts` + arquivos em `public/img/obras/` |
| Ponto de foco das fotos no celular | `src/data/fotos.ts` |
| Formação do responsável técnico | `src/data/site.ts` → `responsavel` |
| Cores, fontes e componentes visuais | `src/styles/global.css` (tokens no topo) |
| Logo | `public/img/logo-simbolo.svg`; originais e variantes em `brand/` |
| Envio de leads (e-mail, webhook, anti-spam) | `functions/api/lead.ts` |

## Idiomas (PT / EN / ES)

Todo o site, a bio e o assistente existem em português, inglês e espanhol. O seletor fica no cabeçalho e na bio (ícone de globo) e abre a mesma página no outro idioma.

| Página | PT | EN | ES |
|---|---|---|---|
| Home | `/` | `/en/` | `/es/` |
| Serviços | `/servicos/eletrica/` | `/en/services/electrical/` | `/es/servicios/electricidad/` |
| Casa de temporada | `/casa-de-temporada-garopaba/` | `/en/vacation-rental-garopaba/` | `/es/casa-de-temporada-garopaba/` |
| Bio | `/bio/` | `/en/bio/` | `/es/bio/` |

Leads de clientes estrangeiros chegam com o campo `idioma` (EN/ES) e o produto marcado com `[EN]` ou `[ES]`. A mensagem do WhatsApp chega no idioma do cliente, para a equipe responder nele.

`npm run check:i18n` confere no site gerado o hreflang, o `<html lang>` e se algum link interno quebrou ou aponta para outro idioma.

## Assistente

O assistente não usa IA. É um roteiro de botões (`src/data/chat/{pt,en,es}.ts`) executado por `src/scripts/chat.ts`, portado da Target. Os caminhos são:

- **Serviço → pré-orçamento.** Faz de 2 a 3 perguntas de qualificação. Depois mostra a faixa de preço se `precos.ts` estiver confirmado; se não estiver, mostra "sob consulta". Em seguida oferece visita ou WhatsApp.
- **Visita técnica.** Pede o serviço, a cidade (lista da região ou outra), o bairro, o dia (os próximos 5 dias úteis, conforme o horário em `site.ts`) e o período. A confirmação do horário é feita pela equipe, no WhatsApp.
- **Emergência.** Orienta sobre segurança, informa o telefone da Celesc e leva direto ao WhatsApp.
- **Dúvidas.** Busca por palavra-chave em todas as FAQs do site.
- **Lead.** Pede nome e WhatsApp e o consentimento LGPD. Envia para `/api/lead` com a origem `orcamento`, `visita` ou `chatbot` e, em seguida, oferece o WhatsApp com o resumo da conversa.

Qualquer botão com `data-chat-open="<nó>"` abre o assistente direto naquele ponto. Por exemplo, `data-chat-open="vis_servico"` vai para o agendamento.

`npm test` confere os três roteiros: mesmos nós em todos, nó inexistente, nó órfão, fala com `undefined` e botão sem destino.

## Variáveis de ambiente (Cloudflare Pages → Settings → Variables)

Todas são opcionais: sem nenhuma delas, o assistente e o formulário encaminham o cliente para o WhatsApp.

| Variável | Para quê |
|---|---|
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Envia cada lead por e-mail, com botão "Responder no WhatsApp" |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | Envia o lead em JSON para um CRM, planilha ou automação (Make, n8n, Zapier) |
| `TURNSTILE_SECRET`, `PUBLIC_TURNSTILE_SITEKEY` | Anti-spam do Cloudflare Turnstile |
| `PUBLIC_GA_ID` | Google Analytics 4, carregado só após o aceite de cookies |
| `LEAD_DEBUG=1` | Somente em desenvolvimento: aceita o lead sem destino e só registra no log |

## Fotos novas de obras

1. Coloque os originais em `fotos-novas/`. **Não use `dist/`**: o build apaga e recria essa pasta.
2. Cada foto é otimizada para `public/img/obras/<nome>.webp` (até 1200 px, WebP) e ganha uma linha em `src/data/portfolio.ts`, com o serviço e a legenda em PT/EN/ES.
3. Se o corte no celular esconder o principal, ajuste o foco em `src/data/fotos.ts`.

O book aparece na home, com filtros por serviço, e na página de cada serviço que tiver 2 fotos ou mais. Ele passa sozinho para o lado a cada ~4 s e pausa quando a pessoa toca, arrasta ou passa o mouse.

## Prévia para o cliente (GitHub Pages)

Link provisório: **https://l2mlucas-ora.github.io/blum-solucoes/** (bio: `…/blum-solucoes/bio/`).

Para atualizar a prévia depois de uma mudança, faça o commit e rode:

```bash
npm run previa
```

O comando roda os testes, gera o site na subpasta `/blum-solucoes/` e envia para a branch `gh-pages`. O GitHub publica em 1–2 minutos. Diferenças em relação ao site definitivo:

- **Fica fora do Google:** `noindex` em todas as páginas.
- **Sem `/api/lead`:** o GitHub Pages não roda Functions. O assistente e o formulário levam o cliente direto ao WhatsApp, com a conversa pronta.
- **Endereços na subpasta:** o código usa caminhos começando em `/`, e o `scripts/aplicar-base.mjs` prefixa `/blum-solucoes` no site gerado.

## Deploy

Cloudflare Pages conectado ao GitHub, com estas configurações:

- Build: `npm run build`
- Saída: `dist`
- `NODE_VERSION=22`

O endereço provisório `*.pages.dev` recebe `noindex` automaticamente (`functions/_middleware.ts`). Para colocar o domínio próprio, veja `MIGRACAO.md`. O que ainda falta do cliente está em `PENDENCIAS.md`.
