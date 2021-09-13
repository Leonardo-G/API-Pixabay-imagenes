const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registroPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener("submit", validarFormulario)
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if(terminoBusqueda === "" ){
        mostrarAlerta("Agrega un termino de busqueda");
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector(".error")

    if(!existeAlerta){
        const alerta = document.createElement("p");
        alerta.classList.add("error");
        alerta.innerHTML = `
            <strong>Error!</strong>
            <span>${mensaje}</span>
        `;

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function buscarImagenes(){
    const termino = document.querySelector("#termino").value;
    const key = "22833219-081a3a2cdcda8582997c3882c";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits)
        })
}

//GEnerador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registroPorPagina))
}

function mostrarImagenes(imagenes){
    
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    //Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="bloque">
                <img class="bloque__imagen" src="${previewURL}">
                <div class="bloque__info">
                    <p class="info">${likes} <span class="infoDeclarada">Me gusta</span></p>
                    <p class="info">${views} <span class="infoDeclarada">Veces Vista</span></p>
                    <a class="btn" href="${largeImageURL}" rel="noopener noreferrer">
                        Ver Imagen
                    </a>
                </div>
            </div>
        `
    });

    //agregamos el evento a la clase BTN, para abrir la imagen
    const btns = document.querySelectorAll(".btn"); 
    btns.forEach(btn => btn.addEventListener("click", abrirImagen))

    //Limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    //Generamos el nuevo HTML
    imprimirPaginador();
}

//Creamos el ligthbox
function abrirImagen(e){
    e.preventDefault()

    const divImagen = document.createElement("div");
    divImagen.classList.add("divImagen");

    const contenedorImg = document.createElement("div");
    contenedorImg.classList.add("divImagen__contenedor");
    
    const imagen = document.createElement("img");
    imagen.src = e.target.href;
    imagen.classList.add("divImagen__img");

    //botón para eliminar el div de la imagen
    const eliminarImagen = document.createElement("p");
    eliminarImagen.textContent = "X";
    eliminarImagen.classList.add("cerrar");
    eliminarImagen.onclick = () => divImagen.remove()

    //Insertamos en el HTML
    contenedorImg.appendChild(imagen)
    contenedorImg.appendChild(eliminarImagen)
    divImagen.appendChild(contenedorImg)
    document.body.appendChild(divImagen)
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done } = iterador.next();
        if(done) return;

        //Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("btn--paginador");

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes()
        }
        
        paginacionDiv.appendChild(boton);
    }
    
}