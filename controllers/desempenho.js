module.exports = function (app) {
   var sequelize = require('./../libs/pg_db_connect');
   var _ = require('underscore');
   var fs = require('fs');
   var user, retorno, query, periodoLetivo, _turmaId, _id_ava;

   var DesempenhoController = {
      index: function (req, res) {

         user = req.session.usuario;
         query = "SELECT * FROM acad.obter_per_letivos_docente(" + req.session.docente_id + ")";
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (perLetivos) {
            done = _.after(perLetivos.lenght, function () {
               callback(perLetivos)
            })

            if (req.body.per_letivo) {
               periodoLetivo = req.body.per_letivo;
            } else {
               periodoLetivo = perLetivos[0]._id;
            }

            query = "SELECT * FROM acad.retornar_cabecalho_portalprof(" + req.session.docente_id + "," + periodoLetivo + ")";
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (cabecalho) {

               query = "SELECT * FROM acad.obter_turmas_notasFaltas_por_docente(" + req.session.docente_id + "," + periodoLetivo + ");"
               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (turmas) {
                  retorno = {
                     user: user,
                     cabecalho: cabecalho,
                     per_letivos: perLetivos,
                     turmas: turmas,
                     session: req.session
                  }
                  res.render('home/desempenho/index', retorno);
               }).
               catch (function (error) {
                  res.render('server-error', {
                     user: user,
                     session: req.session,
                     error: error
                  });
               });
            }).
            catch (function (error) {
               res.render('server-error', {
                  user: user,
                  session: req.session,
                  error: error
               });
            });
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            });
         });
      },

      notas: function (req, res) {
         var user = req.session.usuario;
         _turmaId = req.params.id;

         // Obtendo os parametros do professor para executar a consulta
         var query = "SELECT id FROM acad.tab_perletivo WHERE situacao = 'ABE' ORDER BY id DESC LIMIT 1";

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

            query = "SELECT * FROM acad.obter_cabecalho_notas_portal_prof(" + _turmaId + ");";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (cabecalho) {

               query = "SELECT * FROM acad.obter_avaliacoes_turma_portal_prof(" + _turmaId + ");";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (avaliacoes_cadastradas) {

                  resultado = {
                     user: user,
                     cabecalho: cabecalho,
                     session: req.session,
                     avaliacoes: avaliacoes_cadastradas
                  };

                  res.render('home/desempenho/notas/index', resultado);

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
      },

      registrarNotas: function (req, res) {
         var user = req.session.usuario;
         _turmaId = req.params.id;
         _id_ava = req.params.id_ava;
         var nome_imagem;
         var size_array_image         

         // Obtendo os parametros do professor para executar a consulta
         var query = "SELECT id FROM acad.tab_perletivo WHERE situacao = 'ABE' ORDER BY id DESC LIMIT 1";

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

            query = "SELECT * FROM acad.obter_cabecalho_registro_notas_portal_prof(" + _turmaId + "," + req.params.id_ava + ");";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (cabecalho) {
               
               query = "SELECT * FROM acad.obter_alunos_ava_portal_prof(" + req.params.id_ava + ");";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (alunos_associados) {

                  if (alunos_associados.length > 0){
                     for (var i = 0 ; i < alunos_associados.length ; i++){
                        if (alunos_associados[i].imagem != null){              
                          size_array_image = alunos_associados[i].imagem.split('/');
                          nome_imagem = alunos_associados[i].imagem.split('/')[size_array_image.length-1];                          
                        } else {
                          nome_imagem = 'no-profile.png';                          
                        }
                        alunos_associados[i].imagem = nome_imagem;
                     }
                  }   

                  resultado = {
                     user: user,
                     cabecalho: cabecalho,
                     session: req.session,
                     alunos: alunos_associados
                  };                          
                  res.render('home/desempenho/notas/registro', resultado);

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
      },

      salvarLancamentos: function(req, res){
         var notas = req.body, controle = true;  

         notas.forEach(function (entry) {
            
            if (entry.valor == '')
               entry.valor = null;

            var query = "SELECT * FROM acad.manter_lancamento_nota_portal_prof(" + _id_ava + "," + entry.matricula + ", " + entry.valor +")";

            /*
             * Para executar subqueries e necessario inserir os sequelizer query dentro da funcao de
             * CallBack, pois fora do "success" a variavel de dados perde a referencia.
             */
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (lancamentos) {
               done = _.after(lancamentos.length, function () {
                  callback(lancamentos)
               })
               
            }).catch(function (error) {
                  controle = false;
                  res.render('server-error', {
                     user: user,
                     error: error,
                     session: req.session,
                  });
            });

         });

         if (controle){
            res.send(true);
         } else{
            res.send(false);
         }
      },

      obter_diarios_classe: function (req, res){
         
         var query = "select * from acad.obter_diario_classe_portal_prof(" + _turmaId + ",'" + req.body.mes + "','" + req.body.dia + "'," + req.body.operacao + ")";

         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (diario_filtrado) {

            resultado = {
               diario: diario_filtrado
            };

            res.send(resultado);

         }).catch(function (error) {
            res.render('server-error', {
               user: user, 
               error: error,
               session: req.session
            })
         });
      },

      obter_alunos_diarios_classe: function (req, res){         
         var query = "select * from acad.obter_alunos_faltas_portal_prof(" + _turmaId + ")";
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (alunos_associados) {
                  if (alunos_associados.length > 0){
                     for (var i = 0 ; i < alunos_associados.length ; i++){
                        if (alunos_associados[i].imagem != null){              
                          size_array_image = alunos_associados[i].imagem.split('/');
                          nome_imagem = alunos_associados[i].imagem.split('/')[size_array_image.length-1];                          
                        } else {
                          nome_imagem = 'no-profile.png';                          
                        }
                        alunos_associados[i].imagem = nome_imagem;
                     }
                  }             
            resultado = {
               alunos: alunos_associados
            };            
            res.send(resultado);
         }).catch(function (error) {
            res.render('server-error', {
               user: user, 
               error: error,
               session: req.session
            })
         });
      },      

      faltas: function (req, res) {
         var user = req.session.usuario;
         _turmaId = req.params.id;

         // Obtendo os parametros do professor para executar a consulta
         var query = "SELECT id FROM acad.tab_perletivo WHERE situacao = 'ABE' ORDER BY id DESC LIMIT 1";

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

            query = "SELECT * FROM acad.obter_cabecalho_notas_portal_prof(" + _turmaId + ");";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (cabecalho) {

               query = "SELECT * FROM acad.obter_avaliacoes_turma_portal_prof(" + _turmaId + ");";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (avaliacoes_cadastradas) {

                  resultado = {
                     user: user,
                     cabecalho: cabecalho,
                     session: req.session,
                     avaliacoes: avaliacoes_cadastradas
                  };

                  res.render('home/desempenho/faltas/index', resultado);

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
      },

      registrarFaltas: function(req, res) {
         var user = req.session.usuario;
         _turmaId = req.params.id;
         _id_disc = req.params.id_disc;
         var nome_imagem;
         var size_array_image         

         // Obtendo os parametros do professor para executar a consulta
         var query = "SELECT * FROM acad.obter_cabecalho_registro_notas_portal_prof(" + _turmaId + "," + _id_disc + ");";

         /*
          * Para executar subqueries e necessario inserir os sequelizer query dentro da funcao de
          * CallBack, pois fora do "success" a variavel de dados perde a referencia.
          */
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (cabecalho) {
            done = _.after(cabecalho.length, function () {
               callback(cabecalho)
            })

            query = "SELECT * FROM acad.obter_alunos_faltas_portal_prof(" + _turmaId + ");";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (alunos_associados) {               

                  if (alunos_associados.length > 0){
                     for (var i = 0 ; i < alunos_associados.length ; i++){
                        if (alunos_associados[i].imagem != null){              
                          size_array_image = alunos_associados[i].imagem.split('/');
                          nome_imagem = alunos_associados[i].imagem.split('/')[size_array_image.length-1];                          
                        } else {
                          nome_imagem = 'no-profile.png';                          
                        }
                        alunos_associados[i].imagem = nome_imagem;
                     }
                  }   

                  resultado = {
                     user: user,
                     cabecalho: cabecalho,
                     session: req.session,                    
                     alunos: alunos_associados
                  };    
                  
                  res.render('home/desempenho/faltas/registro', resultado);

               }).
            catch (function (error) {
               res.render('server-error', {
                  user: user,
                  session: req.session,
                  error: error
               });
            });

         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            });
         });
      },

      salvarLancamentosFaltas: function (req, res){
         var notas = req.body, controle = true;  

         notas.forEach(function (entry) {
            
            if (entry.valor == '')
               entry.valor = null;

            var query = "SELECT * FROM acad.manter_lancamento_nota_portal_prof(" + _id_ava + "," + entry.matricula + ", " + entry.valor +")";

            /*
             * Para executar subqueries e necessario inserir os sequelizer query dentro da funcao de
             * CallBack, pois fora do "success" a variavel de dados perde a referencia.
             */
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (lancamentos) {
               done = _.after(lancamentos.length, function () {
                  callback(lancamentos)
               })
               
            }).catch(function (error) {
                  controle = false;
                  res.render('server-error', {
                     user: user,
                     error: error,
                     session: req.session,
                  });
            });

         });

         if (controle){
            res.send(true);
         } else{
            res.send(false);
         }         
      }

   }
   return DesempenhoController;
}