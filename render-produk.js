let allProducts = [];
let displayedCount = 0;
const step = 4;
const produkList = document.getElementById("produk-list");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// Nomor WA Toko
const WA_NUMBER = "6281389709411";

// ---------------- Fetch Data ----------------
fetch("assets/products.json")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    renderProducts();
    generateJSONLD(allProducts);
  })
  .catch(err => console.error("Gagal load JSON:", err));

// ---------------- Render Produk ----------------
function renderProducts(filtered = allProducts) {
  produkList.innerHTML = "";
  displayedCount = 0;
  loadMore(filtered);
}

// ---------------- Load More Function ----------------
// ---------------- Load More Function ----------------
function loadMore(products) {
  const slice = products.slice(displayedCount, displayedCount + step);
  slice.forEach((produk, index) => {
    const card = document.createElement("div");
    card.classList.add("produk-item");
    card.style.animationDelay = `${index * 0.15}s`;

    const waMessage = encodeURIComponent(
      `Halo, saya ingin memesan produk:\n\nID: ${produk.id}\nNama: ${produk.name}\nDeskripsi: ${produk.description || "-"}\nHarga: Rp ${produk.price.toLocaleString("id-ID")}`
    );

    card.innerHTML = `
      <img src="${produk.image}" alt="${produk.name}" loading="lazy">
      <h3>${produk.name}</h3>
      <p class="price">Rp ${produk.price.toLocaleString("id-ID")}</p>
      <div class="produk-actions">
        <button class="btn-detail">Lihat Detail</button>
        <a href="https://wa.me/${WA_NUMBER}?text=${waMessage}" target="_blank" class="btn-pesan">Pesan Sekarang</a>
      </div>
    `;

    // Event Lihat Detail → buka modal
    card.querySelector(".btn-detail").addEventListener("click", () => openModal(produk));

    // Tambahkan produk ke DOM
    produkList.appendChild(card);

    // 🔥 Trigger animasi khusus produk
    setTimeout(() => {
      card.classList.add("show");
    }, 100 * index); // delay biar muncul berurutan
  });

  displayedCount += slice.length;
  loadMoreBtn.style.display = displayedCount >= products.length ? "none" : "block";
}


// ---------------- Event Load More ----------------
loadMoreBtn.addEventListener("click", () => {
  loadMore(allProducts);
});

// ---------------- Filter Kategori ----------------
const tabButtons = document.querySelectorAll(".tab-btn, .sub-btn");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    let filtered;

    if (category === "all" || category === "karangan-all") {
      filtered = allProducts;
    } else if (category === "karangan-bunga") {
      // gabungkan semua produk kategori karangan
      filtered = allProducts.filter(p => p.category.startsWith("karangan-"));
    } else {
      filtered = allProducts.filter(p => p.category === category);
    }

    renderProducts(filtered);
    generateJSONLD(filtered);
  });
});

// ---------------- Filter Harga ----------------
document.getElementById("filterPriceBtn").addEventListener("click", () => {
  const min = parseInt(document.getElementById("minPrice").value) || 0;
  const max = parseInt(document.getElementById("maxPrice").value) || Infinity;

  const filtered = allProducts.filter(p => p.price >= min && p.price <= max);
  renderProducts(filtered);
  generateJSONLD(filtered);
});

// ---------------- JSON-LD Generator ----------------
function generateJSONLD(products) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "itemListElement": products.map((p, i) => ({
      "@type": "Product",
      "position": i + 1,
      "name": p.name,
      "image": p.image,
      "offers": {
        "@type": "Offer",
        "priceCurrency": p.currency || "IDR",
        "price": p.price,
        "availability": "https://schema.org/InStock",
        "url": p.url || ""
      }
    }))
  };

  // hapus schema lama
  const old = document.getElementById("jsonld-products");
  if (old) old.remove();

  // inject schema baru
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "jsonld-products";
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

// ---------------- Modal Detail Produk ----------------
function openModal(product) {
  document.getElementById("modalName").textContent = product.name || "Produk";
  document.getElementById("modalImage").src = product.image || "assets/no-image.jpg";
  document.getElementById("modalPrice").textContent = 
    product.price ? "Rp " + product.price.toLocaleString("id-ID") : "";
  document.getElementById("modalDesc").textContent = 
    product.description || product.desc || "Deskripsi produk belum tersedia.";
  document.getElementById("modalSku").textContent = "Kode Produk: " + (product.id || product.sku || "-");

  // Reset form
  document.getElementById("orderForm").reset();

  const waBtn = document.getElementById("waButton");
  waBtn.onclick = function () {
    const name = document.getElementById("recipientName").value;
    const address = document.getElementById("address").value;
    const delivery = document.getElementById("deliveryDate").value;
    const note = document.getElementById("note").value;
    const extra = document.getElementById("extraNote").value;

    const message = `Halo, saya ingin memesan:

ID Produk: ${product.id || product.sku}
Nama Produk: ${product.name}
Harga: Rp ${product.price?.toLocaleString("id-ID")}

--- Data Pengiriman ---
Nama Penerima: ${name}
Alamat: ${address}
Tanggal/Waktu: ${delivery}
Catatan: ${note}
Catatan Tambahan: ${extra}`;

    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  document.getElementById("overlay").classList.add("active");
  document.getElementById("produkModal").classList.add("active");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("active");
  document.getElementById("produkModal").classList.remove("active");
}

document.getElementById("overlay").addEventListener("click", closeModal);

// ---------------- Produk Populer: showDetail ----------------
function showDetail(id) {
  const produkPopuler = {
    "BMR-001": {
      id: "BMR-001",
      name: "Buket Mawar Elegan",
      price: 350000,
      image: "assets/buket1.jpg",
      description: "Buket mawar merah segar dengan balutan elegan."
    },
    "BLP-002": {
      id: "BLP-002",
      name: "Buket Lily Premium",
      price: 420000,
      image: "assets/buket2.jpg",
      description: "Buket bunga lily putih dengan aksen elegan."
    },
    "PBP-003": {
      id: "PBP-003",
      name: "Papan Bunga Pernikahan",
      price: 950000,
      image: "assets/buket3.jpg",
      description: "Papan bunga elegan khusus pernikahan premium."
    },
    "HBM-004": {
      id: "HBM-004",
      name: "Hand Bouquet Premium Mix",
      price: 550000,
      image: "assets/buket4.jpg",
      description: "Hand bouquet campuran bunga premium dengan balutan mewah."
    }
  };

  const produk = produkPopuler[id];
  if (produk) {
    openModal(produk);
  } else {
    alert("Produk tidak ditemukan!");
  }
}
