angular.module('offersapp.dao', [])
.factory('DaoFact', function() {
    var anunciantes = new SimpleDataSet(),
        ofertas = new SimpleDataSet();
    
    anunciantes.insertAll([
        { id: 1, razao: 'Adicao Comércio' },
        { id: 2, razao: 'Mercearia do Xico' }
    ]);
    
    ofertas.insertAll([
        { id: 1, descricao: "Arroz D'Mata Tipo 1 PCT 5kg", valor: 14.29, validade: new Date(), anunciante: anunciantes.getById(1) },
        { id: 2, descricao: "Feijão Galo PCT 3kg", valor: 10.49, validade: new Date(), anunciante: anunciantes.getById(1) },
        { id: 3, descricao: "Extrato de Tomante Pomarola UN 350g", valor: 1.99, validade: new Date(), anunciante: anunciantes.getById(1) },
        { id: 4, descricao: "Feijão da Roça Agranel KG", valor: 4.49, validade: new Date(), anunciante: anunciantes.getById(2) }
    ]);
    
    return {
        getAnunciantes: function() {
            return anunciantes;
        },
        getOfertas: function() {
            return ofertas;
        }
    }
});