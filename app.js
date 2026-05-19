let enfermedades = [];

  const organo = document.getElementById('organoSelect').value;
  const categoria = document.getElementById('categoriaSelect').value;
  const condicion = document.getElementById('condicionSelect').value;

  let resultados = [];

  enfermedades.forEach(enf => {

    let puntaje = 0;

    const locs = localizaciones.filter(l =>
      l.id_enfermedad === enf.id_enfermedad &&
      l.localizacion === organo
    );

    locs.forEach(loc => {

      const sint = sintomas.filter(s =>
        s.id_localizacion === loc.id_localizacion &&
        s.categoria_sintoma === categoria
      );

      sint.forEach(s => {
        puntaje += Number(s.peso_diagnostico || 0);
      });
    });

    const cond = condiciones.filter(c =>
      c.id_enfermedad === enf.id_enfermedad &&
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
    div.innerHTML = '<div class="card">No se encontraron coincidencias.</div>';
    return;
  }

  resultados.forEach(r => {

    div.innerHTML += `
      <div class="card">
        <h2>${r.enfermedad}</h2>
        <p><strong>Agente causal:</strong> ${r.agente}</p>
        <p class="puntaje">Puntaje: ${r.puntaje}</p>
      </div>
    `;
  });
}



document.getElementById('buscarBtn').addEventListener('click', diagnosticar);

iniciar();