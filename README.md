# PLAY TV — Portal institucional (versão inicial)

Este pacote cria uma **nova base separada** para o portal institucional da PLAY TV. Ele não substitui nem altera o repositório PLAY TV GESTOR.

## Arquivos
- `index.html`: portal público responsivo.
- `styles.css`: identidade visual azul, ciano e dourado.
- `app.js`: menu móvel e link do WhatsApp.
- `admin.html`: tela visual inicial da área restrita; ainda NÃO faz autenticação.
- `assets/play-tv-logo-original.jpg`: arquivo original da logomarca fornecida.

## Antes de publicar
1. Confirme o WhatsApp em `app.js` e `index.html` (formato internacional sem `+` no link wa.me).
2. Confirme o preço e condições do plano.
3. Confirme a disponibilidade e os direitos de distribuição dos canais e conteúdos. A quantidade de 150 mil conteúdos não foi publicada como fato confirmado.
4. Substitua o espaço de depoimentos por avaliações reais, com autorização.
5. **Não publique `admin.html` como se fosse uma área segura.** A tela é apenas um placeholder visual. Antes de ativar administração, configure uma API no Cloudflare Worker com autenticação no servidor, sessão segura e permissões em todos os endpoints. Nunca guarde senha administrativa em JavaScript ou localStorage.

## Publicar com GitHub + Cloudflare Pages (Android)
1. No GitHub, crie um repositório novo, por exemplo `play-tv-portal`. Não use o repositório do gestor para evitar misturar projetos.
2. Envie todos os arquivos e a pasta `assets` mantendo a estrutura.
3. No Cloudflare, abra Workers & Pages → Create → Pages → Connect to Git.
4. Escolha o repositório novo. Como é HTML/CSS/JS estático, deixe o comando de build vazio e o diretório de saída como `/` (raiz), conforme a interface disponível.
5. Faça o deploy e teste o endereço `pages.dev` no celular.
6. A área administrativa só deve ser liberada depois da implementação e teste da API protegida.

## Estado
Portal público é um protótipo inicial navegável. Não há API integrada, banco de dados de catálogo, avaliações ou login funcional neste pacote.
