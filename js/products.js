// Product rendering and filtering module
// Loads data from /data/products.json and renders product cards dynamically

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);
    const data = await response.json();
    return data.collections;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Get products for a specific collection by ID
function getCollectionProducts(collectionId, collections) {
  const collection = collections.find(c => c.id === collectionId);
  return collection ? collection.products : [];
}

// Format price from cents to AUD display string
function formatPrice(priceInCents) {
  return `$${(priceInCents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Extract height value from dimensions string (format: "110x72cm, 82x57cm...")
function extractHeightMm(dimensionsStr) {
  if (!dimensionsStr) return 0;
  const firstDim = dimensionsStr.split(',')[0].trim();
  const parts = firstDim.split('x');
  if (parts.length >= 2) {
    const height = parseInt(parts[1]);
    return isNaN(height) ? 0 : height * 10; // Convert from cm to mm (rough estimate)
  }
  return 0;
}

// Categorize products by height range
function getHeightRange(heightMm) {
  if (heightMm >= 600) return '600-plus';
  if (heightMm >= 500) return '500-600';
  if (heightMm >= 400) return '400-500';
  if (heightMm >= 300) return '300-400';
  return 'under-300';
}

// Apply filters to products
function filterProducts(products, filterState) {
  return products.filter(product => {
    // Material filter
    if (filterState.materials.length > 0) {
      const productMaterial = product.material.toLowerCase();
      const materialMatch = filterState.materials.some(m => {
        if (m === 'fibreglass') return productMaterial.includes('fibreglass');
        if (m === 'fibre-cement') return productMaterial.includes('cement') || productMaterial.includes('grc') || productMaterial.includes('terrazzo');
        return false;
      });
      if (!materialMatch) return false;
    }

    // Size (height) filter
    if (filterState.sizes.length > 0) {
      const heightMm = extractHeightMm(product.dimensions);
      const heightRange = getHeightRange(heightMm);
      if (!filterState.sizes.includes(heightRange)) return false;
    }

    // Colour filter
    if (filterState.colours.length > 0) {
      const productColours = (product.colours || []).map(c => c.toLowerCase());
      const colourMatch = filterState.colours.some(c =>
        productColours.some(pc => pc.includes(c.toLowerCase()))
      );
      if (!colourMatch) return false;
    }

    // Price filter
    if (filterState.prices.length > 0) {
      const priceAUD = product.price / 100;
      const priceMatch = filterState.prices.some(range => {
        if (range === '0-100') return priceAUD <= 100;
        if (range === '100-250') return priceAUD > 100 && priceAUD <= 250;
        if (range === '250-500') return priceAUD > 250 && priceAUD <= 500;
        if (range === '500-plus') return priceAUD > 500;
        return false;
      });
      if (!priceMatch) return false;
    }

    return true;
  });
}

// Create a product card HTML element
function createProductCard(product, index = 0) {
  const firstImage = product.images?.[0] || product.image || '';
  const delayClass = index % 4 === 0 ? '' : `delay-${index % 4}`;

  const card = document.createElement('div');
  card.className = `product-card fadein ${delayClass}`.trim();
  card.innerHTML = `
    <div class="product-card__image">
      <img
        src="${firstImage}"
        alt="${product.title}"
        loading="lazy"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </div>
    <div class="product-card__content">
      <h3 class="product-card__name">${product.title}</h3>
      <div class="product-card__specs">
        <strong>Dimensions:</strong> ${product.dimensions}<br>
        <strong>Material:</strong> ${product.material}<br>
        <strong>Colours:</strong> ${(product.colours || []).join(', ') || 'Various'}
      </div>
      <div class="product-card__price">${formatPrice(product.price)}</div>
      <a href="/products/product-detail.html?handle=${product.handle}" class="btn btn--sage">View Details</a>
    </div>
  `;
  return card;
}

// Render products to a container
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--c-brown); padding: 3rem 0;">No products found matching your filters.</p>';
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Render product cards
  paginatedProducts.forEach((product, index) => {
    container.appendChild(createProductCard(product, index));
  });

  // Render pagination
  renderPagination(totalPages, containerId);
}

// Render pagination controls
function renderPagination(totalPages, containerId) {
  const paginationContainer = document.getElementById('pagination-controls');
  if (!paginationContainer) return;

  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';

  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement('a');
    prevBtn.href = '#';
    prevBtn.textContent = '← Previous';
    prevBtn.onclick = (e) => {
      e.preventDefault();
      goToPage(currentPage - 1, containerId);
    };
    paginationContainer.appendChild(prevBtn);
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      const current = document.createElement('span');
      current.className = 'pagination__current';
      current.textContent = i;
      paginationContainer.appendChild(current);
    } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      const pageBtn = document.createElement('a');
      pageBtn.href = '#';
      pageBtn.textContent = i;
      pageBtn.onclick = (e) => {
        e.preventDefault();
        goToPage(i, containerId);
      };
      paginationContainer.appendChild(pageBtn);
    }
  }

  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('a');
    nextBtn.href = '#';
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = (e) => {
      e.preventDefault();
      goToPage(currentPage + 1, containerId);
    };
    paginationContainer.appendChild(nextBtn);
  }
}

// Navigate to a specific page
function goToPage(pageNum, containerId) {
  currentPage = pageNum;
  renderProducts(filteredProducts, containerId);

  // Scroll to products grid
  const grid = document.querySelector('.products-grid');
  if (grid) {
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Initialize filtering for a collection
function initializeFilters(collectionId, products, containerId) {
  allProducts = products;
  filteredProducts = [...products];
  currentPage = 1;

  const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      currentPage = 1; // Reset to page 1 when filters change

      const filterState = {
        materials: Array.from(document.querySelectorAll('input[name="material"]:checked')).map(el => el.value),
        sizes: Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value),
        colours: Array.from(document.querySelectorAll('input[name="colour"]:checked')).map(el => el.value),
        prices: Array.from(document.querySelectorAll('input[name="price"]:checked')).map(el => el.value),
      };

      filteredProducts = filterProducts(allProducts, filterState);
      renderProducts(filteredProducts, containerId);
    });
  });

  // Initial render
  renderProducts(filteredProducts, containerId);
}

// Main initialization function - call this from the collection page
export async function renderCollectionProducts(collectionId, containerId = 'productsGrid') {
  const collections = await loadProducts();
  const products = getCollectionProducts(collectionId, collections);

  if (products.length === 0) {
    console.warn(`No products found for collection: ${collectionId}`);
    return;
  }

  initializeFilters(collectionId, products, containerId);
}

// Export for use in other modules
export { formatPrice, createProductCard, filterProducts };
