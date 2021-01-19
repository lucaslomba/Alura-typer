// Seletor do jquery
// JQuery(".frase")

// Seletor do JQuery simplificado
// $(".frase")

var tempoInicial = $("#tempo-digitacao").text()
var campo = $(".campo-digitacao")

$(document).ready(function(){
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    ataulizaPlacar();
    $("#botao-reiniciar").click(reiniciarJogo);

    $('#usuarios').selectize({
        create: true,
        sortField: 'text'
    });

    $("#tooltip").tooltipster()
})

function atualizaTamanhoFrase(){
    // .text() seleciona o texto 
    var frase = $(".frase").text();

    // .split(" ") fazendo um split a cada espaço
    var numPalavras = frase.split(" ").length;

    // Seletor mais especifico
    var tamanhoFrase = $("#tamanho-frase");

    tamanhoFrase.text(numPalavras);
}

// =========================================== EVENTOS COM JQUERY ===========================================

function inicializaContadores (){
    campo.on("input", function(){
        var conteudo = campo.val();
        var qtdPalavras = conteudo.split(/\S+/).length - 1
        $("#contador-palavras").text(qtdPalavras)
    
        var qtdCaracteres = conteudo.length
        $("#contador-caracteres").text(qtdCaracteres)
    })
}

function inicializaCronometro (){
    // função ONE chama uma vez só, função ON chama todas as vezes 
    campo.one("focus", function(){
        var tempoRestante = $("#tempo-digitacao").text()
        var cronometroID = setInterval(function(){
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);

            if(tempoRestante == 0){
                clearInterval(cronometroID)
                finalizaJogo()
            }
        }, 1000)
    })
}

function finalizaJogo(){
    campo.attr("disabled", true)
    $("#botao-reiniciar").attr("disabled", false)
    campo.toggleClass("campo-desativado")
    inserePlacar();
}

function reiniciarJogo(){
    campo.attr("disabled", false)
    campo.val("");
    $("#contador-palavras").text("0")
    $("#contador-caracteres").text("0")
    $("#tempo-digitacao").text(tempoInicial);
    $("#botao-reiniciar").attr("disabled", true)
    campo.toggleClass("campo-desativado")
    campo.removeClass("campo-vermelho")
    campo.removeClass("campo-verde")
    inicializaCronometro();
    inicializaMarcadores();
}

function inicializaMarcadores(){
    campo.on("input", function(){
        var frase = $(".frase").text()
        var digitado = campo.val();
        var comparavel = frase.substr(0, digitado.length)

        if(digitado == comparavel){
            campo.addClass("campo-verde")
            campo.removeClass("campo-vermelho")
        }else{
            campo.addClass("campo-vermelho")
            campo.removeClass("campo-verde")
        }
    })
}

function inserePlacar(){
    var corpoTable = $(".placar").find("tbody");
    var usuario = $("#usuarios").val()
    var numPalavras = $("#contador-palavras").text()
    var linha = novaLinha(usuario, numPalavras)
    linha.find(".botao-remover").click(removeLinha)

    corpoTable.prepend(linha)
    $(".placar").slideDown(500)
    scroolPlacar();
}

function scroolPlacar(){
    var posicao = $(".placar").offset().top()
    $("body").animate({
        scrollTop: posicao + "px"
    }, 1000)
}

function novaLinha(usuario, numPalavras){
    var linha = $("<tr>")
    var colunaUsuario = $("<td>").text(usuario)
    var colunaPalavras = $("<td>").text(numPalavras)
    var colunaRemover = $("<td>")
    var link = $("<a>").addClass("botao-remover").attr("href", "#")
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete")

    link.append(icone);
    colunaRemover.append(link)
    linha.append(colunaUsuario)
    linha.append(colunaPalavras)
    linha.append(colunaRemover)

    return linha
}

function removeLinha(){
    $(".botao-remover").click(function(event){
        event.preventDefault();
        $(this).parent().parent().fadeOut()
    })
}

$("#botao-placar").click(mostraPlacar)

function mostraPlacar(){
    $(".placar").stop().slideToggle(600)
}

$("#botao-frase").click(fraseAleatoria)

function fraseAleatoria(){
    $("#spinner").show()

    $.get("http://localhost:3000/frases", trocaFraseAleatoria).fail(function(){
        $("#erro").show()
        setTimeout(function(){
            $("#erro").hide()
        }, 2000)
    }).always(function(){
        $("#spinner").hide()
    })
}

function trocaFraseAleatoria(data){
    var frase = $(".frase")
    var numAleatorio = Math.floor(Math.random() * data.length)
    frase.text(data[numAleatorio].texto)
    atualizaTamanhoFrase()
    atualizaTempoInicial(data[numAleatorio].tempo)
}

function atualizaTempoInicial(pTempo){
    tempoInicial = pTempo
    var tempo = $("#tempo-digitacao")
    tempo.text(pTempo)
}

$("#botao-frase-id").click(buscaFrase)

function buscaFrase(){
    $("#spinner").show()
    var fraseID = $("#frase-id").val();
    var dados = { id: fraseID }
    $.get("http://localhost:3000/frases", dados, trocaFrase).fail(function(){
        $("#erro").show()
        setTimeout(function(){
            $("#erro").hide()
        }, 2000)
    }).always(function(){
        $("#spinner").hide()
    })
}

function trocaFrase(data){
    var frase = $(".frase")
    frase.text(data.texto)
    atualizaTamanhoFrase()
    atualizaTempoInicial(data.tempo)
}

$("#botao-sync").click(sincronizaPlacar)

function sincronizaPlacar(){
    var placar = [];
    var linhas = $("tbody>tr")
    linhas.each(function(){
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras = $(this).find("td:nth-child(2)").text();
        
        var score ={
            usuario: usuario,
            pontos: palavras
        }

        placar.push(score)
    })

    var dados = {
        placar: placar
    }
    $.post("http://localhost:3000/placar", dados, function(){
        alert("saved")
    })
}

function ataulizaPlacar(){
    $.get("http://localhost:3000/placar", function(data){
        $(data).each(function(){
            var linha = novaLinha(this.usuario, this.pontos)
            linha.find(".botao-remover").click(removeLinha)
            $("tbody").append(linha)
        })
    })
}