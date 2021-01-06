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

    $("#botao-reiniciar").click(reiniciarJogo);
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
    var tempoRestante = $("#tempo-digitacao").text()

    // função ONE chama uma vez só, função ON chama todas as vezes 
    campo.one("focus", function(){
        var cronometroID = setInterval(function(){
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);

            if(tempoRestante == 0){
                campo.attr("disabled", true)
                $("#botao-reiniciar").attr("disabled", false)
                campo.toggleClass("campo-desativado")
                clearInterval(cronometroID)
            }
        }, 1000)
    })
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
    var frase = $(".frase").text()
    campo.on("input", function(){
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