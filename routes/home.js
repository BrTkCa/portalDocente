module.exports = function(app){
	
	var autenticar = require('./../middlewares/autenticador')
			, home = app.controllers.home
			, meu_cadastro = app.controllers.meuCadastro
			, alterar_senha = app.controllers.alterarSenha
			, horarios = app.controllers.horarios
			, minhas_avaliacoes = app.controllers.minhasAvaliacoes
			, planos_ensino = app.controllers.planosEnsino
			, desempenho = app.controllers.desempenho;

	app.get('/home', home.index);	
	app.get('/home/meu_cadastro', autenticar, meu_cadastro.index);
	app.get('/home/alterar_senha', autenticar, alterar_senha.index);
	app.get('/home/horarios', autenticar, horarios.index);
	app.post('/home/horarios', autenticar, horarios.index);
	app.get('/home/minhas_avaliacoes', autenticar, minhas_avaliacoes.index);
	app.post('/home/minhas_avaliacoes', autenticar, minhas_avaliacoes.index);
	app.get('/home/meu_cadastro/upload', autenticar, meu_cadastro.index);
	app.post('/home/meu_cadastro/upload', autenticar, meu_cadastro.upload);
	app.get('/home/planos_ensino', autenticar, planos_ensino.index);
	app.post('/home/planos_ensino', autenticar, planos_ensino.index);
	app.get('/home/desempenho', autenticar, desempenho.index);
	app.post('/home/desempenho', autenticar, desempenho.index);
};