# Pendências com o cliente

O site já funciona, mas os itens abaixo dependem de material ou confirmação da Blum. Nada disso impede a prévia de ir ao ar.

## Conteúdo e marca
- [x] **Logo oficial** recebido em 03/10/2026. O símbolo foi vetorizado (`public/img/logo-simbolo.svg`, `public/favicon.svg`) e as variantes branco, grafite e colorido estão em `brand/`.
- [x] **Fotos de obras** recebidas em 03/10/2026 (igreja antes/depois, perfil de LED, loja com trilhos, sanca, eletroposto, câmeras Intelbras), em `public/img/obras/`.
- [ ] **Confirmar as legendas das obras.** Escrevi a partir das fotos: "Igreja em Garopaba", "loja de colchões", "eletroposto". A cidade e os detalhes podem estar errados. Se o cliente autorizar, dá para citar nomes (ex.: Eletroposto Nestor).
- [ ] **Foto do responsável em boa resolução** para a página Sobre. Hoje é um recorte de Reels (360 px), mostrado menor para não pixelar. Ainda vêm do Instagram também: o mapa (`img/ig/post3.jpg`).
- [ ] **Depoimentos reais com autorização**, do destaque "Feedbacks". Os três da home são ilustrativos (`src/pages/index.astro` → `depoimentos`).
- [ ] **Nome do responsável e a história da empresa** para a página Sobre (`src/pages/sobre.astro`).
- [ ] **Ano de início das atividades.** Hoje está 2015 (`src/data/site.ts` → `INICIO_ATIVIDADE`) e o site mostra "+10 anos".

## Dados da empresa (`src/data/site.ts`)
- [ ] Razão social e CNPJ: aparecem no rodapé, no JSON-LD e na política de privacidade.
- [ ] Horário de atendimento. Hoje está seg–sex 8h–18h e sáb 8h–12h; o assistente e a bio usam esses valores para dizer "aberto agora".
- [ ] Lista de cidades e praias atendidas: conferir se falta ou sobra alguma.
- [ ] Endereço físico, se houver atendimento no local. Hoje o site mostra apenas "Garopaba e região".
- [ ] E-mail para receber os leads (`LEAD_EMAIL_TO`).

## Assistente
- [ ] **Tabela de preços do pré-orçamento** (`src/data/precos.ts`). Os valores estão zerados e `confirmado = false`, então o assistente diz "sob consulta". Com os valores em mãos, é só preencher e mudar para `true`.
- [ ] **A visita técnica é cobrada?** A FAQ diz "depende do serviço e da distância", o que precisa ser confirmado.
- [ ] Formas de pagamento e prazo de garantia (FAQ em `src/data/faq.ts`).
- [ ] Conferir o telefone de emergência da Celesc no assistente: 0800 48 0196.
- [ ] **Funcionalidade extra do assistente.** No briefing foi marcado "algo mais" além de FAQ, lead, pré-orçamento e visita, mas sem descrição. Definir o que é.

## Site em PT / EN / ES
- [x] Feito em 03/10/2026: seletor de idioma no cabeçalho e na bio, site inteiro, bio e assistente nos três idiomas (ver README → Idiomas).
- [ ] **Revisão das traduções por alguém nativo (opcional).** Os textos em inglês e espanhol foram escritos para soar naturais, mas vale uma leitura rápida da Blum ou de um cliente estrangeiro.
- [ ] Confirmar se a equipe realmente atende em **inglês e espanhol** pelo WhatsApp. O site promete isso em vários pontos.

## Domínio e contas
- [x] Prévia publicada em 03/10/2026: https://l2mlucas-ora.github.io/blum-solucoes/ (validação com o cliente).
- [ ] Registrar o domínio (ex.: blumsolucoes.com.br) e seguir `MIGRACAO.md`.
- [ ] Trocar o link da bio do Instagram de `wa.me/5548996631148` para `https://<domínio>/bio/`.
