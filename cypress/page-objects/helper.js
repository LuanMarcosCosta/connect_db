/// <reference types="cypress" />

export class Helper {

    dataDiaSeguinte() {
        var data = new Date(),
            dia = (data.getDate() + 2).toString(), //seleciona o dia seguinte
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro come�a com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
        return diaF + "/" + mesF + "/" + anoF;
    }
}