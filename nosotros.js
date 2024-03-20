(function() {

	getNosotros();
	
})();


//************************ NOSOTROS	*****************************//

function createCardNosotros(icon, titulo, texto){
	var cardHtml = "";

	 cardHtml += ` 		    
		  <div class="col-lg-4 text-center">
				<div class="card card-nosotros" style="">
				  <div class="card-body text-left">
				    <h5 class="card-title card-title-nosotros"><img src="../SiteAssets/img/nosotros/${icon}.png" class="rounded img-fluid" alt="" style=""/></h5>
				    <h6 class="card-title" style="font-size:24px; font-weight:bold;">${titulo}</h6>
				    <p class="card-text card-text-confia">${texto}</p>
				  </div>
				</div>		
			</div>	`;
    return cardHtml;

}


function getNosotros(){
	
	const divNosotros = document.getElementById('divNosotros');
	var nosotros = "?$orderby=ID asc&$top=3";
	
	getListItem("Nosotros",nosotros, function (data) {
    	if(data.d.results.length > 0){
    		console.log(data.d.results);
    		var dataNosotros = data.d.results;
    		
    		dataNosotros.forEach(function(element, index) {
			    const cardHtmlFaqs = createCardNosotros(element.icono,element.Title, element.texto);
			    divNosotros.innerHTML += cardHtmlFaqs;
			});    		
		}

	}, function (d) {
        console.log(d);
       
    });

}
