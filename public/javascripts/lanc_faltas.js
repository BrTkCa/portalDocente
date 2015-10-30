window.onload = selectCurrentMonth;

var quant_colums = 0, aulas_dadas, diarios = [];

// No carregamento da pagina é setado a tabela como paginator dataTable
$(document).ready(function () {
   $('#tblFaltas').dataTable({
    searching: false
   });
});

// Function responsavel para selecionar o mes atual 
// no carregando da pagina
function selectCurrentMonth() {
   var m = new Date().getMonth();
   m += 1;
   if (m < 10) {
      m = "0" + m;
   }
   selectMonth(m.toString(), 0);
}

// Function responsavel por carregar o corpo da tabela com base com
// base na selecao do mes na tela.
function selectMonth(month, origin) {
   var month_selected, data = {},
      e, cont = 0;

   if (origin != 0) {
      e = document.getElementById("month");
      month_selected = e.options[e.selectedIndex].value;
      data.mes = month_selected;
      data.dia = '01';
   } else {
      month_selected = month;
      data.mes = month;
      data.dia = '01';
   }
   data.operacao = 1;

   $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      datatype: "json",
      async: false,
      url: '/home/desempenho/faltas/obter',
      success: function (returns) {
         $('#day').empty();
         $('#lnDia').empty();

         for (var key in returns) {
            // Atualizando select de dia
            for (var key2 in returns[key]) {
               cont++;
               $('#day').append('\
                     <option value="' + returns[key][key2].data_aula.split('-')[2].substr(0, 2) + '">' + returns[key][key2].data_aula.split('-')[2].substr(0, 2) + '</option>\
              ');

               $('#lnDia').append('\
                     <th colspan="1">' + returns[key][key2].data_aula.split('-')[2].substr(0, 2) + '</th>\
              ');

              diarios[diarios.length] = returns[key][key2].id;
            };
         };
         quant_colums = cont;         
         aulas_dadas = returns[key][key2].aulasdadas;
         
         // Cabecalho padrao da tabela          
         $('#colMes').empty();
         $('#colMes').append('\
              <th id="colMes"><label>' + returnDescMonth(month_selected) + '</label></th>\
          ');
         $('#colMes').attr('colspan', cont);

      }      
   });   
   obterAlunos(aulas_dadas);
};

// Funcao responsavel pelo carregamento do conteudo da tabela
// com base na selecao do dia na tela.
function selectDay() {
   var month_selected, day_selected, data = {},
      e, cont = 0;

   e = document.getElementById("month");
   month_selected = e.options[e.selectedIndex].value;
   e = document.getElementById("day");
   day_selected = e.options[e.selectedIndex].value;
   data.mes = month_selected;
   data.dia = day_selected;
   data.operacao = 2;

   $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      datatype: "json",
      async: false,
      url: '/home/desempenho/faltas/obter',
      success: function (returns) {
         $('#lnDia').empty();

         for (var key in returns) {
            // Atualizando select de dia
            for (var key2 in returns[key]) {
               cont++;

               $('#lnDia').append('\
                     <th colspan="1">' + returns[key][key2].data_aula.split('-')[2].substr(0, 2) + '</th>\
              ');
            };
            quant_colums = cont;
            aulas_dadas = returns[key][key2].aulasdadas;
         }         
        
         // Cabecalho padrao da tabela          
         $('#colMes').empty();
         $('#colMes').attr('colspan', cont);
         $('#colMes').append('\
              <th id="colMes"> <center>' + returnDescMonth(month_selected) + '</center></th>\
          ');
      }
   });
   obterAlunos();
};

// Function responsavel por obter os alunos no momento de 
// geracao do conteudo da tabela.
function obterAlunos(aulas_dadas) {
   var data = {}, iden, teste;
   data.cont = 1;

   $.ajax({
      type: 'GET',
      cache: false,
      contentType: 'application/json',
      datatype: "json",
      async: false,
      url: '/home/desempenho/faltas/obterAlunos',
      success: function (returns) {
         $('#tBodyFaltas').empty();         
         if (quant_colums != 0) {
            for (var key in returns) {
               // Atualizando select de dia
               for (var key2 in returns[key]) {
                  var $tr = $('\
                             <tr>\
                                <td >\
                                   <center>\
                                      <div class="Profile">\
                                          <img src="/' + returns[key][key2].imagem + '" alt="Perfil" class="img-circle" height="30px" width="30px">\
                                          <div class="Overlay">\
                                              <img src="/' + returns[key][key2].imagem + '" alt="Perfil" class="img-circle" height="100px" width="100px">\
                                          </div>\
                                      </div>\
                                   </center>\
                                </td>\
                                <td >\
                                   <center>\
                                      <label id="lblMatricula">' + returns[key][key2].matricula + '</label>\
                                   </center>\
                                </td>\
                                <td >\
                                   <center>\
                                      <label>' + returns[key][key2].nome + '</label>\
                                   </center>\
                                </td>\
                ');
                  
                  for (var i = 0; i < quant_colums; i++) {
                    iden = returns[key][key2].matricula + "_" + diarios[i];
                    $tr.append("<td ><center><input id='" + iden + "' type='number' width='50px;' min='1' max='" + aulas_dadas + "' name=" + iden + "></input></td>");
                    console.log(typeof iden);
                    $(':input[name="'+iden+'"]').prop('disabled',true);
                  }

                  if (quant_colums != 0) 
                    $tr.append("<td><center><label>10</label></center></td>");

                  $tr.append("</tr>");  
                  $('#tBodyFaltas').append($tr);                
               };
            };
         } else {
            var $tr = $('<tr><td ><center>Sem dados</center></td><td ><center>Sem dados</center></td><td ><center> Sem dados</center></td><td ><center>Sem dados</center></td><td ><center>Sem dados</center></td></tr>');
            $('#tBodyFaltas').append($tr);
         }
        
        //var table = $('#tblFaltas').dataTable({
          //            searching: false
            //        });
        //table.destroy();

        $("input[type='number']").css("width", "40");

      }
   });
};

// function responsavel por retornar o mes em String com base no numero do mes. 
function returnDescMonth(month) {
   switch (month) {
   case "01":
      return "Janeiro"
      break;
   case "02":
      return "Fevereiro"
      break;
   case "03":
      return "Março"
      break;
   case "04":
      return "Abril"
      break;
   case "05":
      return "Maio"
      break;
   case "06":
      return "Junho"
      break;
   case "07":
      return "Julho"
      break;
   case "08":
      return "Agosto"
      break;
   case "09":
      return "Setembro"
      break;
   case "10":
      return "Outubro"
      break;
   case "11":
      return "Novembro"
      break;
   case "12":
      return "Dezembro"
      break;
   }
}

// Function responsavel por executar o envio para o servidor
// node das faltas registradas. Envolve validacao, envio via ajax e mensagem 
// na tela para o usuario.
function enviarFaltas() {
   var faltas = [];

   $('input[type="number"]').each(function () {
      faltas[faltas.length] = this.name + "_" + this.value;
   });

   $.ajax({
      type: 'POST',
      data: JSON.stringify(faltas),
      cache: false,
      contentType: 'application/json',
      url: '/home/desempenho/faltas/registrar',
      success: function (retorno) {
         if (retorno == true) alert("Lançamentos realizados com sucesso");
         else alert("Falha ao efetuar lançamentos");
      }
   });

}