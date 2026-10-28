
/* ==========================================
   Global array
========================================== */

const arr = [];


/* ==========================================
   Load products
========================================== */

const loadProducts = (url) => {

    fetch(url)
        .then((res) => {

            if (!res.ok) {
                throw new Error("Failed to load products");
            }

            return res.json();

        })
        .then((data) => {

            // Check that the JSON contains an array
            if (!Array.isArray(data)) {
                throw new Error("Product data must be an array");
            }

            // Store products
            arr.length = 0;
            arr.push(data);

            // Display products
            showProducts(data);

        })
        .catch((error) => {

            console.error("Error:", error);

            document.getElementById("all-products").innerHTML = `
                <h3 class="text-danger text-center">
                    Failed to load products.
                    Please check your JSON file and Live Server.
                </h3>
            `;

        });

};


/* ==========================================
   Load data from your JSON file
========================================== */

loadProducts("./ranga-api.json");


/* ==========================================
   Show products
========================================== */

const showProducts = (products) => {

    const allProductsContainer =
        document.getElementById("all-products");

    // Clear previous products
    allProductsContainer.innerHTML = "";

    // Check if products exist
    if (!Array.isArray(products) || products.length === 0) {

        setInnerText("total_products", 0);

        allProductsContainer.innerHTML = `
            <h3 class="text-danger">
                No products found.
            </h3>
        `;

        return;
    }

    // Total number of products matching the current display
    setInnerText("total_products", products.length);

    // Display only the first 10 products
    const allProducts = products.slice(0, 10);

    // Create product cards
    for (const product of allProducts) {

        // IMPORTANT:
        // Your JSON property is "image", not "images"
        const image = product.image;

        const div = document.createElement("div");

        div.classList.add("product");

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
                    Price: $${product.price}
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
                    class="buy-now btn btn-success border-0 w-100 rounded-0 py-2"
                >
                    Add to cart
                </button>

            </div>

        `;

        // If an image URL fails, show a fallback image
        const productImage = div.querySelector(".product-image");

        productImage.onerror = function () {

            console.error("Image failed to load:", this.src);

            this.onerror = null;

            this.src =
                "https://placehold.co/300x300?text=Image+Unavailable";

            this.alt = "Product image unavailable";

        };

        allProductsContainer.appendChild(div);

    }

};


/* ==========================================
   Cart count
========================================== */

let count = 0;


/* ==========================================
   Add product to cart
========================================== */

const addToCart = (id, price) => {

    // Increase product count
    count = count + 1;

    // Add product price
    updatePrice("price", price);

    // Update delivery charge and tax
    updateTaxAndCharge();

    // Update grand total
    updateTotal();

    // Display number of products
    document.getElementById("total-Products").innerText = count;

};


/* ==========================================
   Show product details
========================================== */

const showProductDetails = (product_id) => {

    // Make sure the JSON has loaded
    if (!arr[0]) {
        console.error("Products have not loaded yet.");
        return;
    }

    // Find the selected product
    const product = arr[0].find(
        (product) => product.id === product_id
    );

    if (!product) {
        console.error("Product not found:", product_id);
        return;
    }

    showProductDetailsInModal(product);

};


/* ==========================================
   Display product details in modal
========================================== */

const showProductDetailsInModal = (product_details) => {

    console.log(product_details);

    // Product title
    setInnerText(
        "exampleModalLabel",
        product_details.title
    );

    // HTML ID is "productId"
    setInnerText(
        "productId",
        product_details.id
    );

    // Description
    document.getElementById("modal_body").innerText =
        product_details.description;

    // Rating
    setInnerText(
        "rating",
        product_details.rating.rate
    );

};


/* ==========================================
   Get number from HTML
========================================== */

const getInputValue = (id) => {

    const element =
        document.getElementById(id).innerText;

    const converted =
        parseFloat(element);

    return converted;

};


/* ==========================================
   Update price
========================================== */

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


/* ==========================================
   Set inner text
========================================== */

const setInnerText = (id, value) => {

    document.getElementById(id).innerText =
        value;

};


/* ==========================================
   Update delivery charge and tax
========================================== */

const updateTaxAndCharge = () => {

    const priceConverted =
        getInputValue("price");

    // Default delivery charge
    let deliveryCharge = 20;

    // Default tax
    let tax = 0;

    // More than $200
    if (priceConverted > 200) {

        deliveryCharge = 30;
        tax = priceConverted * 0.20;

    }

    // More than $400
    if (priceConverted > 400) {

        deliveryCharge = 50;
        tax = priceConverted * 0.30;

    }

    // More than $500
    if (priceConverted > 500) {

        deliveryCharge = 60;
        tax = priceConverted * 0.40;

    }

    // Update HTML
    setInnerText(
        "delivery-charge",
        deliveryCharge
    );

    setInnerText(
        "total-tax",
        tax.toFixed(2)
    );

};


/* ==========================================
   Update grand total
========================================== */

const updateTotal = () => {

    const price =
        getInputValue("price");

    const delivery =
        getInputValue("delivery-charge");

    const tax =
        getInputValue("total-tax");

    const grandTotal =
        price + delivery + tax;

    document.getElementById("total").innerText =
        grandTotal.toFixed(2);

};


/* ==========================================
   Search products
========================================== */

document
    .getElementById("search-btn")
    .addEventListener("click", function () {

        // Get search input
        const inputField =
            document
                .getElementById("input-value")
                .value
                .trim()
                .toLowerCase();

        // Make sure products have loaded
        if (!arr[0]) {
            console.error("Products have not loaded yet.");
            return;
        }

        // If input is empty, show all products
        if (inputField === "") {

            showProducts(arr[0]);

            return;

        }

        // Use filter() to find multiple products
        const searchedProducts =
            arr[0].filter((product) =>

                product.title.toLowerCase().includes(inputField) ||
                product.category.toLowerCase().includes(inputField)

            );

        // Display search results
        showProducts(searchedProducts);

    });


/* ==========================================
   Search when pressing Enter
========================================== */

document
    .getElementById("input-value")
    .addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            document
                .getElementById("search-btn")
                .click();

        }

    });
