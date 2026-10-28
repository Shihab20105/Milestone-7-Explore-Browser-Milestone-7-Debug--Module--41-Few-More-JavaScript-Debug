
const arr = [];

const loadProducts = (url) => {
   fetch(url)
      .then((res) => {
         if (!res.ok) {
            throw new Error('Failed to load products');
         }
         return res.json();
      })
      .then((data) => {
         arr.push(data);
         showProducts(data);
      })
      .catch((error) => {
         console.log(error);
         document.getElementById('all-products').innerHTML =
            '<p>Products could not be loaded. Please try again.</p>';
      });
};

loadProducts('https://fakestoreapi.com/products');

// show all product in UI
const showProducts = (products) => {

   document.getElementById('all-products').innerHTML = '';

   if (!Array.isArray(products)) {
      products = [];
   }

   setInnerText('total_products', products.length);

   if (products.length === 0) {
      document.getElementById('all-products').innerHTML =
         '<p>No products found.</p>';
      return;
   }

   const allProducts = products.slice(0, 10).map((pd) => pd);

   for (const product of allProducts) {
      const image = product.image;

      const div = document.createElement('div');
      div.classList.add('product');

      div.innerHTML = `<div class="single-product">
      <div>
         <img class="product-image" src="${image}" alt="${product.title}">
      </div>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <h2>Price: $ ${product.price}</h2>

      <button onclick="showProductDetails(${product.id})" id="details-btn"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      class="btn btn-outline-secondary mb-2 rounded-1 mt-1">Details</button>

      <button onclick="addToCart(${product.id}, ${product.price})"
      id="addToCart-btn"
      class="buy-now btn btn-success border-0 w-100 rounded-0 bg-main py-2">Add to cart</button>
      </div>`;

      document.getElementById('all-products').appendChild(div);
   }
};

let count = 0;

const addToCart = (id, price) => {
   count = count + 1;

   // Use the price parameter instead of the undefined variable "value"
   updatePrice('price', price);

   updateTaxAndCharge();

   document.getElementById('total-Products').innerText = count;

   // Update the grand total after adding a product
   updateTotal();
};

const showProductDetails = (product_id) => {
   console.log(product_id);

   fetch(`https://fakestoreapi.com/products/${product_id}`)
      .then((res) => {
         if (!res.ok) {
            throw new Error('Failed to load product details');
         }
         return res.json();
      })
      .then((data) => showProductDetailsInModal(data))
      .catch((error) => console.log(error));
};

const showProductDetailsInModal = (product_details) => {
   console.log(product_details);

   setInnerText('exampleModalLabel', product_details.title);
   setInnerText('productId', product_details.id);
   setInnerText('modal_body', product_details.description);
   setInnerText('rating', product_details.rating.rate);
};

const getInputValue = (id) => {
   const element = document.getElementById(id).innerText;
   const converted = parseFloat(element);

   return converted || 0;
};

// main price update function
const updatePrice = (id, value) => {
   const convertedOldPrice = getInputValue(id);
   const convertPrice = parseFloat(value);
   const total = convertedOldPrice + convertPrice;

   document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
   document.getElementById(id).innerText = value;
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
   const priceConverted = getInputValue('price');

   // Default values
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

   setInnerText('delivery-charge', deliveryCharge);
   setInnerText('total-tax', totalTax.toFixed(2));
};

// grandTotal update function
const updateTotal = () => {
   const grandTotal =
      getInputValue('price') +
      getInputValue('delivery-charge') +
      getInputValue('total-tax');

   document.getElementById('total').innerText = grandTotal.toFixed(2);
};

// search by category
document.getElementById('search-btn').addEventListener('click', function () {
   const inputField = document
      .getElementById('input-value')
      .value.trim()
      .toLowerCase();

   // Show all products when the search field is empty
   if (inputField === '') {
      showProducts(arr[0] || []);
      return;
   }

   // Filter returns an array, which showProducts expects
   const searchedProduct = (arr[0] || []).filter((p) =>
      p.category.toLowerCase().startsWith(inputField) ||
      p.title.toLowerCase().includes(inputField)
   );

   showProducts(searchedProduct);
});

// Allow searching by pressing Enter
document.getElementById('input-value').addEventListener('keydown', function (event) {
   if (event.key === 'Enter') {
      document.getElementById('search-btn').click();
   }
});
/*
//============================================================================================== //
Your HTML and most of your CSS are fine. The main problems are in your JavaScript:
1. Wrong image property: you used `product.images`, but the Fake Store API provides `product.image` (singular).
2. Wrong variable in `addToCart()`: you used `value`, which is not defined. You should use the `price` parameter.
3. Missing total calculation: you have an `updateTotal()` function, but you never call it when the cart changes.
4. Wrong product ID element: your HTML uses `id="productId"`, but your JavaScript uses `'product_id'`.
5. Search error: `.find()` returns only one product, while your `showProducts()` function expects an array. Searching with an empty input or a category that doesn't exist can also cause errors.
6. Missing closing HTML in your product template: your product `<div>` needs to be closed properly.
Let's fix these while keeping your original structure and function names.

What exactly was wrong in your original JavaScript?
Your original code      	   Correction              	   Why
-----------------------------------------------------------------------------------
`product.images`	            `product.image`	            The API uses the singular property     
                                                            `image`.

`updatePrice('price', value)`	`updatePrice('price', price)`	`value` was undefined; `price` is your 
                                                            function parameter.

`setInnerText                 setInnerText('productId', ...)The ID must match your HTML exactly.
('product_id', ...)` 

`arr[0].find(...)`	         `arr[0].filter(...)`	         `filter()` returns an array of 
                                                            matching products.

No call to `updateTotal()`	   Call it after adding a product	The cart's grand total must be 
                                                               recalculated.

`Math.round(value)` for       Display the supplied value    Text such as product titles and
every value                		                           descriptions must not be 
                                                            converted to numbers. 

No fetch error handling	      Added `.catch()`	            Shows an error message if products  
                                                            fail to load.


*/