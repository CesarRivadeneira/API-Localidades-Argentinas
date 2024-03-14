const $d = document;
const $selectProvincias = $d.getElementById("selectProvincias");
const $selectMunicipios = $d.getElementById("selectMunicipios");
const $selectLocalidades = $d.getElementById("selectLocalidades");

function provincia() {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => {
        let $options = `<option value="Elige una provincia">Elige una provincia</option>`;

        json.provincias.forEach(el => $options += `<option value="${el.id}">${el.nombre}</option>`);

        $selectProvincias.innerHTML = $options;

        // Mostrar el botón después de cargar las provincias
        $buttonSection.style.display = "block";
    })
    .catch(error => {
        let message = error.statusText || "Ocurrió un error";

        $selectProvincias.nextElementSibling.innerHTML = `Error: ${error.status}: ${message}`;
    })
}


$d.addEventListener("DOMContentLoaded", provincia)



function localidad(municipio) {
    let localidades = [];

    const fetchLocalidades = (page = 0) => {
        fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${municipio}&campos=id,nombre&max=500&inicio=${page}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            localidades = localidades.concat(json.localidades);
            if (json.total > (page + 1) * 500) {
                fetchLocalidades(page + 1); // Realizar otra solicitud si hay más resultados
            } else {
                // Una vez que se han obtenido todos los resultados
                localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
                let $options = `<option value="Elige una localidad">Elige una localidad</option>`;
                localidades.forEach(el => $options += `<option value="${el.id}">${el.nombre}</option>`);
                $selectLocalidades.innerHTML = $options;

                // Mostrar el botón después de completar la búsqueda
                $buttonSection.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Error fetching localidades:', error);
            let message = error.statusText || "Ocurrió un error";
            $selectLocalidades.nextElementSibling.innerHTML = `Error: ${error.status}: ${message}`;
        });
    }

    fetchLocalidades();
}
$selectMunicipios.addEventListener("change", e => {
    localidad(e.target.value);
    console.log(e.target.value)
})

function obtenerMunicipios(provincia, pagina = 0, municipios = []) {
    fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&max=50&inicio=${pagina * 50}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al obtener los municipios');
            }
            return res.json();
        })
        .then(json => {
            if (json.total > municipios.length) {
                municipios.push(...json.municipios);
                obtenerMunicipios(provincia, pagina + 1, municipios);
            } else {
                mostrarMunicipios(municipios);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $selectMunicipios.nextElementSibling.innerHTML = `Error: ${error.message}`;
        });
}

function mostrarMunicipios(municipios) {
    municipios.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
    let $options = `<option value="Elige un municipio">Elige un municipio</option>`;
    municipios.forEach(municipio => {
        $options += `<option value="${municipio.id}">${municipio.nombre}</option>`;
    });
    $selectMunicipios.innerHTML = $options;
}

// Llamada inicial
function municipio(provincia) {
    obtenerMunicipios(provincia);
}

$selectProvincias.addEventListener("change", e => {
    municipio(e.target.value);
    console.log(e.target.value)
})

document.addEventListener("DOMContentLoaded", function() {
    const $selectProvincias = document.getElementById("selectProvincias");
    const $selectMunicipios = document.getElementById("selectMunicipios");
    const $selectLocalidades = document.getElementById("selectLocalidades");
    const $municipiosSection = document.getElementById("municipiosSection");
    const $localidadesSection = document.getElementById("localidadesSection");
    const $buttonSection = document.getElementById("buttonSection");
    const $confirmButton = document.getElementById("confirmButton");

    // Evento al seleccionar una provincia
    $selectProvincias.addEventListener("change", function() {
        const provinciaId = this.value;
        if (provinciaId) {
            $municipiosSection.style.display = "block";
            $localidadesSection.style.display = "none";
            $buttonSection.style.display = "none";
        } else {
            $municipiosSection.style.display = "none";
            $localidadesSection.style.display = "none";
            $buttonSection.style.display = "none";
        }
    });

    // Evento al seleccionar un municipio
    $selectMunicipios.addEventListener("change", function() {
        const municipioId = this.value;
        if (municipioId) {
            $localidadesSection.style.display = "block";
            $buttonSection.style.display = "none";
        } else {
            $localidadesSection.style.display = "none";
            $buttonSection.style.display = "none";
        }
    });

    // Evento al seleccionar una localidad
    $selectLocalidades.addEventListener("change", function() {
        const localidadId = this.value;
        if (localidadId) {
            $buttonSection.style.display = "block";
        } else {
            $buttonSection.style.display = "none";
        }
    });
});