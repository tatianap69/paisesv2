// @author Angiee Tatiana

// elementos del DOM
const banderas = document.getElementById("banderas");
const inputFormulario = document.getElementById("buscarPais");
const selectRegion = document.getElementById("filtrarRegion");
const btnDark = document.querySelector(".btn-dark-mode");

// página de detalles
const query = new URLSearchParams(window.location.search);
const params = query.get("name");

// cargar datos
document.addEventListener("DOMContentLoaded", () => {
  if (params) {
    cargarDetallePais();
  } else {
    cargarDatos();
  }
});

// buscar país por nombre
if (inputFormulario) {
  inputFormulario.addEventListener("input", () => {
    const searchTerm = inputFormulario.value.toLowerCase();
    const region = selectRegion.value;
    cargarDatos(searchTerm, region);
  });
}

// filtrar por región
if (selectRegion) {
  selectRegion.addEventListener("change", () => {
    const searchTerm = inputFormulario.value.toLowerCase();
    const region = selectRegion.value;
    cargarDatos(searchTerm, region);
  });
}

// función para cargar todos los países
const cargarDatos = async (searchTerm = "", region = "") => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    let data = await res.json();

    // filtrar por término de búsqueda
    if (searchTerm) {
      data = data.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchTerm) ||
          (country.translations.spa &&
            country.translations.spa.common.toLowerCase().includes(searchTerm))
      );
    }

    // filtrar por región
    if (region) {
      data = data.filter((country) => country.region === region);
    }

    // ordenar países alfabéticamente
    data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common, "es", { sensitivity: "base" })
    );

    // cargar las banderas
    cargarBanderas(data);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

// función para cargar las banderas
const cargarBanderas = (data) => {
  const elementos = data
    .map(
      (item) => `
        <article class="card">
            <img src="${item.flags.png}" alt="${
        item.name.common
      }" class="img-fluid">
            <div class="card-content">
                <h3>${item.name.common}</h3>
                <p><b>Población:</b> ${item.population.toLocaleString()}</p>
                <p><b>Capital:</b> ${item.capital ? item.capital[0] : "N/A"}</p>
                <p><b>Región:</b> ${item.region}</p>
                <p><a href="pais.html?name=${item.name.common}">Más info</a></p>
            </div>
        </article>
    `
    )
    .join("");

  banderas.innerHTML = elementos;
};

// función para cargar los detalles de un país
const cargarDetallePais = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();

    // filtrar el país por el parámetro en la URL
    const filtroData = data.filter(
      (item) => item.name.common.toLowerCase() === params.toLowerCase()
    );

    renderDetalle(filtroData);
  } catch (error) {
    console.error("Error al cargar detalles del país:", error);
  }
};

// función para renderizar los detalles de un país
const renderDetalle = (data) => {
  const elementos = data
    .map(
      (item) => `
          <article class="card">
              <img src="${item.flags.png}" alt="${
        item.name.common
      }" class="img-fluid">
              <div class="card-content">
                  <h3>${item.name.common}</h3>
                  <p><b>Región:</b> ${item.region}</p>
                  <p><b>Subregión:</b> ${item.subregion || "N/A"}</p>
                  <p><b>Capital:</b> ${
                    item.capital ? item.capital[0] : "N/A"
                  }</p>
                  <p><b>Población:</b> ${item.population.toLocaleString()}</p>
                  <p><b>Idiomas:</b> ${
                    item.languages
                      ? Object.values(item.languages).join(", ")
                      : "N/A"
                  }</p>
                  <p><b>Moneda:</b> ${
                    item.currencies
                      ? Object.values(item.currencies)
                          .map(
                            (currency) =>
                              `${currency.name} (${currency.symbol})`
                          )
                          .join(", ")
                      : "N/A"
                  }</p>
                  <p><b>Gentilicio:</b> ${
                    item.demonyms ? item.demonyms.eng.m : "N/A"
                  }</p>
                  <p><b>Zonas Horarias:</b> ${item.timezones.join(", ")}</p>
                  <p><b>Continente:</b> ${item.continents.join(", ")}</p>
                  <p><a href="${
                    item.maps.googleMaps
                  }" target="_blank">Ver en Google Maps</a></p>
              </div>
          </article>
      `
    )
    .join("");

  banderas.innerHTML = elementos;
};

// modo oscuro
if (btnDark) {
  btnDark.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      btnDark.innerHTML = `<i class="far fa-sun"></i> Modo claro`;
    } else {
      btnDark.innerHTML = `<i class="far fa-moon"></i> Modo oscuro`;
    }
  });
}
