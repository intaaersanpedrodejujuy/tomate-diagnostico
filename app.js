```javascript
let enfermedades = [];
let localizaciones = [];
let sintomas = [];
let condiciones = [];

async function cargarCSV(url) {

  return new Promise((resolve) => {

    Papa.parse(url, {

      download: true,
      header: true,

      complete: function(results) {

        const limpio = results.data.filter(r =>
          Object.values(r).some(v => v !== "")
        );

        resolve(limpio);
      }

    });

  });

}

async function iniciar() {

```javascript id="f4z13r"
enfermedades = await cargarCSV('data/enfermedades.csv');
localizaciones = await cargarCSV('data/localizaciones.csv');
sintomas = await cargarCSV('data/sintomas.csv');
condiciones = await cargarCSV('data/condiciones.csv');
```

```javascript id="9c1dys"
console.log(enfermedades.length);
console.log(localizaciones.length);
console.log(sintomas.length);
console.log(condiciones.length);
```


  cargarFiltros();
}

function cargarFiltros() {

  const organoSelect = document.getElementById('organoSelect');
  const categoriaSelect = document.getElementById('categoriaSelect');
  const condicionSelect = document.getElementById('condicionSelect');

  const organos = [...new Set(localizaciones.map(l => l.localizacion))];
  const categorias = [...new Set(sintomas.map(s => s.categoria_sintoma))];
  const conds = [...new Set(condiciones.map(c => c.categoria_condicion))];

  organos.forEach(o => {

    if(o){

      organoSelect.innerHTML += `
        <option value="${o}">
          ${o}
        </option>
      `;

    }

  });

  categorias.forEach(c => {

    if(c){

      categoriaSelect.innerHTML += `
        <option value="${c}">
          ${c}
        </option>
      `;

    }

  });

  conds.forEach(c => {

    if(c){

      condicionSelect.innerHTML += `
        <option value="${c}">
          ${c}
        </option>
      `;

    }

  });

}

function diagnosticar() {

  const organo = document.getElementById('organoSelect').value;
  const categoria = document.getElementById('categoriaSelect').value;
  const condicion = document.getElementById('condicionSelect').value;

  let resultados = [];

  enfermedades.forEach(enf => {

    let puntaje = 0;

    const locs = localizaciones.filter(l =>

      String(l.id_enfermedad) === String(enf.id_enfermedad)
      &&
      l.localizacion === organo

    );

    locs.forEach(loc => {

      const sint = sintomas.filter(s =>

        String(s.id_localizacion) === String(loc.id_localizacion)
        &&
        s.categoria_sintoma === categoria

      );

      sint.forEach(s => {

        puntaje += Number(s.peso_diagnostico || 0);

      });

    });

    const cond = condiciones.filter(c =>

      String(c.id_enfermedad) === String(enf.id_enfermedad)
      &&
      c.categoria_condicion === condicion

    );

    cond.forEach(c => {

      puntaje += Number(c.peso_condicion || 0);

    });

    if (puntaje > 0) {

      resultados.push({

        enfermedad: enf.enfermedad,
        agente: enf.agente_causal,
        puntaje

      });

    }

  });

  resultados.sort((a,b) => b.puntaje - a.puntaje);

  mostrarResultados(resultados);

}

function mostrarResultados(resultados) {

  const div = document.getElementById('resultados');

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

        <h2>${r.enfermedad}</h2>

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

document
  .getElementById('buscarBtn')
  .addEventListener('click', diagnosticar);

iniciar();
```
