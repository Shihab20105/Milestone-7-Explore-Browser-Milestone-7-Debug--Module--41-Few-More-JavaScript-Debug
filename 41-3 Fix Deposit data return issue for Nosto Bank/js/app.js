// ==========================================
// Array
// ==========================================

const arr = [];


// ==========================================
// Load Products
// ==========================================

const loadProducts = (url) => {
   fetch(url)
      .then((res) => {
         if (!res.ok) {
            throw new Error("Failed to load products. Check the JSON file path and run this project with Live Server.");
         }
         return res.json();
      })
      .then((data) => {
         if (!Array.isArray(data)) {
            throw new Error("The product JSON must contain an array.");
         }

         arr[0] = data;
         showProducts(data);
      })
      .catch((error) => {
         console.error(error);
         document.getElementById("all-products").innerHTML = `
            <h3 class="text-danger text-center">
               Failed to load products. Please open this project with VS Code Live Server and check ranga-api.json.
            </h3>
         `;
      });
};


// ==========================================
// Load products from YOUR JSON file
// ==========================================

loadProducts("./ranga-api.json");


// ==========================================
// Show all products in UI
// ==========================================

const showProducts = (products) => {
   if (!Array.isArray(products)) {
      console.error("showProducts() expected an array:", products);
      return;
   }

   setInnerText("total_products", products.length);
   document.getElementById("all-products").innerHTML = "";

   // Show first 10 products
   const allProducts = products.slice(0, 10);

   for (const product of allProducts) {
      // The JSON property is "image", singular.
      const image = product.image;

      const div = document.createElement("div");
      div.classList.add("product");

      div.innerHTML = `
         <div class="single-product">
            <div>
               <img
                  class="product-image"
                  src="${image || ""}"
                  alt="${product.title}"
                  loading="lazy"
                  onerror="this.style.display='none'; console.error('Could not load product image:', this.src);"
               >
            </div>

            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <h2>Price: $ ${Number(product.price).toFixed(2)}</h2>

            <button
               onclick="showProductDetails(${product.id})"
               data-bs-toggle="modal"
               data-bs-target="#exampleModal"
               class="btn btn-outline-secondary mb-2 rounded-1 mt-1"
            >
               Details
            </button>

            <button
               onclick="addToCart(${product.id}, ${product.price})"
               class="buy-now btn btn-success border-0 w-100 rounded-0 bg-main py-2"
            >
               Add to cart
            </button>
         </div>
      `;

      document.getElementById("all-products").appendChild(div);
   }
};


// ==========================================
// Cart count
// ==========================================

let count = 0;


// ==========================================
// Add to cart
// ==========================================

const addToCart = (id, price) => {
   count = count + 1;
   updatePrice("price", price);
   updateTaxAndCharge();
   updateTotal();
   document.getElementById("total-Products").innerText = count;
};


// ==========================================
// Show product details
// ==========================================

const showProductDetails = (product_id) => {
   if (!arr[0]) return;

   const product = arr[0].find((product) => product.id === product_id);

   if (product) {
      showProductDetailsInModal(product);
   }
};


// ==========================================
// Show product details in modal
// ==========================================

const showProductDetailsInModal = (product_details) => {
   setInnerText("exampleModalLabel", product_details.title);
   setInnerText("productId", product_details.id);
   setInnerText("modal_body", product_details.description);
   setInnerText(
      "rating",
      product_details.rating && product_details.rating.rate != null
         ? product_details.rating.rate
         : "N/A"
   );
};


// ==========================================
// Get input value
// ==========================================

const getInputValue = (id) => {
   const element = document.getElementById(id).innerText;
   const converted = parseFloat(element);
   return Number.isFinite(converted) ? converted : 0;
};


// ==========================================
// Main price update function
// ==========================================

const updatePrice = (id, value) => {
   const convertedOldPrice = getInputValue(id);
   const convertPrice = parseFloat(value);
   const total = convertedOldPrice + (Number.isFinite(convertPrice) ? convertPrice : 0);
   document.getElementById(id).innerText = total.toFixed(2);
};


// ==========================================
// Set innerText function
// ==========================================

const setInnerText = (id, value) => {
   document.getElementById(id).innerText = value;
};


// ==========================================
// Update delivery charge and tax
// ==========================================

const updateTaxAndCharge = () => {
   const priceConverted = getInputValue("price");

   let deliveryCharge = 20;
   let totalTax = 0;

   if (priceConverted > 200) {
      deliveryCharge = 30;
      totalTax = priceConverted * 0.2;
   }

   if (priceConverted > 400) {
      deliveryCharge = 50;
      totalTax = priceConverted * 0.3;
   }

   if (priceConverted > 500) {
      deliveryCharge = 60;
      totalTax = priceConverted * 0.4;
   }

   setInnerText("delivery-charge", deliveryCharge);
   setInnerText("total-tax", totalTax.toFixed(2));
};


// ==========================================
// Grand Total
// ==========================================

const updateTotal = () => {
   const grandTotal =
      getInputValue("price") +
      getInputValue("delivery-charge") +
      getInputValue("total-tax");

   document.getElementById("total").innerText = grandTotal.toFixed(2);
};


// ==========================================
// Search by category
// ==========================================

document.getElementById("search-btn").addEventListener("click", function () {
   if (!arr[0]) return;

   const inputField = document
      .getElementById("input-value")
      .value
      .trim()
      .toLowerCase();

   if (inputField === "") {
      showProducts(arr[0]);
      return;
   }

   const searchedProducts = arr[0].filter((p) =>
      String(p.category || "").toLowerCase().includes(inputField)
   );

   showProducts(searchedProducts);
});


// ==========================================
// Search when pressing Enter
// ==========================================

document.getElementById("input-value").addEventListener("keydown", function (event) {
   if (event.key === "Enter") {
      document.getElementById("search-btn").click();
   }
});
