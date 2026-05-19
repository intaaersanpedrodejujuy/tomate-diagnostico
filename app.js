```javascript id="u0rj4c"
async function probarCSV() {

  const response = await fetch('data/enfermedades.csv');

  const texto = await response.text();

  document.body.innerHTML = `

    <h1>PRUEBA CSV</h1>

    <pre style="
      white-space: pre-wrap;
      font-size: 18px;
      padding: 20px;
    ">

${texto}

    </pre>

  `;

}

probarCSV();
```
