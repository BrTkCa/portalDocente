module.exports = function(app){
	
	var autenticar = require('./../middlewares/autenticador')
			, desempenho = app.controllers.desempenho;

	app.get('/home/desempenho/notas/:id', autenticar, desempenho.notas);	
	app.get('/home/desempenho/notas/:id/registrar/:id_ava', autenticar, desempenho.registrarNotas);	
	app.post('/home/desempenho/notas/registrar', autenticar, desempenho.salvarLancamentos);

	app.get('/home/desempenho/faltas/:id&:id_disc', autenticar, desempenho.registrarFaltas);
	app.post('/home/desempenho/faltas/obter', autenticar, desempenho.obter_diarios_classe);
	app.get('/home/desempenho/faltas/obterAlunos', autenticar, desempenho.obter_alunos_diarios_classe);	
	app.post('/home/desempenho/faltas/registrar', autenticar, desempenho.salvarLancamentosFaltas);

};