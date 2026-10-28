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
            throw new Error("Failed to load products");
         }

         return res.json();

      })

      .then((data) => {

         arr.push(data);

         showProducts(data);

      })

      .catch((error) => {

         console.error(error);

         document.getElementById("all-products").innerHTML = `
            <h3 class="text-danger text-center">
               Failed to load products.
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


   // Check whether products is an array

   if (!Array.isArray(products)) {

      console.error(
         "showProducts() expected an array:",
         products
      );

      return;

   }


   // Display total products

   setInnerText(
      "total_products",
      products.length
   );


   // Clear old products

   document.getElementById(
      "all-products"
   ).innerHTML = "";


   // Show first 10 products

   const allProducts =
      products.slice(0, 10);


   // Loop through products

   for (const product of allProducts) {


      // ==================================
      // IMPORTANT ERROR FIX
      // ==================================

      // WRONG:
      // const image = product.images;

      // CORRECT:
      const image = product.image;


      // Create div

      const div =
         document.createElement("div");


      div.classList.add("product");


      // Product HTML

      div.innerHTML = `

         <div class="single-product">

            <div>

               <img
                  class="product-image"
                  src="${image}"
                  alt="${product.title}"
               >

            </div>


            <h3>
               ${product.title}
            </h3>


            <p>
               Category: ${product.category}
            </p>


            <h2>
               Price: $ ${product.price}
            </h2>


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


      // Add product to page

      document
         .getElementById("all-products")
         .appendChild(div);

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


   // Increase count

   count = count + 1;


   // ==================================
   // IMPORTANT ERROR FIX
   // ==================================

   // WRONG:
   // updatePrice("price", value);

   // CORRECT:
   updatePrice("price", price);


   // Update tax and delivery

   updateTaxAndCharge();


   // Update total

   updateTotal();


   // Update product count

   document.getElementById(
      "total-Products"
   ).innerText = count;

};


// ==========================================
// Show product details
// ==========================================

const showProductDetails = (product_id) => {


   console.log(product_id);


   // Find product from our local JSON

   const product =
      arr[0].find(
         (product) =>
            product.id === product_id
      );


   if (product) {

      showProductDetailsInModal(product);

   }

};


// ==========================================
// Show product details in modal
// ==========================================

const showProductDetailsInModal =
   (product_details) => {


      console.log(product_details);


      // Product title

      setInnerText(
         "exampleModalLabel",
         product_details.title
      );


      // ==================================
      // IMPORTANT ERROR FIX
      // ==================================

      // WRONG:
      // setInnerText("product_id", product_details.id);

      // CORRECT:
      // HTML has id="productId"

      setInnerText(
         "productId",
         product_details.id
      );


      // Description

      setInnerText(
         "modal_body",
         product_details.description
      );


      // Rating

      setInnerText(
         "rating",
         product_details.rating.rate
      );

   };


// ==========================================
// Get input value
// ==========================================

const getInputValue = (id) => {


   const element =
      document.getElementById(id).innerText;


   // ==================================
   // IMPORTANT ERROR FIX
   // ==================================
   // parseInt() removes decimal values.
   //
   // Example:
   // 109.95 -> 109
   //
   // We need parseFloat().
   
   const converted =
      parseFloat(element);


   return converted;

};


// ==========================================
// Main price update function
// ==========================================

const updatePrice = (id, value) => {


   const convertedOldPrice =
      getInputValue(id);


   const convertPrice =
      parseFloat(value);


   const total =
      convertedOldPrice + convertPrice;


   document.getElementById(id).innerText =
      total.toFixed(2);

};


// ==========================================
// Set innerText function
// ==========================================

const setInnerText = (id, value) => {


   // IMPORTANT:
   //
   // Your old version:
   //
   // Math.round(value)
   //
   // This is a problem for text such as:
   //
   // "Fjallraven Backpack"
   //
   // Math.round("Fjallraven Backpack")
   // becomes NaN.
   //
   // So just use innerText.

   document.getElementById(id).innerText =
      value;

};


// ==========================================
// Update delivery charge and tax
// ==========================================

const updateTaxAndCharge = () => {


   const priceConverted =
      getInputValue("price");


   // Default values

   let deliveryCharge = 20;

   let totalTax = 0;


   // More than 200

   if (priceConverted > 200) {

      deliveryCharge = 30;

      totalTax =
         priceConverted * 0.2;

   }


   // More than 400

   if (priceConverted > 400) {

      deliveryCharge = 50;

      totalTax =
         priceConverted * 0.3;

   }


   // More than 500

   if (priceConverted > 500) {

      deliveryCharge = 60;

      totalTax =
         priceConverted * 0.4;

   }


   // Update delivery

   setInnerText(
      "delivery-charge",
      deliveryCharge
   );


   // Update tax

   setInnerText(
      "total-tax",
      totalTax.toFixed(2)
   );

};


// ==========================================
// Grand Total
// ==========================================

const updateTotal = () => {


   const grandTotal =

      getInputValue("price")

      +

      getInputValue("delivery-charge")

      +

      getInputValue("total-tax");


   document.getElementById(
      "total"
   ).innerText = grandTotal.toFixed(2);

};


// ==========================================
// Search by category
// ==========================================

document
   .getElementById("search-btn")
   .addEventListener(
      "click",
      function () {


         // Get input

         const inputField =
            document
               .getElementById("input-value")
               .value
               .trim()
               .toLowerCase();


         // If search box is empty

         if (inputField === "") {

            showProducts(arr[0]);

            return;

         }


         // ==================================
         // IMPORTANT ERROR FIX
         // ==================================

         // WRONG:
         //
         // const searchedProduct = arr[0].find(...)
         //
         // find() returns ONE product.
         //
         // showProducts() needs an ARRAY.
         //
         // Therefore use filter().

         const searchedProducts =
            arr[0].filter(
               (p) =>
                  p.category
                     .toLowerCase()
                     .includes(inputField)
            );


         // Display results

         showProducts(
            searchedProducts
         );

      }
   );


// ==========================================
// Search when pressing Enter
// ==========================================

document
   .getElementById("input-value")
   .addEventListener(
      "keypress",
      function (event) {

         if (event.key === "Enter") {

            document
               .getElementById("search-btn")
               .click();

         }

      }
   );