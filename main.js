//Blanca Abril Gonzalez 2ºDAW


//clave 1: AIzaSyAykothS02WOULgKb9EclpdTU8gB0qe2IA
//clave 2: AIzaSyDrxOkARLoEKobZKGNUVa3wh718V_k1D8Y


var pagina = 1;
var terminado;
var etqlibro,imagen,titulo,autor;
var descripcionModal,modal,autorModal, tituloModal,imagenModal,editorialModal,paginasModal,publicacionModal,compraModal,categoriaModal;
var busqueda, rbClicado;
var identificadorTA;


    function novedades(){ //prepara la pagina para introducir resultados al inicio con el titulo bienvenido
        $(document).ready(function(){
            $( "#contenedor" ).empty(); // limpia contenedor de todos los libros
            busqueda = "Bienvenido";
            rbClicado = "novedad";
            loadDoc(pagina); //carga la pagina
            scroll(); // scroll infinito
        }); 
    }

    function scroll(){
        var win = $(window);
            win.scroll(function() {
                if ($(document).height() - win.height() <= win.scrollTop()+10) { // cuando el scroll llegue al final de la pagina
                    if(terminado){ //hasta que no muestre los resultados, no actua el scroll de nuevo
                        $('#gif').show(); // se muestra el gif mientras cargan los resultados
                        pagina = pagina + 5; // se obtiene los siguientes 5 resultados
                        loadDoc();
                    }
                }
        });
    }

    function buscadorLibros(){
        $(document).ready(function(){
            $( "#contenedor" ).empty();
            busqueda = document.getElementById("search").value; //obtiene la busqueda
            rbClicado = $("input[name='books']:checked").val(); // obtiene el valor titulo o autor
            loadDoc();
            scroll();
        }); 
    }

    
    function loadDoc() {
        terminado = false; 
        if(rbClicado == 'title'){ // si es radioButton es titulo
            tituloAutor("intitle"); 
        }else if(rbClicado == 'author'){ // si es radioButton es autor
            tituloAutor("inauthor"); 
        }else if("novedad"){ //al cargar la pagina sin busqueda o darle a inicio en los iconos de la parte superior
            tituloAutor("intitle");
        }
    }

    function tituloAutor(variable){
        $.ajax({url: ("https://www.googleapis.com/books/v1/volumes?q=+"+variable+":"+busqueda+"&startIndex="+pagina+"&maxResults=5&key=AIzaSyDrxOkARLoEKobZKGNUVa3wh718V_k1D8Y"), //peticion ajax por titulo y saca resultados de 5 en 5
            success: function(libros){
            if(libros.items != undefined){ // comprueba que existan items dentro del objecto
                for(var i=0; i<libros.items.length;i++){ //recorre los items
                    crearLibro(libros.items[i]); //crea la vista con los datos del libro
                }
                terminado = true; // ya puede volver a hacer scroll
            }else{
                $("#contenedor").html(
                    '<h3 style="color: red; font-family: Arial" > NO SE HAN ENCONTRADO RESULTADOS </h2>'
                );
                $('#gif').hide();
            }
            
            
        }});
        
    }

    function crearElementos(){
        etqlibro = document.createElement("div");
        etqlibro.setAttribute("class","libros");
        imagen = document.createElement("img");
        imagen.setAttribute("class","portadaLibro");
        titulo = document.createElement("h3");
        autor = document.createElement("h5");
        masInfo = document.createElement("a");
        $(masInfo).attr('href','#popup');
        masInfo.setAttribute("class","popup-link");
        modal = document.createElement("div");
        

    }

    function comprobarDatos(libro){ // informacion del libro
        if(libro.volumeInfo.description){
            descripcionModal = libro.volumeInfo.description;
           
        }else{
            descripcionModal = "No hay descripcion";
        }

        if(libro.volumeInfo.title){
            tituloModal = libro.volumeInfo.title;
        }else{
            tituloModal = "No existe título";
        }

        if(libro.volumeInfo.imageLinks){
            imagenModal = libro.volumeInfo.imageLinks.smallThumbnail;
        }else{
            imagenModal = "https://1.bp.blogspot.com/-0_jnwKeyCNc/V7ZCCmW9RlI/AAAAAAAAA5A/NHopsI5onGAGpuFcm5-UBx0k5AXOPfDAwCLcB/s1600/portada%2Blibro%2Bcontraportada.jpg"
        }

        if(libro.volumeInfo.authors){
            autorModal = libro.volumeInfo.authors;
        }else{
            autorModal = "ANONIMO";
        }

        if(libro.volumeInfo.publisher){
            editorialModal = libro.volumeInfo.publisher;
        }else{
            editorialModal = "No hay editorial";
        }
        
        if(libro.volumeInfo.pageCount){
            paginasModal = libro.volumeInfo.pageCount;
        }else{
            paginasModal = "Se desconoce el numero de paginas";
        }

        if(libro.volumeInfo.publishedDate){
            publicacionModal = libro.volumeInfo.publishedDate;
        }else{
            publicacionModal = "Año de publicacion no encontrado";
        }
        if(libro.volumeInfo.previewLink){
            compraModal = libro.volumeInfo.previewLink;
        }

        if(libro.volumeInfo.categories){
            categoriaModal = libro.volumeInfo.categories;
        }else{
            categoriaModal = "Categoria sin definir";
        }
    }

    function crearLibro(libro){
        crearElementos();

        if(libro.volumeInfo.imageLinks){ //coloca la imagen en el contenedor si existe imagen
            $(imagen).attr('src',libro.volumeInfo.imageLinks.smallThumbnail);
            $(etqlibro).append($(imagen));
            
            
        }else{ //la imagene no existe y coloca una imagen alternativa
            $(imagen).attr('src','https://1.bp.blogspot.com/-0_jnwKeyCNc/V7ZCCmW9RlI/AAAAAAAAA5A/NHopsI5onGAGpuFcm5-UBx0k5AXOPfDAwCLcB/s1600/portada%2Blibro%2Bcontraportada.jpg');
            $(etqlibro).append($(imagen));
            
        }

        $(titulo).html(libro.volumeInfo.title); //introduce el titulo en el contenedor
        $(etqlibro).append($(titulo)); 

        if(libro.volumeInfo.authors){ //introduce el autor en el contenedor
            $(autor).html(libro.volumeInfo.authors);
            $(etqlibro).append($(autor));

        }else{ //No existe el autor asi que lo da por ANONIMO 
            $(autor).html("ANONIMO");
            $(etqlibro).append($(autor));
        }
        

        $(masInfo).html("MAS INFORMACION"); // enlace para ver el resto de la informacion del libro
        $(etqlibro).append($(masInfo));

        $(masInfo).click( // cuando se clickea
            function crearModal() {
                $(".modal-wrapper").remove(); //se borra el contenedor creado anteriormente 
                var modal = document.createElement("div"); //crear contenedor
                modal.setAttribute("class","modal-wrapper");
                modal.setAttribute("id","popup");

                comprobarDatos(libro); //obtiene los datos del libro seleccionado
            
                $(modal).html('<div class="popup-contenedor">'+ //rellena el contenedor
                '<h2>'+tituloModal+'</h2>'+
                '<h4>'+autorModal+'</h4>'+
                '<h5> EDITORIAL: '+ editorialModal +'</h5>'+
                '<h5> CATEGORIA: '+ categoriaModal +'</h5>'+
                '<h5> PAGINAS: '+ paginasModal +'</h5>'+
                '<h5> AÑO DE PUBLICACION: '+ publicacionModal +'</h5>'+
                '<a class="enlace" href="'+compraModal+'">Adquirir Libro</a>'+
                '<img src='+imagenModal+'>'+
                '<p align="justify">'+ descripcionModal+'</p>'+
                '<a class="popup-cerrar" href="#a"">X</a>'+
                '</div>');
                $("#contenedor").append(modal);
                
            }

        
        );

        $("#contenedor").append($(etqlibro));
    }