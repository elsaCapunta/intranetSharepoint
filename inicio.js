var datos = [
    { titulo: "Título 1", descripcion: "Descripción 1", imagen: "imagen1.jpg" },
    { titulo: "Título 2", descripcion: "Descripción 2", imagen: "imagen2.jpg" },
    { titulo: "Título 3", descripcion: "Descripción 3", imagen: "imagen3.jpg" }
  ];
  
  
var datosWeather =


(function() {

	getLocationAndCallWeatherAPI();
	getNoticias();
	getCapacitaciones();
	getPlataformas();
	getFaqs();
	
	$('#recipeCarousel').carousel({
	  interval: 10000
	});
	
	$('#recipeCarouselCapa').carousel({
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



  // Función para crear una tarjeta con los datos proporcionados
  function crearTarjeta(titulo, descripcion, imagen) {
    var cardHtml = `<div class="col-md-4 mb-4">
        <div class="card">
          <img src="${imagen}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${titulo}</h5>
            <p class="card-text">${descripcion}</p>
          </div>
        </div>
      </div>
    `;
    return cardHtml;
  }
  
  
function addCard(){

	var cardRow = document.getElementById("cardRow");
	datos.forEach(function(dato) {
	var tarjeta = crearTarjeta(dato.titulo, dato.descripcion, dato.imagen);
	cardRow.innerHTML += tarjeta;
	});

}

function agruparFechasConDatos(data) {
   const fechasAgrupadas = {};

    data.list.forEach(item => {
        const fecha = item.dt_txt.split(' ')[0];
        if (!fechasAgrupadas[fecha]) {
            fechasAgrupadas[fecha] = [];
        }
        fechasAgrupadas[fecha].push(item);
    });
    return fechasAgrupadas;
}

function obtenerEntradasTemperaturasExtremasPorDia(data) {
    const fechasAgrupadasConDatos = agruparFechasConDatos(data);
    const entradasTemperaturasExtremasPorDia = [];

    for (const fecha in fechasAgrupadasConDatos) {
        if (fechasAgrupadasConDatos.hasOwnProperty(fecha)) {
            const entradas = fechasAgrupadasConDatos[fecha];
            let entradaTemperaturaMinima = null;
            let entradaTemperaturaMaxima = null;

            entradas.forEach(entrada => {
                if (!entradaTemperaturaMinima || entrada.main.temp_min < entradaTemperaturaMinima.main.temp_min) {
                    entradaTemperaturaMinima = entrada;
                }
                if (!entradaTemperaturaMaxima || entrada.main.temp_max > entradaTemperaturaMaxima.main.temp_max) {
                    entradaTemperaturaMaxima = entrada;
                }
            });

            entradasTemperaturasExtremasPorDia.push({
                fecha: fecha,
                temp_min_entrada: entradaTemperaturaMinima,
                temp_max_entrada: entradaTemperaturaMaxima
            });
        }
    }

    return entradasTemperaturasExtremasPorDia;
}

function traducir(clima) {
    switch(clima) {
        case 'Thunderstorm':
            return 'Tormenta eléctrica';
		case 'Llovizna':
        	return '';
        case 'Rain':
            return 'Lluvia';
        case 'Snow':
            return 'Nieve';
		case 'Clear':
            return 'Despejado';
		 case 'Clouds':
            return 'Nublado';        
        default:
            return 'Clima desconocido';
    }
}


function getLocationAndCallWeatherAPI() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeatherData);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Función para mostrar la latitud y longitud y llamar a la función para hacer la solicitud a la API de OpenWeatherMap
function showWeatherData(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	
	// Llamamos a la función para hacer la solicitud a la API de OpenWeatherMap
	callWeatherAPI(latitude, longitude);
}

function callWeatherAPI(latitude, longitude){

	 const apiKey = '';
	 const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        // Hacemos la solicitud a la API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            mostrarTarjetas(data)
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

}


function createCardWeather(diaSemana, diaCalendario, temMin, temMax, tipoDia, imagen, indice) {
	let tipoDiaSemana = traducir(tipoDia);
	var cardHtml = "";
	if(indice > 1){
		cardHtml += `<div class="card card-custom card-clima-semana" style="margin-left: 25px;">`
	}else{
		cardHtml += `<div class="card card-custom card-clima-semana">`
	}
    cardHtml += `    	
		  <div class="card-body">
		   <div class="card-titulo-semana">
		    <h5 class="card-title">${diaSemana}</h5>
		    </div>
		    <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">${diaCalendario}</h6>
		   	<img src="https://openweathermap.org/img/wn/${imagen}@2x.png" class="card-img-top" alt="..." style="width: 48px;height: 48px;">
			<h5 class="">${temMax}°</h5>
			<h6 class="mb-2 text-muted">${tipoDiaSemana}</h6>
		    <p class="card-text tem-max-min">${temMin} - ${temMax}℃</p>
		  </div>
		</div>`;
    return cardHtml;
    //<img src="../SiteAssets/img/${imagen}.png" class="card-img-top" alt="..." style="width: 48px;height: 48px;">
}

function createCardWeatherToday(diaSemana, ubicacion, temMin, temMax, tipoDia, imagen, temActual) {
	let tipoDiaGet = traducir(tipoDia);
    var cardHtml = `
		    <h5 class="">Mi ubicación</h5>
		    <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">${ubicacion}</h6>
		   	<img src="https://openweathermap.org/img/wn/${imagen}@2x.png" class="card-img-top" alt="..." style="width: 79px;height: 79px;">
			<h5 style="font-size: 60px;color: #25458A;">${temActual}°</h5>
			<h6 class="mb-2 text-muted">${tipoDiaGet}</h6>
		    <p class="card-text tem-max-min">Máxima : ${temMax}℃ - Mínima : ${temMin}℃ </p>`;
    return cardHtml;
    //<img src="../SiteAssets/img/${imagen}.png" class="card-img-top" alt="..." style="width: 79px;height: 79px;">
}

  
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}


function mostrarTarjetas(data) {
    const entradasTemperaturasExtremasPorDia = obtenerEntradasTemperaturasExtremasPorDia(data);
    const dia = document.getElementById('climadia');
    const semana = document.getElementById('climaSemana'); // Cambia 'container' al ID correcto de tu contenedor
	console.log(entradasTemperaturasExtremasPorDia);
    // Mostrar la primera entrada en una tarjeta aparte
    if (entradasTemperaturasExtremasPorDia.length > 0) {
        const primerEntrada = entradasTemperaturasExtremasPorDia[0];
        const fechaPrimerEntrada = new Date(primerEntrada.fecha);
        const diaSemanaPrimerEntrada = capitalizarPrimeraLetra(fechaPrimerEntrada.toLocaleDateString('es-ES', { weekday: 'long' }));
        const ubicacionPrimerEntrada = data.city.name;
        const temMinPrimerEntrada = Math.round(primerEntrada.temp_min_entrada.main.temp_min);
        const temActualPrimerEntrada = Math.round(data.list[0].main.temp);
        const temMaxPrimerEntrada = Math.round(primerEntrada.temp_max_entrada.main.temp_max);
        const tipoDiaPrimerEntrada = primerEntrada.temp_max_entrada.weather[0].main; // Asumiendo que el tipo de día está en la primera entrada del día
        const imagenPrimeraEntrada = primerEntrada.temp_max_entrada.weather[0].icon;
	    const cardHtmlPrimerEntrada = createCardWeatherToday(diaSemanaPrimerEntrada, ubicacionPrimerEntrada, temMinPrimerEntrada, temMaxPrimerEntrada, tipoDiaPrimerEntrada,imagenPrimeraEntrada,temActualPrimerEntrada);
        dia.innerHTML += cardHtmlPrimerEntrada;
    }

    // Mostrar las demás entradas en tarjetas separadas
    for (let i = 1; i < entradasTemperaturasExtremasPorDia.length; i++) {
    	
        const entrada = entradasTemperaturasExtremasPorDia[i];
        const fecha = new Date(entrada.fecha);
        const diaSemana = capitalizarPrimeraLetra(fecha.toLocaleDateString('es-ES', { weekday: 'long' }));
        const diaCalendario = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const temMin = Math.round(entrada.temp_min_entrada.main.temp_min);
        const temMax = Math.round(entrada.temp_max_entrada.main.temp_max);
        const tipoDia = entrada.temp_max_entrada.weather[0].main; // Asumiendo que el tipo de día está en la primera entrada del día
        const imagen = entrada.temp_max_entrada.weather[0].icon;
        const cardHtml = createCardWeather(diaSemana, diaCalendario, temMin, temMax, tipoDia, imagen, i);
        semana.innerHTML += cardHtml;
        
    }}


//************************ NOTICIAS *****************************//

function createCardNoticias(urlImg, titulo, cuerpo, idNoticia, indice) {
    let cuerpoTxt = cuerpo.substring(0, 150);
    var cardHtml = "";

    if (indice > 0) {
        cardHtml += `<div class="carousel-item">`;
    } else {
        cardHtml += `<div class="carousel-item active">`;
    }

    cardHtml += `
        <div class="col-md-3">    	
            <div class="card">
                <img src="${urlImg}" class="card-img-top" alt="..." style="height: 150px;">
                <div class="card-body card-body-noticias">
                    <h5 class="card-title titulo-card-noticias">${titulo}</h5>
                    <p class="card-text">${cuerpoTxt}...</p>		   
                </div>
                <div class="" style="padding: 0.75rem 1.25rem">
                    <a href="#" class="a-footer-noticias">Leer más</a>
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


//************************ CAPACITACIONES *****************************//

function createCardCapacitaciones(urlImg, titulo, cuerpo, idNoticia, indice){
	let cuerpoTxtCp = cuerpo.substring(0, 150);
	var cardHtml = "";
 if (indice > 0) {
        cardHtml += `<div class="carousel-item">`;
    } else {
        cardHtml += `<div class="carousel-item active">`;
    }
    
    cardHtml += `
        <div class="col-md-3">    	
            <div class="card">
                <img src="${urlImg}" class="card-img-top" alt="..." style="height: 150px;">
                <div class="card-body card-body-noticias">
                    <h5 class="card-title titulo-card-noticias">${titulo}</h5>
                    <p class="card-text">${cuerpoTxtCp}...</p>		   
                </div>
                <div class="" style="padding: 0.75rem 1.25rem">
                    <a href="#" class="a-footer-noticias">Leer más</a>
                </div>
            </div>
        </div>
    </div>`;

    return cardHtml;


}


function getCapacitaciones(){
    const divCapacitaciones = document.getElementById('divCapacitaciones');
    divCapacitaciones.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas tarjetas

    var noticias = "?$filter=activo eq 1&$orderby=orden asc&$expand=AttachmentFiles&$top=4";

    getListItem("Capacitaciones", noticias, function (data) {
        if (data.d.results.length > 0) {
            console.log(data.d.results);
            var dataCapacitaciones = data.d.results;

            dataCapacitaciones.forEach(function (element, index) {
                const cardHtmlCapacitacion = createCardCapacitaciones(element.AttachmentFiles.results[0].ServerRelativeUrl, element.Title, element.texto, element.ID, index);
                divCapacitaciones.innerHTML += cardHtmlCapacitacion;
            });
        }

    }, function (d) {
        console.log(d);

    });
}

//************************ FAQS *****************************//

function createCardFaqs(titulo, respuestaList, idPlataforma, indice){
	let tituloTxtFaqs = titulo.substring(0, 150);
	let respuesta = respuestaList.substring(0, 150) +" ...";
	var cardHtml = "";

	 cardHtml += ` 		    
		  <div class="accordion" id="accordionExample${indice}" style="margin-top:26px;">
			  <div class="card" style="">
			    <div class="card-header" id="headingOne${indice}">
			      <h2 class="mb-0">
			        <button id="btnCollapse${indice}" class="btn btn-link btn-block text-left d-flex" type="button" data-toggle="collapse" data-target="#collapseOne${indice}" aria-expanded="true" aria-controls="collapseOne${indice}">
			          <span>${tituloTxtFaqs}</span><img id="imgCollapse${indice}" class="ml-auto" src="../SiteAssets/img/arrowD.png" alt="Card image cap" style="width: 24px;padding-top: 4px;">
			        </button>
			      </h2>
			    </div>
			
			    <div id="collapseOne${indice}" class="collapse" aria-labelledby="headingOne${indice}" data-parent="#accordionExample${indice}">
			      <div class="card-body text-left">
 						${respuesta }
 			      </div>
			    </div>
			  </div>
			</div>`;
    return cardHtml;

}


function getFaqs(){
	
	const divFaqs = document.getElementById('divFaqs');
	var noticias = "?$filter=activo eq 1&$orderby=orden asc&$expand=AttachmentFiles&$top=3";
	
	getListItem("FAQS",noticias, function (data) {
    	if(data.d.results.length > 0){
    		console.log(data.d.results);
    		var dataFaqs = data.d.results;
    		
    		dataFaqs.forEach(function(element, index) {
			    const cardHtmlFaqs = createCardFaqs(element.Title,element.texto, element.ID, index);
			    divFaqs.innerHTML += cardHtmlFaqs;
			});    		
		}

	}, function (d) {
        console.log(d);
       
    });

}


function cambiaIcon(indice){

	let elemento = document.getElementById("btnCollapse"+indice);
	let imagen = document.getElementById("imgCollapse"+indice);
	    imagen.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

       	if (elemento.classList.contains("collapsed")) {
			imagen.src = "../SiteAssets/img/arrowUp.png";
		   // alert("El elemento tiene la clase 'collapsed'"); // flecha arriba
		} else {
			imagen.src = "../SiteAssets/img/arrowD.png";
		   // alert("El elemento no tiene la clase 'collapsed'"); // flecha abajo
		}

}


//************************ PLATAFORMAS *****************************//

function createCardPlataformas(titulo, idPlataforma, indice, url){
	let cuerpoTxtPl = titulo.substring(0, 150);
	var cardHtml = "";
	if(indice > 0){
		cardHtml += `<div class="card" style="margin-top: 16px">`
	}else{
		cardHtml += `<div class="card" style="">`
	}

	cardHtml += `
	    <a href="${url}" class="enlace-card" target="_blank">
	        <div class="card-horizontal">
	            <div class="img-square-wrapper d-flex justify-content-center">
	                <img class="img-plataformas" src="../SiteAssets/img/IconPlataformas.png" alt="Card image cap">
	            </div>
	            <div class="card-body">
	                <p class="card-text">${cuerpoTxtPl}</p>
	            </div>
	        </div>
	    </a>`;
    return cardHtml;


}


function getPlataformas(){
	
	const divPlataformas = document.getElementById('divPlataformas');
	var noticias = "?$filter=activo eq 1&$orderby=orden asc&$expand=AttachmentFiles&$top=10";
	
	getListItem("Plataformas",noticias, function (data) {
    	if(data.d.results.length > 0){
    		console.log(data.d.results);
    		var dataPlataformas = data.d.results;
    		
    		dataPlataformas.forEach(function(element, index) {
			    const cardHtmlPlataformas = createCardPlataformas(element.Title, element.ID, index, element.url.Url);
			    divPlataformas.innerHTML += cardHtmlPlataformas;
			});    		
		}

	}, function (d) {
        console.log(d);
       
    });

}























