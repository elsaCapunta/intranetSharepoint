(function() {

	var queryString = window.location.search;
    var id = queryString.split('=')[1];
    getNoticiaDetalle( id );
    getNoticias();
    
    $('#recipeCarousel').carousel({
	  interval: 10000
	});
	
	
	$('.carousel .carousel-item').each(function(){
	    var minPerSlide = 4;
	    var next = $(this).next();
	    if (!next.length) {
	    next = $(this).siblings(':first');
	    }
	    next.children(':first-child').clone().appendTo($(this));
	    
	    for (var i=0;i<minPerSlide;i++) {
	        next=next.next();
	        if (!next.length) {
	        	next = $(this).siblings(':first');
	      	}
	        
	        next.children(':first-child').clone().appendTo($(this));
	      }
	});

	
})();


function getNoticiaDetalle( id ) {
    const divNoticias = document.getElementById('divTextDetalleNoticia');
    divNoticias.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas tarjetas

    var noticias = "?$filter=activo eq 1 and ID eq " + id + "&$expand=AttachmentFiles";

    getListItem("Noticias", noticias, function(data) {
        if (data.d.results.length > 0) {
            console.log(data.d.results);
            var dataNoticia = data.d.results[0];
			var jumbotron = document.getElementById('imgJumbotron');
	        var rutaImagen = dataNoticia.AttachmentFiles.results[0].ServerRelativeUrl;
		    jumbotron.style.backgroundImage = 'url("' + rutaImagen + '")';

            const cardHtmlNoticia = dataNoticia.noticiaCompleta;
            divNoticias.innerHTML += cardHtmlNoticia;

        }

    }, function(d) {
        console.log(d);

    });
}

//************************ NOTICIAS *****************************//

function createCardNoticias(urlImg, titulo, cuerpo, idNoticia, indice) {
    let cuerpoTxt = cuerpo.substring(0, 150);
    var cardHtml = "";

    if (indice > 0) {
        cardHtml += `<div class="carousel-item">`;
    } else {
        cardHtml += `<div class="carousel-item active">`;
    }
    
    var leerMas = 'Leer m\u00e1s';

    cardHtml += `
        <div class="col-md-3">    	
            <div class="card">
                <img src="${urlImg}" class="card-img-top" alt="..." style="height: 150px;">
                <div class="card-body card-body-noticias">
                    <h5 class="card-title titulo-card-noticias">${titulo}</h5>
                    <p class="card-text">${cuerpoTxt}...</p>		   
                </div>
                <div class="" style="padding: 0.75rem 1.25rem">
                    <a href="/sites/Intranet/SitePages/NoticiaDetalle.aspx?id=${idNoticia}" class="a-footer-noticias" target="_blank">${leerMas}</a>
                </div>
            </div>
        </div>
    </div>`;

    return cardHtml;
}


function getNoticias() {
    const divNoticias = document.getElementById('divNoticias');
    divNoticias.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas tarjetas

    var noticias = "?$filter=activo eq 1&$orderby=orden asc&$expand=AttachmentFiles&$top=10";

    getListItem("Noticias", noticias, function(data) {
        if (data.d.results.length > 0) {
            console.log(data.d.results);
            var dataNoticia = data.d.results;

            dataNoticia.forEach(function(element, index) {
                const cardHtmlNoticia = createCardNoticias(element.AttachmentFiles.results[0].ServerRelativeUrl, element.Title, element.texto, element.ID, index);
                divNoticias.innerHTML += cardHtmlNoticia;
            });
        }

    }, function(d) {
        console.log(d);

    });
}


