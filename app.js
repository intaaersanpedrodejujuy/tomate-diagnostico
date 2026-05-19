```javascript
// ===============================
// VARIABLES GLOBALES
// ===============================

let enfermedades = [];
let localizaciones = [];
let sintomas = [];
let condiciones = [];


// ===============================
// CARGAR CSV
// ===============================

async function cargarCSV(url) {

  return new Promise((resolve, reject) => {

    Papa.parse(url, {

      download: true,
      header: true,
      skipEmptyLines: true,

      complete: function(results) {

        console.log("CSV cargado:", url);

        resolve(results.data);

      },

      error: function(err) {

        console.error("Error CSV:", err);

        reject(err);

      }

    });

  });

}


// ===============================
// INICIAR SISTEMA
// ===============================

async function iniciar() {

  enfermedades =
    await cargarCSV('data/enfermedades.csv');

  localizaciones =
    await cargarCSV('data/localizaciones.csv');

  sintomas =
    await cargarCSV('data/sintomas.csv');

  condiciones =
    await cargarCSV('data/condiciones.csv');


  console.log(enfermedades);
  console.log(localizaciones);
  console.log(sintomas);
  console.log(condiciones);


  cargarFiltros();

}


// ===============================
// CARGAR FILTROS
// ===============================

function cargarFiltros() {

  const organoSelect =
    document.getElementById('organoSelect');

  const categoriaSelect =
    document.getElementById('categoriaSelect');

  const condicionSelect =
    document.getElementById('condicionSelect');


  // LIMPIAR

  organoSelect.innerHTML =
    '<option value="">Seleccione</option>';

  categoriaSelect.innerHTML =
    '<option value="">Seleccione</option>';

  condicionSelect.innerHTML =
    '<option value="">Seleccione</option>';


  // OBTENER VALORES ÚNICOS

  const organos = [
    ...new Set(
      localizaciones.map(l => l.localizacion)
    )
  ];

  const categorias = [
    ...new Set(
      sintomas.map(s => s.categoria_sintoma)
    )
  ];

  const conds = [
    ...new Set(
      condiciones.map(c => c.categoria_condicion)
    )
  ];


  // CARGAR ÓRGANOS

  organos.forEach(o => {

    if (o) {

      organoSelect.innerHTML += `
        <option value="${o}">
          ${o}
        </option>
      `;

    }

  });


  // CARGAR CATEGORÍAS

  categorias.forEach(c => {

    if (c) {

      categoriaSelect.innerHTML += `
        <option value="${c}">
          ${c}
        </option>
      `;

    }

  });


  // CARGAR CONDICIONES

  conds.forEach(c => {

    if (c) {

      condicionSelect.innerHTML += `
        <option value="${c}">
          ${c}
        </option>
      `;

    }

  });

}


// ===============================
// DIAGNOSTICAR
// ===============================

function diagnosticar() {

  const organo =
    document.getElementById('organoSelect').value;

  const categoria =
    document.getElementById('categoriaSelect').value;

  const condicion =
    document.getElementById('condicionSelect').value;


  let resultados = [];


  enfermedades.forEach(enf => {

    let puntaje = 0;


    // ===============================
    // FILTRAR LOCALIZACIONES
    // ===============================

    const locs = localizaciones.filter(l =>

      String(l.id_enfermedad) ===
      String(enf.id_enfermedad)

      &&

      l.localizacion === organo

    );


    // ===============================
    // FILTRAR SÍNTOMAS
    // ===============================

    locs.forEach(loc => {

      const sint = sintomas.filter(s =>

        String(s.id_localizacion) ===
        String(loc.id_localizacion)

        &&

        s.categoria_sintoma === categoria

      );

      sint.forEach(s => {

        puntaje += Number(
          s.peso_diagnostico || 0
        );

      });

    });


    // ===============================
    // FILTRAR CONDICIONES
    // ===============================

    const cond = condiciones.filter(c =>

      String(c.id_enfermedad) ===
      String(enf.id_enfermedad)

      &&

      c.categoria_condicion === condicion

    );

    cond.forEach(c => {

      puntaje += Number(
        c.peso_condicion || 0
      );

    });


    // ===============================
    // AGREGAR RESULTADO
    // ===============================

    if (puntaje > 0) {

      resultados.push({

        enfermedad: enf.enfermedad,

        agente: enf.agente_causal,

        puntaje

      });

    }

  });


  // ===============================
  // ORDENAR RESULTADOS
  // ===============================

  resultados.sort(
    (a,b) => b.puntaje - a.puntaje
  );


  // ===============================
  // MOSTRAR RESULTADOS
  // ===============================

  mostrarResultados(resultados);

}


// ===============================
// MOSTRAR RESULTADOS
// ===============================

function mostrarResultados(resultados) {

  const div =
    document.getElementById('resultados');

  div.innerHTML = '';


  if (resultados.length === 0) {

    div.innerHTML = `
      <div class="card">
        No se encontraron coincidencias.
      </div>
    `;

    return;

  }


  resultados.forEach(r => {

    div.innerHTML += `

      <div class="card">

        <h2>
          ${r.enfermedad}
        </h2>

        <p>
          <strong>Agente causal:</strong>
          ${r.agente}
        </p>

        <p class="puntaje">
          Puntaje: ${r.puntaje}
        </p>

      </div>

    `;

  });

}


// ===============================
// EVENTO BOTÓN
// ===============================

document
  .getElementById('buscarBtn')
  .addEventListener(
    'click',
    diagnosticar
  );


// ===============================
// INICIAR
// ===============================

iniciar();
```
