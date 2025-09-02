const form = document.getElementById("filterForm");
const container = document.getElementById("products");
const paginationInfo = document.getElementById("paginationInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const limitEl = document.getElementById("limit");

let currentPage = 1;

function buildParams(page = 1) {
  const name = document.getElementById("name").value.trim();
  const company = document.getElementById("company").value;
  const featured = document.getElementById("featured").value;
  const sort = document.getElementById("sort").value.trim();
  const priceMin = document.getElementById("priceMin").value.trim();
  const priceMax = document.getElementById("priceMax").value.trim();
  const limit = limitEl.value;

  const params = new URLSearchParams();

  if (name) params.append("name", name);
  if (company) params.append("company", company);
  if (featured) params.append("featured", featured);
  if (sort) params.append("sort", sort);

  let numericFilters = [];
  if (priceMin) numericFilters.push(`price>=${priceMin}`);
  if (priceMax) numericFilters.push(`price<=${priceMax}`);
  if (numericFilters.length > 0) {
    params.append("numericFilters", numericFilters.join(","));
  }

  params.append("page", page);
  params.append("limit", limit);

  return params;
}

async function fetchJSON(params) {
  const res = await fetch(`/api/v1/products?${params.toString()}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

async function loadPage() {
  try {
    const params = buildParams(currentPage);
    const data = await fetchJSON(params);
    renderProducts(data.products || []);
    await updatePaginationInfo(data);
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p style='color:red'>Error loading products</p>";
    paginationInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }
}

function renderProducts(list) {
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<p>No products found...</p>";
    return;
  }
  list.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>💰 $${p.price}</p>
      <p>🏭 ${p.company}</p>
      <p>⭐ ${p.rating}</p>
      <p>🌟 Featured: ${p.featured ? "Show" : "Hide"}</p>
    `;
    container.appendChild(div);
  });
}

async function updatePaginationInfo(dataNow) {
  const limit = Number(limitEl.value);
  const itemsThisPage = (dataNow.products || []).length;

  const totalFromApi =
    dataNow.total ??
    dataNow.totalDocs ??
    dataNow.count ??
    dataNow.nbTotal ??
    null;

  const start = itemsThisPage > 0 ? (currentPage - 1) * limit + 1 : 0;
  const end = itemsThisPage > 0 ? start + itemsThisPage - 1 : 0;
  const hasPrev = currentPage > 1;

  let hasNext;
  if (totalFromApi != null) {
    const totalPages = Math.ceil(totalFromApi / limit) || 1;
    hasNext = currentPage < totalPages;
  } else {
    if (itemsThisPage < limit) {
      hasNext = false;
    } else {
      const probeParams = buildParams(currentPage + 1);
      try {
        const probe = await fetchJSON(probeParams);
        hasNext = Array.isArray(probe.products) && probe.products.length > 0;
      } catch {
        hasNext = false;
      }
    }
  }

  paginationInfo.textContent =
    totalFromApi != null
      ? `Showing ${start}–${end} of ${totalFromApi}`
      : itemsThisPage > 0
      ? `Showing ${start}–${end}`
      : "";

  prevBtn.disabled = !hasPrev;
  nextBtn.disabled = !hasNext;
}

// events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  loadPage();
});

limitEl.addEventListener("change", () => {
  currentPage = 1;
  loadPage();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  loadPage();
});

// initial load
loadPage();
