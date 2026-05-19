```javascript id="ph7m8z"
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

      // IMPORTANTE PARA CSV DE EXCEL EN ESPAÑOL
      delimiter: ";",

      complete: function(results) {

        console.log("CSV cargado:", url);
        console.log(results.data);

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
// INICIAR
// ===============================

async function iniciar() {

  enfermedades = await cargarCSV('data/enfermedades.csv');

  localizaciones = await cargarCSV('data/localizaciones.csv');

  sintomas = await cargarCSV('data/sintomas.csv');

  condiciones = await cargarCSV('data/condiciones.csv');


  console.log("ENFERMEDADES");
  console.log(enfermedades);

  console.log("LOCALIZACIONES");
  console.log(localizaciones);

  console.log("SINTOMAS");
  console.log(sintomas);

  console.log("CONDICIONES");
  console.log(condiciones);


  cargarFiltros();

}


// ===============================
// CARGAR FILTROS
// ===============================

function cargarFiltros() {

  const organoSelect = document.getElementById('organoSelect');

  const categoriaSelect = document.getElementById('categoriaSelect');

  const condicionSelect = document.getElementById('condicionSelect');


  // LIMPIAR

  organoSelect.innerHTML =
    '<option value=\"\">Seleccione</option>';

  categoriaSelect.innerHTML =
    '<option value=\"\">Seleccione</option>';

  condicionSelect.innerHTML =
    '<option value=\"\">Seleccione</option>';


  // OBTENER ÚNICOS

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


  console.log("ORGANOS", organos);
  console.log("CATEGORIAS", categorias);
  console.log("CONDICIONES", conds);


  // CARGAR ÓRGANOS

  organos.forEach(o => {

    if (o && o.trim() !== '') {

      organoSelect.innerHTML += `
        <option value="${o}">
          ${o}
        </option>
      `;

    }

  });


  // CARGAR CATEGORÍAS

  categorias.forEach(c => {

    if (c && c.trim() !== '') {

      categoriaSelect.innerHTML += `
        <option value="${c}">
          ${c}
        </option>
      `;

    }

  });


  // CARGAR CONDICIONES

  conds.forEach(c => {

    if (c && c.trim() !== '') {

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
    // LOCALIZACIONES
    // ===============================

    const locs = localizaciones.filter(l =>

      String(l.id_enfermedad) ===
      String(enf.id_enfermedad)

      &&

      l.localizacion === organo

    );


    // ===============================
    // SÍNTOMAS
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
    // CONDICIONES
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
    // RESULTADOS
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
  // ORDENAR
  // ===============================

  resultados.sort(
    (a,b) => b.puntaje - a.puntaje
  );


  // ===============================
  // MOSTRAR
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
// INICIAR SISTEMA
// ===============================

iniciar();
```
