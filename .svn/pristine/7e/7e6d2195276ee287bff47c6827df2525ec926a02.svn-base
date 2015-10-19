var sequelize = require('./../libs/pg_db_connect');

module.exports = function(app){

	var DiarioClasse = {
	listaDiario: function(req, res){

			var user = req.session.usuario;
			var sql = "select id, to_char(data_aula,'dd/MM/yyyy') as data_aula, aulasprevistas, aulasdadas, "
+"(select count(mc.id) from acad.tbl_matric_diario mc where mc.id_diario = dc.id) as matriculado, "
+"(select count(mc.id) from acad.tbl_matric_diario mc where mc.id_diario = dc.id and mc.totalfalta > 0) as ausente, "
					  +"to_char(dc.horainicial, 'HH24:mm') || ' às ' || to_char(dc.horariofinal,'HH24:mm') as horario "
					  +"from acad.tbl_diario_classe dc where dc.id_turma = 419 order by dc.data_aula asc";

			sequelize.query(sql,{type: sequelize.QueryTypes.SELECT}).success(function(data){
				var resultado = {listaDiario: data};
				console.log(resultado);
				res.render('diario/listaDiario', resultado);
			});

			},



	diario: function(req, res){

			var user = req.session.usuario;
			var sql = "select tma.id ||' - '|| tp.descricao as turma,d.id ||' - '|| d.nome as disciplina, c.nome as curso, "
+"(array_to_string(array(select ds.descricao ||' '|| to_char(hi.horario, 'HH24:mm') ||' às ' || to_char(hf.horario, 'HH24:mm') "  
						+"from acad.tbl_calendario_turma ct "
						+"inner join acad.tbl_dia_semana ds on ds.id = ct.id_dia_semana "
						+"inner join acad.tbl_hora_fim hf on hf.id = ct.id_hora_fim "
						+"inner join acad.tbl_hora_inicio hi on hi.id = hf.id_inicio "
						+"where ct.id_turma = tma.id),'/')) as horario "
						+"from acad.tbl_tma_disc tma "
						+"inner join acad.tbl_disc d on d.id = tma.id_disciplina "
						+"inner join acad.tbl_matriz_curricular mc on mc.id = tma.id_matriz "
						+"inner join acad.tbl_curso c on c.id = mc.id_curso "
						+"inner join acad.tbl_docente_turma dt on dt.id_turma = tma.id "
						+"inner join acad.tbl_docente dce on dce.id = dt.id_docente "
						+"inner join global.tbl_pessoa p on p.id = dce.pessoa_id "
						+"inner join global.tbl_documentacao doc on doc.id = p.documentacao_id "
						+"inner join acad.tbl_tipo_turma tp on tp.id = tma.id_tipo "
						+"where doc.cpf = '" + user +"' and tma.id_periodo_letivo = 1004";

			sequelize.query(sql,{type: sequelize.QueryTypes.SELECT}).success(function(data){
				var resultado = {diario: data};
				console.log(resultado);
				res.render('diario/home', resultado);
			});

			},

	listaAlunos: function(req, res){

			var user = req.session.usuario;
			var sql = "select distinct mt.id, doc.cpf, p.nome, sit.descricao, mta.totalfaltas, mta.frequencia, d.id ||' - '||d.nome as disciplina " 
						+"from acad.tbl_matric_diario md "
						+"inner join acad.tbl_diario_classe dc on dc.id = md.id_diario "
						+"inner join acad.tbl_matric mt on mt.id = md.id_matric "
						+"inner join acad.tbl_matric_tma mta on mta.id_matric = mt.id " 
						+"inner join acad.tbl_aluno_curso ac on ac.id = mt.id_aluno_curso "
						+"inner join acad.tbl_aluno a on a.id = ac.id_aluno "
						+"inner join acad.tbl_tma_disc tma on tma.id = mta.id_turma "
						+"inner join acad.tbl_disc d on d.id = tma.id_disciplina "
						+"inner join global.tbl_pessoa p on p.id = a.pessoa_id "
						+"inner join acad.tbl_sit_matricula sit on sit.id = mta.id_situacao "
						+"left join global.tbl_documentacao doc on doc.id = p.documentacao_id "
						+"where tma.id = 419 order by p.nome asc";

			sequelize.query(sql,{type: sequelize.QueryTypes.SELECT}).success(function(data){
				var resultado = {listaAlunos: data};
				console.log(resultado);
				res.render('diario/alunos', resultado);
			});

			},

	digitaDiario: function(req, res){

			var user = req.session.usuario;
			var sql = "select id, to_char(data_aula,'dd/MM/yyyy') as data_aula, aulasprevistas, aulasdadas, "
+"(select count(mc.id) from acad.tbl_matric_diario mc where mc.id_diario = dc.id) as matriculado, "
+"(select count(mc.id) from acad.tbl_matric_diario mc where mc.id_diario = dc.id and mc.totalfalta > 0) as ausente, "
					  +"to_char(dc.horainicial, 'HH24:mm') || ' às ' || to_char(dc.horariofinal,'HH24:mm') as horario "
					  +"from acad.tbl_diario_classe dc where dc.id_turma = 419 order by dc.data_aula asc";

			sequelize.query(sql,{type: sequelize.QueryTypes.SELECT}).success(function(data){
				var resultado = {diario: data};
				console.log(resultado);
				res.render('diario/alunos', resultado);
			});

			},			
	}
	return DiarioClasse;
}