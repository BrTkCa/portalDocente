module.exports = function (app) {

   var HomeController = {
      index: function (req, res) {
         var user = req.session.usuario;
         var resultado = {
            user: user,
            session: req.session
         };

         res.render('home/index', resultado);

      }
   }

   return HomeController;
}