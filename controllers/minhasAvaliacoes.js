module.exports = function (app) {

   var sequelize = require('./../libs/pg_db_connect');
   var _ = require('underscore');
   var _turmaId;
   var _idDisc;

   var MinhaAvaliacaoController = {

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
            if (req.body.per_letivo){
               periodoLetivo = req.body.per_letivo;               
            } else {
               periodoLetivo = perLetivo[0]._id;            
            }

            query = "SELECT * FROM acad.obter_turmas_por_docente(" + req.session.docente_id + "," + periodoLetivo + ");"

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (turmas) {

               // Chamada da funtion necessária para buscar o cabecalho
               query = "SELECT * FROM acad.retornar_cabecalho_portalprof(" + req.session.docente_id + "," + periodoLetivo + ")";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (cabecalho) {
                  resultado = {
                     user: user,
                     turmas: turmas,
                     cabecalho: cabecalho,
                     per_letivos: perLetivo,
                     session: req.session
                  };
                  res.render('home/minhas_avaliacoes/index', resultado);
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

      cadastro: function (req, res) {
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

            query = "SELECT * FROM acad.obter_turma_disc_por_docente(" + req.session.docente_id + "," + perLetivo[0].id + "," + req.params.id + ");"

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (turma) {

               query = "SELECT * FROM acad.obter_per_avaliacao()";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (periodos) {

                  query = "SELECT * FROM acad.obter_avaliacoes()";

                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (avaliacoes) {

                     query = "SELECT * FROM acad.obter_av_cadastradas_turma(" + req.params.id + ")";

                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (avaliacoes_cadastradas) {

                        resultado = {
                           user: user,
                           turma: turma,
                           periodos: periodos,
                           avaliacoes: avaliacoes,
                           av_cadastradas: avaliacoes_cadastradas,
                           ava: [{
                              id: null,
                              descricao: null,
                              conteudo: null,
                              dataavaliacao: null,
                              horario: null,
                              peso: null,
                              turma_id: null,
                              periodoav_id: null,
                              tipo_id: null,
                              local_id: null,
                              situacao: null
                           }],
                           session: req.session
                        };

                        res.render('home/minhas_avaliacoes/cadastro/index', resultado);

                     }).
                     catch (function (error) {
                        res.render('server-error', {
                           user: user,
                           error: erro
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

      create: function (req, res) {
         var user = req.session.usuario;

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

            query = "SELECT * FROM acad.obter_avaliacoes()";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (avaliacoes) {


               query = "SELECT * FROM acad.obter_turma_disc_por_docente(" + req.session.docente_id + "," + perLetivo[0].id + "," + req.params.id + ");";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (turma) {

                  query = "SELECT * FROM acad.obter_per_avaliacao()";

                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (periodos) {

                     query = "SELECT * FROM acad.obter_avaliacoes()";

                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (avaliacoes) {

                        var formatDate = req.body.dpAvaliacao.split("/")[2].split(/[ ,]+/)[0] + "/" + req.body.dpAvaliacao.split("/")[1] + "/" + req.body.dpAvaliacao.split("/")[0];
                        var peso;                        

                        if (req.body.txtPeso_d ==  ''){
                           peso = req.body.txtPeso_m;
                        } else {
                           peso = req.body.txtPeso_d;
                        }                        

                        // Inserindo nova avaliação
                        query = "SELECT acad.manter_nova_avaliacao('" + req.body.txtAvaliacao.split("-")[1] + "','" + req.body.txtConteudo + "','" + formatDate + "','" + req.body.dpAvaliacao.split(/[ ,]+/)[1] + "'," + peso + "," + req.params.id + "," + req.body.txtPeriodo + "," + req.body.txtAvaliacao.split("-")[0] + "," + " 'DIG')";

                        sequelize.query(query).spread(function (results, metadata) {

                           query = "SELECT * FROM acad.obter_av_cadastradas_turma(" + req.params.id + ")";

                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (avaliacoes_cadastradas) {

                              resultado = {
                                 user: user,
                                 turma: turma,
                                 periodos: periodos,
                                 avaliacoes: avaliacoes,
                                 av_cadastradas: avaliacoes_cadastradas,
                                 ava: [{
                                    id: null,
                                    descricao: null,
                                    conteudo: null,
                                    dataavaliacao: null,
                                    horario: null,
                                    peso: null,
                                    turma_id: null,
                                    periodoav_id: null,
                                    tipo_id: null,
                                    local_id: null,
                                    situacao: null
                                 }],
                                 session: req.session
                              };
                              res.render('home/minhas_avaliacoes/cadastro/index', resultado);

                           }).
                           catch (function (error) {
                              res.render('server-error', {
                                 user: user,
                                 error: erro
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

                  }).
                  catch (function (error) {
                     res.render('server-error', {
                        user: user,
                        error: error
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

            }).
            catch (function (error) {
               res.render('server-error', {
                  user: user,
                  error: error
               });
            });
         });
      },

      selectDisciplina: function (req, res) {

         var user = req.session.usuario;
         _idDisc = req.params.id;

         if (req.body.editar == 1) {
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

               query = "SELECT * FROM acad.obter_avaliacoes()";

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (avaliacoes) {

                  query = "SELECT * FROM acad.obter_turma_disc_por_docente(" + req.session.docente_id + "," + perLetivo[0].id + "," + _turmaId + ");";

                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (turma) {

                     query = "SELECT * FROM acad.obter_per_avaliacao()";

                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (periodos) {

                        query = "SELECT * FROM acad.obter_avaliacoes()";

                        sequelize.query(query, {
                           type: sequelize.QueryTypes.SELECT
                        }).success(function (avaliacoes) {

                           query = "SELECT * FROM acad.obter_av_cadastradas_turma(" + _turmaId + ")";

                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (avaliacoes_cadastradas) {

                              query = "SELECT * FROM acad.tbl_avaliacao WHERE id = " + req.params.id;

                              sequelize.query(query, {
                                 type: sequelize.QueryTypes.SELECT
                              }).success(function (av) {

                                 var day = av[0].dataavaliacao.getDate();
                                 var month = (av[0].dataavaliacao.getMonth() + 1);

                                 if (month < 10) {
                                    month = '0' + month;
                                 }
                                 if (day < 10){
                                    day = '0' + day;
                                 }

                                 var dtFormatada = day + '/' + month + '/' + av[0].dataavaliacao.getFullYear() + ' ' + av[0].horario.split(':')[0] + ':' + av[0].horario.split(':')[1];

                                 resultado = {
                                    user: user,
                                    turma: turma,
                                    periodos: periodos,
                                    avaliacoes: avaliacoes,
                                    av_cadastradas: avaliacoes_cadastradas,
                                    ava: av,
                                    dtProva: dtFormatada,
                                    session: req.session
                                 };
                                 
                                 res.render('home/minhas_avaliacoes/cadastro/edit', resultado);

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

                     }).
                     catch (function (error) {
                        res.render('server-error', {
                           user: user,
                           error: error
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

               }).
               catch (function (error) {
                  res.render('server-error', {
                     user: user,
                     error: error
                  });
               });
            });

         }

      },

      update: function (req, res) {
         var user = req.session.usuario;

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

            var formatDate = req.body.u_dpAvaliacao.split("/")[2].split(/[ ,]+/)[0] + "/" + req.body.u_dpAvaliacao.split("/")[1] + "/" + req.body.u_dpAvaliacao.split("/")[0];                       
            
            query = "SELECT acad.atualizar_avaliacao(" + _idDisc + ",'" + req.body.u_txtAvaliacao.split("-")[1] + "', '" + formatDate + "', '" + req.body.u_dpAvaliacao.split(/[ ,]+/)[1] + "'," + req.body.u_txtPeriodo + "," + req.body.u_txtAvaliacao.split("-")[0] + "," + req.body.u_txtPeso_d + ",'" + req.body.u_txtConteudo + "'," + req.params.id + ",'DIG');";

            sequelize.query(query).spread(function (results, metadata) {

               resultado = {
                  user: user,
                  session: req.session                 
               };               
               res.redirect('./');
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

      destroy: function (req, res) {
         var user = req.session.usuario;

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

            query = "SELECT * FROM acad.obter_avaliacoes()";

            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (avaliacoes) {


               query = "SELECT * FROM acad.obter_turma_disc_por_docente(" + req.session.docente_id + "," + perLetivo[0].id + "," + _turmaId + ");"

               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (turma) {

                  query = "SELECT * FROM acad.obter_per_avaliacao()";

                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (periodos) {

                     query = "SELECT * FROM acad.obter_avaliacoes()";

                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (avaliacoes) {

                        //var formatDate = req.body.dpAvaliacao.split("/")[2].split(/[ ,]+/)[0] + "/" + req.body.dpAvaliacao.split("/")[1] + "/" + req.body.dpAvaliacao.split("/")[0];                        
                        // Deleting selected test
                        query = "DELETE FROM acad.tbl_avaliacao WHERE id = " + _idDisc;

                        sequelize.query(query).spread(function (results, metadata) {

                           query = "SELECT * FROM acad.obter_av_cadastradas_turma(" + _turmaId + ")";

                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (avaliacoes_cadastradas) {

                              resultado = {
                                 user: user,
                                 turma: turma,
                                 periodos: periodos,
                                 avaliacoes: avaliacoes,
                                 av_cadastradas: avaliacoes_cadastradas,
                                 ava: [{
                                    id: null,
                                    descricao: null,
                                    conteudo: null,
                                    dataavaliacao: null,
                                    horario: null,
                                    peso: null,
                                    turma_id: null,
                                    periodoav_id: null,
                                    tipo_id: null,
                                    local_id: null,
                                    situacao: null
                                 }],
                                 session: req.session
                              };
                              res.render('home/minhas_avaliacoes/cadastro/index', resultado);

                           }).
                           catch (function (error) {
                              res.render('server-error', {
                                 user: user,
                                 error: erro
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

                  }).
                  catch (function (error) {
                     res.render('server-error', {
                        user: user,
                        error: error
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

            }).
            catch (function (error) {
               res.render('server-error', {
                  user: user,
                  error: error
               });
            });
         });
      }

   };


   return MinhaAvaliacaoController;

};