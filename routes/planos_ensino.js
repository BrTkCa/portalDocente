module.exports = function(app){
	
	var autenticar = require('./../middlewares/autenticador')
			, planos_ensino = app.controllers.planosEnsino;

	app.get('/home/planos_ensino/editar/:id',autenticar, planos_ensino.editar);
	app.post('/home/planos_ensino/editar/salvar', autenticar, planos_ensino.salvarTetra);
	app.post('/home/planos_ensino/editar/salvarBibliografia', autenticar, planos_ensino.salvarBibliografia);
	app.post('/home/planos_ensino/editar/salvarBibliografia/selecBib', autenticar, planos_ensino.selecionarBibliografia);
	app.delete('/home/planos_ensino/editar/salvarBibliografia/remBib', autenticar, planos_ensino.removerBibliografia);
	app.post('/home/planos_ensino/editar/salvarPrograma', autenticar, planos_ensino.salvarPrograma);
	app.post('/home/planos_ensino/editar/salvarBibliografia/selectProg', autenticar, planos_ensino.selecionarPrograma);
	app.delete('/home/planos_ensino/editar/salvarBibliografia/remProg', autenticar, planos_ensino.removerPrograma);
	app.get('/home/planos_ensino/emitir/:idCurso/:idDisc/:idMatriz', autenticar, planos_ensino.emitir);
};