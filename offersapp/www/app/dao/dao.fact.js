angular.module('offersapp.dao', [])
.factory('DaoFact', function() {
    var anunciantes = new SimpleDataSet(),
        categorias = new SimpleDataSet(),
        ofertas = new SimpleDataSet();
    
    anunciantes.insertAll([
        { id: 1, razao: 'Adicao Comércio', endereco: 'Av. São João', numero: '380', cidade: 'Campo Belo', estado: 'MG' },
        { id: 2, razao: 'Mercearia do Xico', endereco: 'Rua Francisco Gibram', numero: '661', cidade: 'Campo Belo', estado: 'MG' },
        { id: 3, razao: 'Açougue do João', endereco: 'Rua Floriano Peixoto', numero: '201', cidade: 'Campo Belo', estado: 'MG' }
    ]);
    
    categorias.insertAll([
        { id: 1, nome: 'Açougue' },
        { id: 2, nome: 'Frios' },
        { id: 3, nome: 'Enlatados' },
        { id: 4, nome: 'Grãos' }
    ]);
    
    ofertas.insertAll([
        { id: 1, descricao: "Arroz D'Mata Tipo 1 PCT 5kg", valor: 14.29, validade: new Date(), anunciante: anunciantes.getById(1), imagem: './img/arroz pct.jpg', categoriaId: 4 },
        { id: 2, descricao: "Feijão Galo PCT 3kg", valor: 10.49, validade: new Date(), anunciante: anunciantes.getById(1), imagem: './img/feijao pct.jpg', categoriaId: 4 },
        { id: 3, descricao: "Extrato de Tomate Pomarola UN 350g", valor: 1.99, validade: new Date(), anunciante: anunciantes.getById(1), categoriaId: 3 },
        { id: 4, descricao: "Feijão da Roça Agranel KG", valor: 4.49, validade: new Date(), anunciante: anunciantes.getById(2), categoriaId: 4 },
        { id: 5, descricao: "Milho verde Fuggini LT 300g", valor: 1.29, validade: new Date(), anunciante: anunciantes.getById(2), categoriaId: 3 },
        { id: 6, descricao: "Azeitona Del Chef PT 800g", valor: 8.39, validade: new Date(), anunciante: anunciantes.getById(1), categoriaId: 3 },
        { id: 7, descricao: "Carne Picanha Friboi KG", valor: 23.49, validade: new Date(), anunciante: anunciantes.getById(1), imagem: './img/carne friboi.jpg', categoriaId: 1 },
        { id: 8, descricao: "Carne de porco Pernil KG", valor: 14.00, validade: new Date(), anunciante: anunciantes.getById(3), categoriaId: 1 }
    ]);
    
    return {
        getAnunciantes: function() {
            return anunciantes;
        },
        getOfertas: function() {
            return ofertas;
        },
        getCategorias: function() {
            return categorias;
        }
    };
});