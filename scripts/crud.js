// Grupo 2: Giorgina Serron, Erika Plachicoff, Camila Marcote, Luisanna Barrales, Valentina Hernández

// URL de la API creada en MockAPI
const API_URL = 'https://672ca08a1600dda5a9f93546.mockapi.io/users'

// Botones
const botonBuscar = document.getElementById('btnGet')
const botonAgregar = document.getElementById('btnPost')
const botonModificar = document.getElementById('btnPut')
const botonBorrar = document.getElementById('btnDelete')

// Inputs
const inputBuscar = document.getElementById('inputGetId')
const inputNombre = document.getElementById('inputPostNombre')
const inputApellido = document.getElementById('inputPostApellido')
const inputModificar = document.getElementById('inputPutId')
const inputBorrar = document.getElementById('inputDelete')

// ul de resultados
const resultados = document.getElementById('results')

// Constantes modal
const inputModalNombre = document.getElementById('inputPutNombre')
const inputModalApellido = document.getElementById('inputPutApellido')
const botonModalGuardar = document.getElementById('btnSendChanges')

// Función para mostrar usuarios (todos, o uno solo)
function mostrarUsuarios(usuarios) {
  resultados.innerHTML = ''
  usuarios.forEach((usuario) => {
    const listItem = document.createElement('li')
    listItem.textContent = `${usuario.id} - ${usuario.name} ${usuario.lastName}`
    resultados.appendChild(listItem)
  })
}

// Listener para buscar en la API todos los usuarios o uno solo (por su ID)
botonBuscar.addEventListener('click', () => {
  const id = inputBuscar.value.trim()
  fetch(id ? `${API_URL}/${id}` : API_URL) // Ternaria: Si existe ID, utilizamos la URL + id, y si no existe, utilizamos la URL normal
    .then((response) => {
      if (!response.ok) return alertaError('Error al obtener datos de la API')
      return response.json()
    })
    .then((usuarios) => mostrarUsuarios(Array.isArray(usuarios) ? usuarios : [usuarios])) // Ternaria: Si usuarios es un array, mandamos usuarios simplemente, y si no, creamos un array de un solo objeto, con ese solo usuario
})

// Listener para agregar usuario
botonAgregar.addEventListener('click', () => {
  const name = inputNombre.value.trim()
  const lastName = inputApellido.value.trim()

  if (name && lastName) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastName })
    }).then((response) => {
      if (!response.ok) return alertaError('Error al agregar usuario a la API')
      inputNombre.value = ''
      inputApellido.value = ''
      alert('✅ Usuario agregado con éxito!')
    })
  }
})

// Listener para borrar un usuario por su ID
botonBorrar.addEventListener('click', () => {
  const id = inputBorrar.value.trim()

  if (!id) return alert('Ingrese el ID del usuario a eliminar')

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => {
    if (!response.ok) return alertaError('Error al eliminar usuario de la API')
    inputBorrar.value = ''
    alert('✅ Usuario eliminado con éxito!')
  })
})

// Listener para obtener ID de usuario y abrir modal con los datos de dicho usuario y modificarlos
botonModificar.addEventListener('click', () => {
  const id = inputModificar.value.trim()

  if (!id) return alert('Ingrese el ID del usuario a modificar')

  fetch(`${API_URL}/${id}`)
    .then((response) => {
      if (!response) return alertaError('Error al encontrar usuario de la API')
      return response.json()
    })
    .then((usuario) => {
      inputModalNombre.value = usuario.name
      inputModalApellido.value = usuario.lastName
      document.getElementById('dataModal').dataset.userId = id // Guardamos el ID dentro del modal, para posterior uso al modificar el usuario
      new bootstrap.Modal(document.getElementById('dataModal')).show() // Mostramos el modal que se encuentra oculto en el HTML
    })
})

// Listener para modificar los datos de un usuario
botonModalGuardar.addEventListener('click', () => {
  const id = document.getElementById('dataModal').dataset.userId
  const name = inputModalNombre.value.trim()
  const lastName = inputModalApellido.value.trim()

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lastName })
  }).then((response) => {
    if (!response) return alertaError('Error al modificar usuario en la API')
    bootstrap.Modal.getInstance(document.getElementById('dataModal')).hide() // Ocultamos el modal
    inputModificar.value = ''
    alert('✅ Usuario modificado con exito')
  })
})

// Alerta error
function alertaError(mensaje) {
  const alertaError = document.getElementById('alert-error')
  alertaError.textContent = mensaje
  alertaError.classList.add('show')
  setTimeout(() => alertaError.classList.remove('show'), 3000)
}

// Función para validar campos
function verificacionCampos() {
  // Si el campo está escrito, va a ser false (habilita el botón), y si no, va a ser true (deshabilita el botón)
  botonAgregar.disabled = !inputNombre.value.trim() || !inputApellido.value.trim()
  botonModificar.disabled = !inputModificar.value.trim()
  botonBorrar.disabled = !inputBorrar.value.trim()
}

inputNombre.addEventListener('input', verificacionCampos)
inputApellido.addEventListener('input', verificacionCampos)
inputModificar.addEventListener('input', verificacionCampos)
inputBorrar.addEventListener('input', verificacionCampos)