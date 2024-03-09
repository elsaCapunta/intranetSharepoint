var datos = [
    { titulo: "Título 1", descripcion: "Descripción 1", imagen: "imagen1.jpg" },
    { titulo: "Título 2", descripcion: "Descripción 2", imagen: "imagen2.jpg" },
    { titulo: "Título 3", descripcion: "Descripción 3", imagen: "imagen3.jpg" }
  ];
  
  
var datosWeather =


(function() {

	getLocationAndCallWeatherAPI();
	
})();



  // Función para crear una tarjeta con los datos proporcionados
  function crearTarjeta(titulo, descripcion, imagen) {
    var cardHtml = `
      <div class="col-md-4 mb-4">
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


function createCardWeather(diaSemana, diaCalendario, temMin, temMax, tipoDia, imagen) {
    var cardHtml = `
    	<div class="card card-custom">
		  <div class="card-body">
		    <h5 class="card-title">${diaSemana}</h5>
		    <hr>
		    <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">${diaCalendario}</h6>
		   	<img src="../SiteAssets/img/${imagen}.png" class="card-img-top" alt="..." style="width: 48px;height: 48px;">
			<h5 class="">${temMax}°</h5>
			<h6 class="mb-2 text-muted">${tipoDia}</h6>
		    <p class="card-text tem-max-min">${temMin} - ${temMax}℃</p>
		  </div>
		</div>`;
    return cardHtml;
}

function createCardWeatherToday(diaSemana, ubicacion, temMin, temMax, tipoDia, imagen, temActual) {
    var cardHtml = `
    	<div class="card card-today">
		  <div class="card-body">
		    <h5 class="card-title">Mi ubicación</h5>
		    <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">${ubicacion}</h6>
		   	<img src="../SiteAssets/img/${imagen}.png" class="card-img-top" alt="..." style="width: 79px;height: 79px;">
			<h5 style="font-size: 60px;color: #25458A;">${temActual}°</h5>
			<h6 class="mb-2 text-muted">${tipoDia}</h6>
		    <p class="card-text tem-max-min">Máxima : ${temMax}℃ - Mínima : ${temMin}℃ </p>
		  </div>
		</div>`;
    return cardHtml;
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
        const tipoDiaPrimerEntrada = primerEntrada.temp_max_entrada.weather[0].description; // Asumiendo que el tipo de día está en la primera entrada del día
        const imagenPrimeraEntrada = primerEntrada.temp_max_entrada.weather[0].main;
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
        const tipoDia = entrada.temp_max_entrada.weather[0].description; // Asumiendo que el tipo de día está en la primera entrada del día
        const imagen = entrada.temp_max_entrada.weather[0].main;
        const cardHtml = createCardWeather(diaSemana, diaCalendario, temMin, temMax, tipoDia, imagen);
        semana.innerHTML += cardHtml;
    }}






















