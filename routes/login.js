module.exports = function (app){
	
	var login = app.controllers.login;

	app.get('/', login.index);
	app.get('/entrar', login.index);
 	app.post('/entrar', login.login);
  	app.get('/sair', login.logout);
};