//Variables
  const itemsPerPage = 40;
  //Selectores
    const formulario = document.querySelector('#formulario');
    const resultado = document.querySelector('#resultado');
    const paginacion = document.querySelector('#paginacion');


//Event listeners
document.addEventListener('DOMContentLoaded', () => {
  formulario.addEventListener('submit', validarFormulario)
  paginacion.addEventListener('click', cambiarPagina)
})


//Funciones
function validarFormulario(e) {
  e.preventDefault()
  const terminoBusqueda = document.querySelector('#termino').value;
  if(terminoBusqueda == '') {
    mostrarAlerta('Ingresa un termino de busqueda', 'error');
  }else {
    consultarAPI(terminoBusqueda)
  }
}

function mostrarAlerta(mensaje, tipo) {
  const divAlert = document.createElement('div');
  divAlert.classList.add('border-2', 'mx-auto', 'text-center', 'font-bold', 'p-2')
  if(tipo == 'error') {
    divAlert.classList.add('border-red-700', 'text-red-700', 'bg-red-200')
  }else {
    divAlert.classList.add('border-green-700', 'text-green-700', 'bg-green-200')
  }
  divAlert.textContent = mensaje
  resultado.append(divAlert)
  setTimeout(() => {
    divAlert.remove()
  }, 3000);
}

async function consultarAPI(terminoBusqueda, pagina = 1) { //La funcion recibe parametro de la busqueda y la pagina a mostrar que por defecto es 1
  limpiarHTML();
  mostrarSpinner() //Muestra un spinner de carga mientras se consulta la API
  const APIKey = '29315623-26aeadb69bfdf606a34c1147b'
  const url = `https://pixabay.com/api/?key=${APIKey}&q=${terminoBusqueda}&per_page=${itemsPerPage}&page=${pagina}` //Se define el url con el que se consultará la api asignando las variables correspondientes
  try {
    const respuesta = await fetch(url)
    const resultado = await respuesta.json()
    const totalPaginas = calcularPaginas(resultado.totalHits) //La API devuelve el valor totalHits que es la cantidad de resultados disponibles y se utiliza para calcular las paginas totales
    generarPaginador(totalPaginas);
    mostrarImagenes(resultado.hits);
  } catch (error) { console.log(error) }
}

function mostrarImagenes(resultados) { //Convierte los resultados de la API en elementos de html
  limpiarHTML()
  resultados.forEach(element => {
    const {likes, previewURL, type, largeImgURL} = element; //Destructuring de los datos de la iagen que vamos a usar
    const card = document.createElement('div');
    card.classList.add('w-full', 'sm:w-1/2', 'md:w-1/3', 'lg:w-1/4', 'my-5', 'rounded', 'p-3')
    card.innerHTML =`
    <img class="w-full" src="${previewURL}" alt="">
    <div class="bg-white p-2">
      <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
      <p class="">De tipo: <span class="font-bold">${type}</span></p>
      <a class="block w-5/6 bg-blue-500 text-white text-center font-bold p-1 mx-auto my-3 rounded hover:bg-blue-700" href="${largeImgURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
    </div>
    `
    resultado.append(card)
  });
}

function calcularPaginas(total) { //Calcula las paginas segun los resultados totales y los resultados por pagina
  return Math.ceil(total / itemsPerPage);
}

function generarPaginador(paginas) {
  while(paginacion.firstChild) { //Borra el paginador existente de la busqueda previa
    paginacion.removeChild(paginacion.firstChild)
  }
  //Scripting del paginados
  const paginador = document.createElement('div')
  paginador.classList.add('w-3/4', 'rounded', 'justify-evenly', 'mx-auto', 'flex', 'flex-wrap', 'md:block')
  for(let i = 0; i < paginas; i++) {
    const page = document.createElement('a')
    page.classList.add('bg-blue-500', 'text-white', 'font-bold', 'py-1', 'px-3', 'rounded', 'mb-3', 'mr-2', 'text-center', 'cursor-pointer')
    page.dataset.pagina = i + 1;
    page.textContent = i + 1;
    paginador.append(page)
  }
  paginacion.append(paginador)
}


function cambiarPagina(e) { //Cambia la pagina de los resultados haciendo uso del parametro 'page' de la api
  console.log(e.target);

  const pagina = e.target.getAttribute('data-pagina')
  const termino = document.querySelector('#termino').value;

  consultarAPI(termino, pagina)
}

function limpiarHTML() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild)
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('sk-fading-circle');

  spinner.innerHTML = `
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
  `
  resultado.append(spinner)
}