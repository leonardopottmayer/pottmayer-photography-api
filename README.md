# Leonardo Pottmayer - Pottmayer Photography

Album de fotos [LINK](https://photography.pottmayer.dev).

## Descrição

Um dos meus hobbys é fazer fotos, tenho uma conta no instagram específica para postá-las (@pottmayer.photography).
Sempre quis aprender a manipular fotos com aplicações web e ter outro lugar para guardá-las além do instagram, por isso
resolvi criar esta aplicação.
Basicamente para os usuários comuns existe apenas a rota principal que mostra todas as fotos. E existe a área de admin, onde é possível
criar novas postagens e vincular imagens a elas, editar postagens ou excluí-las.

Neste projeto utilizei React.js para frontend, MongoDB como banco de dados, uma API node/express para o backend e utilizei os serviços
da S3, que pertencem à AWS Amazon para guardar as imagens.

Por motivos de segurança a rota de registro está desabilitada, pois não posso fornecer acesso e poder de edição ou deleção para
os arquivos ali guardados.