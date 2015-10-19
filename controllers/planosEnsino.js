module.exports = function (app) {
   var sequelize = require('./../libs/pg_db_connect');
   var _ = require('underscore');
   var fs = require('fs');
   var user, retorno, query, periodoLetivo, idPlano, idBib, idProg;

   var PlanoEnsinoController = {
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

               query = "SELECT * FROM acad.obter_planos_ensino_prof(" + req.session.docente_id + "," + periodoLetivo + ");"
               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (planos_ensino) {
                  retorno = {
                     user: user,
                     cabecalho: cabecalho,
                     per_letivos: perLetivos,
                     planos: planos_ensino,
                     session: req.session
                  }
                  res.render('home/planos_ensino/index', retorno);
               }).
               catch (function (erro) {
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

      editar: function (req, res) {

         idPlano = req.params.id;
         query = "SELECT * FROM acad.obter_det_plano_ens(" + req.session.docente_id + "," + periodoLetivo + "," + req.params.id + ");"
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (cabecalho) {
            done = _.after(cabecalho.lenght, function () {
               callback(cabecalho)
            })
            query = "SELECT * FROM global.tbl_idioma";
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (idiomas) {
               query = "SELECT * FROM acad.tbl_acervo_tipo";
               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (tipos) {
                  query = "SELECT * FROM acad.tbl_acervo_tipo_ref";
                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (referencias) {
                     query = "select * from acad.obter_bib_plano_ensino(" + idPlano + ")"
                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (bibliografias) {
                        query = "SELECT * FROM acad.obter_biblio_docente(" + req.session.docente_id + ")";
                        sequelize.query(query, {
                           type: sequelize.QueryTypes.SELECT
                        }).success(function (pesq_biblio) {
                           query = "SELECT * FROM acad.obter_progs_plano_ensino(" + idPlano + ")";
                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (programas) {
                              retorno = {
                                 user: user,
                                 session: req.session,
                                 dados: cabecalho,
                                 idiomas: idiomas,
                                 tipos: tipos,
                                 referencias: referencias,
                                 bibliografias: bibliografias,
                                 pesq_biblio: pesq_biblio,
                                 programas: programas
                              };                              
                              res.render('home/planos_ensino/editar', retorno);
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
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            });
         });

      },

      salvarTetra: function (req, res) {

         query = "SELECT * FROM acad.manter_tetra_plano_ensino(" + idPlano + ",'" + req.body.objetivo + "','" + req.body.metodologia + "','" + req.body.ementa + "','" + req.body.criterioav + "');";
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (salvar) {
            done = _.after(salvar.lenght, function () {
               callback(salvar)
            })
            query = "SELECT * FROM global.tbl_idioma";
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (idiomas) {
               query = "SELECT * FROM acad.tbl_acervo_tipo";
               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (tipos) {
                  query = "SELECT * FROM acad.tbl_acervo_tipo_ref";
                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (referencias) {
                     query = "select * from acad.obter_bib_plano_ensino(" + idPlano + ")"
                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (bibliografias) {
                        query = "SELECT * FROM acad.obter_biblio_docente(" + req.session.docente_id + ")";
                        sequelize.query(query, {
                           type: sequelize.QueryTypes.SELECT
                        }).success(function (pesq_biblio) {
                           query = "SELECT * FROM acad.obter_progs_plano_ensino(" + idPlano + ")";
                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (programas) {
                              retorno = {
                                 user: user,
                                 session: req.session,
                                 dados: salvar,
                                 idiomas: idiomas,
                                 tipos: tipos,
                                 referencias: referencias,
                                 bibliografias: bibliografias,
                                 pesq_biblio: pesq_biblio,
                                 programas: programas
                              };
                              res.render('home/planos_ensino/editar', retorno);
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
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            });
         });

      },

      salvarBibliografia: function (req, res) {

         if (typeof idBib !== 'undefined') {
            query = "SELECT * FROM acad.manter_bibliografia_plano_ensino(" + idPlano + "," + req.body.anoPubBib + ",'" + req.body.autoresBib + "','" + req.body.edicaoBib + "','" + req.body.editoraBib + "','" + req.body.subTitBib + "','" + req.body.tituloBib + "'," + req.body.idiomaBib + "," + req.body.tipoBib + "," + req.body.referenciaBib + "," + 2 + "," + idBib + ")";
            idBib = undefined;
         } else {
            query = "SELECT * FROM acad.manter_bibliografia_plano_ensino(" + idPlano + "," + req.body.anoPubBib + ",'" + req.body.autoresBib + "','" + req.body.edicaoBib + "','" + req.body.editoraBib + "','" + req.body.subTitBib + "','" + req.body.tituloBib + "'," + req.body.idiomaBib + "," + req.body.tipoBib + "," + req.body.referenciaBib + "," + 1 + "," + 0 + ")";
         }

         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (persistencia) {
            done = _.after(persistencia.lenght, function () {
               callback(persistencia)
            })
            query = "SELECT * FROM global.tbl_idioma";
            sequelize.query(query, {
               type: sequelize.QueryTypes.SELECT
            }).success(function (idiomas) {
               query = "SELECT * FROM acad.tbl_acervo_tipo";
               sequelize.query(query, {
                  type: sequelize.QueryTypes.SELECT
               }).success(function (tipos) {
                  query = "SELECT * FROM acad.tbl_acervo_tipo_ref";
                  sequelize.query(query, {
                     type: sequelize.QueryTypes.SELECT
                  }).success(function (referencias) {
                     query = "select * from acad.obter_bib_plano_ensino(" + idPlano + ")"
                     sequelize.query(query, {
                        type: sequelize.QueryTypes.SELECT
                     }).success(function (bibliografias) {
                        query = "SELECT * FROM acad.obter_biblio_docente(" + req.session.docente_id + ")";
                        sequelize.query(query, {
                           type: sequelize.QueryTypes.SELECT
                        }).success(function (pesq_biblio) {
                           query = "SELECT * FROM acad.obter_progs_plano_ensino(" + idPlano + ")";
                           sequelize.query(query, {
                              type: sequelize.QueryTypes.SELECT
                           }).success(function (programas) {
                              retorno = {
                                 user: user,
                                 session: req.session,
                                 dados: persistencia,
                                 idiomas: idiomas,
                                 tipos: tipos,
                                 referencias: referencias,
                                 bibliografias: bibliografias,
                                 pesq_biblio: pesq_biblio,
                                 programas: programas
                              };
                              res.render('home/planos_ensino/editar', retorno);
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
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            });
         });

      },

      selecionarBibliografia: function (req, res) {
         idBib = req.body.id;
      },

      selecionarPrograma: function (req, res) {
         idProg = req.body.id;
      },

      removerBibliografia: function (req, res) {
         query = "SELECT * FROM acad.manter_rem_bibliografia(" + idPlano + "," + idBib + ")";
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (resposta) {
            res.send(true);
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            })
         })
      },

      salvarPrograma: function (req, res) {
         if (req.body.txtId == null) {
            query = "SELECT * FROM acad.manter_novo_programa(" + idPlano + "," + 1 + "," + 0 + ",'" + req.body.txtConteudo + "'," + req.body.txtItem + ",'" + req.body.txtMascara + "'," + req.body.txtNivel + ");";
         } else {
            query = "SELECT * FROM acad.manter_novo_programa(" + idPlano + "," + 2 + "," + req.body.txtId + ",'" + req.body.txtConteudo + "'," + req.body.txtItem + ",'" + req.body.txtMascara + "'," + req.body.txtNivel + ");";
         }

         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (persistencia) {
            var response = {
               data: persistencia,
            }
            res.send(response);
         }).
         catch (function (error) {
            res.send({
               error: 'Falha ao processar'
            });
         });
      },

      removerPrograma: function (req, res) {
         query = "SELECT * FROM acad.manter_rem_programa(" + idPlano + "," + idProg + ")";
         sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
         }).success(function (resposta) {
            var response = {
               data: resposta
            }            
            res.send(response);
         }).
         catch (function (error) {
            res.render('server-error', {
               user: user,
               session: req.session,
               error: error
            })
         })
      },

      emitir: function (req, res) {
      	var requestObj = require('request');
      	var data = {};
      	
      	data.txtIdCurso = req.params.idCurso;
      	data.txtIdDisc = req.params.idDisc;
      	data.txtIdDocente = req.session.docente_id;
      	data.txtPerLetivo = periodoLetivo;
      	data.txtMatriz = req.params.idMatriz;
		
      	/* Consumindo webService via request module
      	 * IDs da URL: {Curso}, {Disciplina}, {PerLetivo = periodoLetivo}, {Docente = req.session.docente_id}
      	 */
      	requestObj({
      		url: "http://201.90.87.228:9080/WSFIO/resources/professor/planoEnsino/" + data.txtIdCurso + "/" + data.txtIdDisc + "/" + data.txtMatriz + "/" + data.txtPerLetivo + "/" + data.txtIdDocente,
      		method: "GET",
      		headers: { "Content-Type" : "application/json"},     
            json: true
      	});
      	
		res.download("/opt/fio/sigaac/professor/planos_ensino/DOSC_" + data.txtIdDocente + "/PLANO_DISC_" + data.txtIdDisc + "_" + data.txtMatriz + "_" + periodoLetivo + ".pdf");

      }
   }
   return PlanoEnsinoController;
}