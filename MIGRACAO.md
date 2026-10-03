# Domínio próprio e contas

Hoje o site está em prévia no GitHub Pages (`npm run previa`, ver README). Quando a Blum comprar o domínio, o site definitivo vai para o Cloudflare Pages, que roda o `/api/lead`. Use uma conta Cloudflare da Blum ou sua, **não** a da Target.

## 1. Registrar o domínio
Registre o domínio no Registro.br (por exemplo, `blumsolucoes.com.br`) **no CNPJ ou CPF da Blum**, para que ele pertença ao cliente.

## 2. Apontar para o Cloudflare Pages
1. Abra o Cloudflare e vá em **Pages → blum-solucoes → Custom domains → Set up a domain**.
2. Informe o domínio e siga as instruções. O caminho recomendado é trocar os DNS no Registro.br para os nameservers do Cloudflare.
3. Repita para `www` e configure o redirecionamento de `www` para o domínio raiz.

## 3. Atualizar o código
Troque `https://blum-solucoes.pages.dev` pelo domínio definitivo nos arquivos abaixo:
- `astro.config.mjs`: o padrão de `SITE_URL` (ou defina a variável `SITE_URL` no Cloudflare Pages); `src/data/site.ts` lê esse valor automaticamente.
- `public/robots.txt` → linha `Sitemap:`
- `tests/lead.test.ts`: o teste do domínio oficial já usa `https://blumsolucoes.com.br/`; ajuste se o domínio for outro.

Depois, faça o commit e o push. O deploy é automático.

## 4. Depois de no ar
- **Google Search Console:** adicione a propriedade e envie `https://<domínio>/sitemap-index.xml`.
- **Perfil da Empresa no Google (Google Meu Negócio):** use o link do site e a mesma lista de cidades atendidas.
- **Instagram:** coloque `https://<domínio>/bio/` como link da bio.
- **Stories e campanhas:** use `https://<domínio>/bio/?d=<id>` para destacar uma campanha específica (os ids ficam em `src/data/bio.ts`).

## 5. Transferir as contas para o cliente
- **GitHub:** transferir o repositório, ou adicionar o cliente como owner.
- **Cloudflare:** adicionar o e-mail do cliente como Super Administrator, ou mover o projeto para a conta dele.
- **Resend** (e-mail dos leads), se usado: criar a conta no e-mail do cliente e verificar o domínio.
