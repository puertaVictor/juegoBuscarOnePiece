/**
 * Captura de los DIVs, botones y variables globales
 */

let divRestoAplicacion = document.getElementById("restoAplicacion");
let divBienvenida = document.getElementById("bienvenida");
let divTabla = document.getElementById("tablero");
let btnScore = document.getElementById("score");

let nivelSeleccionado;
let tiempoTotal = 0;
let tablaBloqueada = false;
let usuariosRegistrados = [];
let par = { imagen: null, celda: null };

/**
 * Capturamos los controles de nombreUsuario y contraseña
 * Cuando se da al boton se comprueba que los valores sean distinto a vacio
 * En caso de que esten bien guardamos el nombre en el array usuariosRegistrados y llamamos a la función cambioContenido
 */
(function verificarLogin() {
  let nomUsuario = document.getElementById("nomUsuario");
  let passUsuario = document.getElementById("passUsuario");
  let btnIniciaSesion = document.getElementById("btnIniciaSesion");
  btnIniciaSesion.addEventListener("click", function () {
    if (nomUsuario.value !== "" && passUsuario.value !== "") {
      usuariosRegistrados.push(nomUsuario.value);
      cambioContenido();
    }
  });
})();

/**
 * Cargamos el divRestoAplicacion y ocultamos el divBienvenida
 * llamamos a la funcion verificarNivel, que nos retorna el id del radio
 * Llamamos a la funcion nivelElegido con el id de verificarNivel
 */
function cambioContenido() {
  divBienvenida.style.display = "none";
  divRestoAplicacion.style.display = "block";
  let btnStart = document.getElementById("empezarJuego");
  verificarNivel();
  btnStart.addEventListener("click", function () {
    if (nivelSeleccionado) {
      nivelElegido(nivelSeleccionado);
    } else {
      alert("Debe seleccionar un nivel");
    }
  });
}

/**
 * Comprobamos que el usuario ha seleccionado un radio
 */
function verificarNivel() {
  let radios = document.querySelectorAll("input[type='radio']");
  radios.forEach(function (radio) {
    radio.addEventListener("click", function () {
      if (radio.checked) {
        nivelSeleccionado = radio.id;
      }
    });
  });
}

/**
 *
 * @param {*} nivelSeleccionado
 * Los parametros que se pasan a cargarTabla son filas, columnas y numImgenes que se necesitan y el tiempo.
 */
function nivelElegido(nivelSeleccionado) {
  switch (nivelSeleccionado) {
    case "nivel1":
      cargarTabla(4, 4, 8, 160);
      break;
    case "nivel2":
      cargarTabla(4, 5, 10, 120);
      break;
    case "nivel3":
      cargarTabla(4, 8, 16, 60);
      break;
  }
}

/**
 *
 * @param {*} filas --> Filas que componen la tabla
 * @param {*} columnas --> Columnas que componen la tabla
 * @param {*} numImagenes --> Numero de imagenes que componen la tabla
 * @param {*} tiempo --> Tiempo disponivle para jugar
 * Llamamos a la funcion cargarArrayImagenes
 * Hacemos un bucle que mientras el arrayAleatorio sea menor a numImagenes, que se carguen imagenes dentro asegurandonos de que no sean repetidas
 * Por ultimo pasamos a crear tabla las filas,columnas el tiempo y este nuevo array
 */
function cargarTabla(filas, columnas, numImagenes, tiempo) {
  let array = cargarArrayImagenes();
  let arrayAleatorio = [];
  while (arrayAleatorio.length < numImagenes) {
    let indice = Math.floor(Math.random() * array.length);
    let imgAleatoria = array[indice];
    if (!arrayAleatorio.find((img) => img.id === imgAleatoria.id)) {
      arrayAleatorio.push(imgAleatoria);
    }
  }
  crearTabla(filas, columnas, arrayAleatorio, tiempo);
}

/**
 *
 * @returns  La matriz arrayIMG que contiene los objetos de imagen cargados con sus rutas y IDs.
 */
function cargarArrayImagenes() {
  let arrayIMG = [];
  let numImagenes = 16;
  const rutaImagenes = "./imgs/img";
  for (let i = 1; i <= numImagenes; i++) {
    arrayIMG[i - 1] = new Image();
    arrayIMG[i - 1].src = rutaImagenes + i + ".jfif";
    arrayIMG[i - 1].id = i;
  }
  return arrayIMG;
}
/**
 *
 * @param {*} tipo
 * @param {*} contenido
 * @returns La etiqueta creada
 */
function crearElemento(tipo, contenido) {
  let input = document.createElement(tipo);
  input.textContent = contenido;
  return input;
}

/**
 *
 * @param {*} filas -->Filas de la tabla
 * @param {*} columnas --> Columnas de la tabla
 * @param {*} array  --> Array de imagenes
 * @param {*} tiempo --> Tiempo para jugar
 * Primero limpiamos el div, creamos una copia duplicada del array que hemos recibido.
 * Calculamos el ancho de la celda, vamos creando la tabla y dandole estilos.
 * Generamos un numero aleatorio de como maximo el largo de nuesgtro array, y cogemos el src de ese indice, a continuacion borramos el indice de nuestro array con splice
 * con el setTimeout, indicamos el tiempo que estarán visibles las imagenes, concretamente durante 1,5 segundos
 * le damos estilo a la tabla,
 * Luego con el otro setTimeout, cuando acabe el tiempo total, llamamos a la funcionBloquearTabla y a contarImagenesAceptadas
 * Por último añadimos el eventoClik a la tabla y llamamos a la función clickTabla
 *
 */
function crearTabla(filas, columnas, array, tiempo) {
  limpiarDiv();
  tiempoTotal = tiempo * 1000;
  let tabla = crearElemento("table");
  let arrayDuplicado = array.concat(array.slice());
  let tdWidth = 100 / columnas;
  for (let i = 0; i < filas; i++) {
    let tr = crearElemento("tr");
    for (let j = 0; j < columnas; j++) {
      let td = crearElemento("td");
      td.style.width = tdWidth + "%";
      let img = crearElemento("img");
      img.style.maxHeight = "100px";
      img.style.width = "100%";
      let indice = Math.floor(Math.random() * arrayDuplicado.length);
      img.src = arrayDuplicado[indice].src;
      arrayDuplicado.splice(indice, 1);
      td.appendChild(img);
      tr.appendChild(td);
      setTimeout(function () {
        img.style.visibility = "hidden";
      }, 1500);
    }
    tabla.appendChild(tr);
  }
  cargarEstiloTabla(tabla);
  divTabla.appendChild(tabla);

  setTimeout(function () {
    bloquearTabla();
    contarImagenesAceptadas(tiempoTotal);
  }, tiempoTotal);
  tabla.addEventListener("click", clickTabla);
}

/**
 *
 * @param {*} e --> Evento click
 * Definimos un objeto al inicio del programa denominado par, con la propiedad imagen y celda, establecidas como null
 * Cuando el usuario hace click almaceno la imagen y la celda seleccionada, comprobamos si las propiedades no son null, si no lo son se comprueba que las img son iguales.
 * En caso de que lo sean, se elimina el evento click de las celdas, para que no se pueda volver a hacer click sobre las celdas.
 * En caso de que no sean iguales, salta el setTimeOut de 2 milisegundos, para volver a ocultar la imagen y se vuelven a poner las propiedades como null
 *
 */

function clickTabla(e) {

  let imagen = e.target.getElementsByTagName("img")[0];
  let celda = e.target;
  if (imagen && celda !== par.celda && !tablaBloqueada) {
    imagen.style.visibility = "visible";
    if (par.imagen && par.imagen.src === imagen.src) {
      e.stopImmediatePropagation();
      //Sirve la opcion de arriba el stop y lo de abajo comentado, hacemos que el evento no se propage hacia arriba, por lo tanto nunca va a llegar a ejecutar el evento
      
      // par.celda.removeEventListener("click", clickTabla);
      // par.imagen.removeEventListener("click",clickTabla)
      // celda.removeEventListener("click", clickTabla);
      // imagen.removeEventListener("click", clickTabla);
      par.imagen = null;
      par.celda = null;
    } else if (par.imagen && par.imagen.src !== imagen.src) {
      setTimeout(function () {
        imagen.style.visibility = "hidden";
        par.imagen.style.visibility = "hidden";
        par.imagen = null;
        par.celda = null;
      }, 200);
    } else {
      par.imagen = imagen;
      par.celda = celda;
    }
  }
}

/**
 *
 * @param {*} tiempo --> Lo recibimos de la funcion crearTabla, no pasa el tiempoTotal que tenia el usuairo para jugar
 * capturamos el total de imagenes visibles.
 * obtenemos el último nombre del array.
 * Llamamos a esPar() por si cuando acabo el tiempo el usuario habia picado a una imagen y no a otra, para que nos devuelva un numeroPar
 * Con el tiempo total creamos un switch para calcular la puntuacion y se la pasamos a subirPuntosLocal
 */
/**
 *
 *
 * @param {*} tiempo
 */
function contarImagenesAceptadas(tiempo) {
  let imagenesVisibles = document.querySelectorAll(
    'img[style*="visibility: visible"]'
  );
  let ultimoNombreArray = usuariosRegistrados.pop();
  let totalParejas = parseInt(imagenesVisibles.length / 2);
  esPar(totalParejas);
  let puntos;
  switch (tiempo) {
    case 160000:
      puntos = totalParejas * 1;
      break;
    case 120000:
      puntos = totalParejas * 2;
      break;
    case 60000:
      puntos = totalParejas * 3;
      break;
  }
  subirPuntosLocal(ultimoNombreArray, puntos);
}

/**
 *
 * @param {*} nombreUsuario
 * @param {*} puntos
 * Primero comprobamos si el nombre del usuario ya esta guardado en el localStorage
 * Si no existe creamos un array con la puntuacion recibida de contarImagenesAceptadas y lo almacenamos en el localStorage en su respectiva clave
 * Si ya exisge el valor, parseamos los valores de esa clave a un array, comprobamos que sea un array y se añade la puntuacion
 * Finalmente guardamos la puntuacion a la clave correspondiente
 */
function subirPuntosLocal(nombreUsuario, puntos) {
  let usuarioAlmacenado = localStorage.getItem(nombreUsuario);
  if (usuarioAlmacenado === null) {
    let puntuaciones = [puntos];
    localStorage.setItem(nombreUsuario, JSON.stringify(puntuaciones));
  } else {
    let puntuacionesAntiguas = JSON.parse(usuarioAlmacenado);
    if (!Array.isArray(puntuacionesAntiguas)) {
      puntuacionesAntiguas = [puntuacionesAntiguas];
    }
    puntuacionesAntiguas.push(puntos);
    localStorage.setItem(nombreUsuario, JSON.stringify(puntuacionesAntiguas));
  }
}

/**
 *
 * @param {*} totalParejas --> Numero entero
 * @returns --> Numero par
 * Se llama en contarImagenesAceptadas y es por si cuando ha acabado el tiempo al usuario solo le ha dado tiempo a picar en una imagen y no ha encontrado a la pareja
 */
function esPar(totalParejas) {
  if (totalParejas % 2 !== 0) {
    totalParejas--;
  }
  return totalParejas;
}

/**
 * Primero vaciamos el div
 * Creamos la tabla
 * Cogemos las diferentes claves que tenemos en el LocalStorage y sus respectivos valores.
 * COmprobamos si el los valores obtenidos son un array, si lo son sus datos son separados por una coma
 * Por último pegamos la tabla y le damos valores.
 */

function mostrarPuntos() {
  limpiarDiv();
  let tabla = crearElemento("table");
  let encabezado = crearElemento("tr");
  let thUsuario = crearElemento("th", "Usuario");
  let thPuntuaciones = crearElemento("th", "Puntuaciones");
  encabezado.appendChild(thUsuario);
  encabezado.appendChild(thPuntuaciones);
  tabla.appendChild(encabezado);
  for (let i = 0; i < localStorage.length; i++) {
    let clave = localStorage.key(i);
    let valor = JSON.parse(localStorage.getItem(clave));
    let tr = crearElemento("tr");
    let tdUsuario = crearElemento("td", clave);
    let tdPuntuaciones = crearElemento("td");
    if (Array.isArray(valor)) {
      tdPuntuaciones.textContent = valor.join(", ");
    } else {
      tdPuntuaciones.textContent = valor;
    }
    tr.appendChild(tdUsuario);
    tr.appendChild(tdPuntuaciones);
    tabla.appendChild(tr);
  }
  divTabla.append(tabla);
  cargarEstiloTabla(tabla);
}

/**
 * Capturamos la tabla y la bloqueamos.
 */
function bloquearTabla() {
  tablaBloqueada = true;
  let tabla = document.querySelector("table");
  tabla.removeEventListener("click", clickTabla);
  tabla.addEventListener("click", function (e) {
    e.preventDefault();
  });
  alert("Juego Terminado");
}

/**
 *
 * @param {} tabla
 * Estilos para las tablas
 */
function cargarEstiloTabla(tabla) {
  tabla.style.border = "1px solid black";
  tabla.style.borderCollapse = "collapse";
  tabla.style.width = "80%";
  tabla.style.borderSpacing = "0px";
  tabla.querySelectorAll("td").forEach((td) => {
    td.style.border = "3px solid black";
  });
}

/**
 * Función para limpiar el div, vamos eliminando el primer hijo
 */
function limpiarDiv() {
  let divTabla = document.getElementById("tablero");
  while (divTabla.firstChild) {
    divTabla.firstChild.remove();
  }
}

/**
 * Evento para dar mostrar los puntos.
 */
btnScore.addEventListener("click", mostrarPuntos);
