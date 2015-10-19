module.exports = function (app) {

   var autenticar = require('./../middlewares/autenticador'),
   	   minhas_avaliacoes = app.controllers.minhasAvaliacoes;

   app.get('/home/minhas_avaliacoes/cadastro/:id', autenticar, minhas_avaliacoes.cadastro);
   app.post('/home/minhas_avaliacoes/cadastro/:id', autenticar, minhas_avaliacoes.create);
   app.post('/home/minhas_avaliacoes/cadastro/:id/editar', autenticar, minhas_avaliacoes.update);
   app.post('/home/minhas_avaliacoes/cadastro/:id/:id', autenticar, minhas_avaliacoes.selectDisciplina);      
   app.delete('/home/minhas_avaliacoes/cadastro/:id/excluir', autenticar, minhas_avaliacoes.destroy);
};
