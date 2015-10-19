module.exports = function (app) {

   var sequelize = require('./../libs/pg_db_connect');
   var _ = require('underscore');

   var HorariosController = {

      index: function (req, res) {
         var user = req.session.usuario;
         var periodoLetivo = null;
         // Obtendo os parametros do professor para executar a consulta
         var query = "SELECT * FROM acad.obter_per_letivos_docente(" + req.session.docente_id + ")";

         /*
          * Para executar subqueries e necessario inserir os sequelizer query dentro da funcao de
          * CallBack, pois fora do "success" a variavel de dados perde a referencia.
          */
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (perLetivo) {
            done = _.after(perLetivo.length, function () {
               callback(perLetivo)
            })
            // Chamada da function          
            if (req.body.per_letivo) {
               periodoLetivo = req.body.per_letivo;
            } else {
               periodoLetivo = perLetivo[0]._id;
            }

            query = "SELECT * FROM acad.consultar_horario_AulaProf(" + periodoLetivo + "," + req.session.docente_id + ",9964);"

            /*
             * Para executar subqueries e necessario inserir os sequelizer query dentro da funcao de
             * CallBack, pois fora do "success" a variavel de dados perde a referencia.
             */
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (horarios) {

               // Chamada da funtion necessária para buscar o cabecalho
               query = "SELECT * FROM acad.retornar_cabecalho_portalprof(" + req.session.docente_id + "," + periodoLetivo + ")";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (cabecalho) {
                  resultado = {
                     user: user,
                     horarios: horarios,
                     cabecalho: cabecalho,
                     per_letivos: perLetivo,
                     session: req.session
                  };
                  res.render('home/horarios/index', resultado);
               }).
               catch (function (error) {
                  res.render('server-error', {
                     user: user,
                     error: error
                  });
               });

            }).
            catch (function (error) {
               res.render('server-error', {
                  user: user,
                  error: error
               });
            });

         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               error: error
            });
         });
      }
   };

   return HorariosController;

};