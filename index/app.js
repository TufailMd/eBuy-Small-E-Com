let container = document.querySelector(".container");
let productCards = document.querySelector("#productCards");
let modelContent = document.querySelector(".modal-content");
let shoppingCart = document.querySelector("#shoppingCart");
let mainRowContainer = document.querySelector("#mainRowContainer");
let navList = document.querySelector("#navList");
let order = document.querySelector("#Order");

const baseUrl = "https://fakestoreapi.com/products";
let cartProduct = [];

let allProducts = []; // store all products globally

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartProduct));
}

function loadCart() {
  let data = localStorage.getItem("cart");
  if (data) cartProduct = JSON.parse(data);
}

loadCart();

function updateCart() {
  const existingBadge = shoppingCart.querySelector(".cart-badge");
  if (shoppingCart.querySelector(".cart-badge")) existingBadge.remove();

  let countSpan = document.createElement("span");
  countSpan.className =
    "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge";
  countSpan.style.fontSize = "0.7rem";
  countSpan.textContent = cartProduct.length > 0 ? cartProduct.length : "";

  shoppingCart.append(countSpan);
  console.log(shoppingCart);

  saveCart();
}

function productCard(product) {
  let cardOuterDiv = document.createElement("div");

  cardOuterDiv.classList = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  // console.log("price after parse",price);
  let price = parseFloat(product.price);
  // console.log("price after parse",price);

  price = (price * 10).toFixed(1);
  // <p class="card-text"> ${product.description}</p>
  cardOuterDiv.innerHTML = `
  <div class="card">
    <div class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#playerModal">
      <img src="${product.image}" class="card-img-top rounded" alt="...">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        
        <h6><span class="badge text-bg-warning">${product.rating.rate} &#9733;</span></h6>
        <h4><i class="fa-solid fa-indian-rupee-sign"></i> ${price}</h4>
      </div>
    </div>
    <div class="btnDiv d-flex justify-content-evenly pb-3">
      <button type="button" class="btn btn-primary cartBtn" >Add To Cart</button>
      <button type="button" class="btn btn-success buyBtn" >Buy Now</button>
    </div>
  </div>`;

  const cartBtn = cardOuterDiv.querySelector(".cartBtn");
  const buyBtn = cardOuterDiv.querySelector(".buyBtn");

  cartBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevents the modal from opening
    cartProduct.push(product);
    if (cartBtn.textContent == "Add To Cart") {
      cartBtn.textContent = "Go To Cart";
    }
    updateCart();
  });

  cardOuterDiv.addEventListener("click", () => {
    showModal(product);
  });

  productCards.append(cardOuterDiv);
}

async function getProductData() {
  try {
    let resultData = await axios.get(baseUrl);
    console.log(resultData.data);
    return resultData.data;
  } catch (error) {
    console.log(error);
  }
}

async function displayProduct(category = "", searchQuery = "") {
  if (allProducts.length === 0) {
    allProducts = await getProductData();
  }

  let productData = [...allProducts];

  // Filter by category
  if (category !== "") {
    productData = productData.filter((product) =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Filter by search query
  if (searchQuery !== "") {
    productData = productData.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Clear old products before showing new ones
  productCards.innerHTML = "";

  if (productData.length > 0) {
    productData.forEach((product) => productCard(product));
  } else {
    productCards.innerHTML = `<h3 class="text-center mt-4">No products found</h3>`;
  }
}

let searchForm = document.querySelector("form[role='search']");
let searchInput = searchForm.querySelector("input[type='search']");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let query = searchInput.value.trim();
  displayProduct("", query);
  searchInput.value = "";
});

// async function displayProduct(category = "") {
//   let productData = await getProductData();
//   if (category != "") {
//     productData = productData.filter((product) =>
//       product.category.includes(category)
//     );
//   }
//   console.log(productData);

//   if (productData) {
//     productData.map((product) => productCard(product));
//     console.log(productCards);
//   }
// }
updateCart();

// if (document.location.pathname.endsWith("index.html")) {
//   displayProduct();
// }
// displayProduct();
// console.log(document.location.href);

function showModal(product) {
  let price = parseFloat(product.price);

  price = (price * 10).toFixed(1);
  modelContent.innerHTML = `
          <div class="modal-header">
            <h5 class="modal-title" id="playerModalLabel">${product.title}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body" id="modalContent">
            <div class="productImgDiv d-flex justify-content-center">
              <img src="${
                product.image
              }" class="d-block w-25 rounded" alt="...">
            </div>
            <p class="card-text"> ${product.description}</p>
            <h3><span class="badge text-bg-warning">${
              product.rating.rate
            } &#9733;</span></h3>
            <h4 class="card-title"><i class="fa-solid fa-indian-rupee-sign"></i> ${parseFloat(
              price
            ).toFixed(1)}</h4>

          </div>

          <!-- Modal Footer (optional) -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Add To Cart</button>
            <button type="button" class="btn btn-success">Buy Now</button>
          </div>`;
}

// Cart.html

function productCardForCart(product) {
  let cardOuterDiv = document.createElement("div");

  cardOuterDiv.classList = "card mb-3";

  cardOuterDiv.style.maxWidth = "100vw";

  let price = parseFloat(product.price);

  price = (price * 10).toFixed(1);
  // <p class="card-text"> ${product.description}</p>
  cardOuterDiv.innerHTML = `
  <div class="row g-0 p-3 d-flex align-items-center">
    <div class="col-2 d-flex hover:cursor-pointer justify-content-center">
      <img src="${product.image}" class="img-fluid rounded-start" alt="Product Image">
    </div>
    <div class="col-9 ms-5 d-flex flex-column align-items-end justify-content-center">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <h6><span class="badge text-bg-warning">${product.rating.rate} &#9733;</span></h6>
        <h4><i class="fa-solid fa-indian-rupee-sign"></i> ${price}</h4>
      </div>
      <div class="btnDiv">
        <button type="button" class="btn btn-primary removeBtn">Remove</button>
      </div>
    </div>
  </div>
  `;

  const cartBtn = cardOuterDiv.querySelector(".removeBtn");

  cartBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevents the modal from opening

    cartProduct = cartProduct.filter((cartItem) => cartItem.id != product.id);
    updateCart();

    productCards.innerHTML = ""; // purana content clear
    displayProductForCart(); // fir se refresh
  });

  cardOuterDiv.addEventListener("click", () => {
    showModal(product);
  });

  productCards.append(cardOuterDiv);
}

function creteTotalPriceDiv(params) {
  let totalPrice = cartProduct.reduce(
    (sum, product) => sum + parseFloat(product.price),
    0
  );

  totalPrice *= 10;
  // console.log(totalPrice);

  let DiscountPer = 20;

  let disPrice = parseFloat((totalPrice * 20) / 100).toFixed(1);
  let PlatformFee = 10;

  let finalTotalPrice = totalPrice - disPrice - PlatformFee;

  cartProduct.map((product) => productCardForCart(product));
  let totalPriceDiv = document.createElement("div");

  // totalPriceDiv.classList = "row g-0 p-3 d-flex align-items-center";
  totalPriceDiv.classList =
    "col-4 d-flex justify-content-center sticky-price-details";

  totalPriceDiv.id = "totalPriceDiv";

  // cardOuterDiv.style.maxWidth = "100vw";
  // style="max-width: 18rem; position:sticky; top:90px; z-index:1020;"
  totalPriceDiv.innerHTML = `
      <div class="card border-light mb-3">
        <div class="card-header border-end-dark">Price details</div>
          <div class="card-body flex-grow-0">
            <div class="d-flex justify-content-between">
                <h6 class="mx-3">Price (${cartProduct.length} items)</h6>
                <h6 class="mx-3"> ${totalPrice.toFixed(1)}</h6>
            </div>

            <div class="d-flex justify-content-between">
                <h6 class="mx-3">Discount(${DiscountPer}%)</h6>
                <h6 class="mx-3"> -${disPrice}</h6>
            </div>

             

            <div class="d-flex justify-content-between">
                <h6 class="mx-3">Platform Fee</h6>
                <h6 class="mx-3"> -${PlatformFee.toFixed(1)}</h6>
            </div>
            
          </div>
          <div class="card-footer border-end-dark border-start-dark d-flex justify-content-between align-items-center">
            <h6 class="mx-3">Total Amount</h6>
            <h6 class="mx-3"> ${finalTotalPrice.toFixed(1)}</h6>
          </div>
        </div>
      </div>`;

  return totalPriceDiv;
}

async function displayProductForCart() {
  console.log("displayProductForCart");

  if (cartProduct.length > 0) {
    if (productCards.classList.contains("m-auto")) {
      productCards.classList.remove("m-auto");
    }
    console.log(cartProduct);

    if (document.querySelector("#totalPriceDiv")) {
      document.querySelector("#totalPriceDiv").remove();
    }

    let totalPriceDiv = creteTotalPriceDiv();

    mainRowContainer.append(totalPriceDiv);
    let placeOrderDiv = cretePlaceOrderDiv();

    // productCards.insertAdjacentElement('beforeEnd', placeOrderDiv);
    productCards.append(placeOrderDiv);
  } else {
    if (!productCards.classList.contains("m-auto")) {
      productCards.classList.add("m-auto");
    }

    mainRowContainer.innerHTML = "";
    let noProduct = document.createElement("div");
    noProduct.classList =
      "d-flex flex-column justify-content-center align-items-center";
    // noProduct.classList = ""
    noProduct.innerHTML = `
      <div class="d-flex justify-content-center align-items-center">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" class="d-block w-50" alt="...">
      </div>
      <h3>Your cart is empty</h3>
      <p>Add items to it now.</p>
      <button  onclick="window.location.href = 'index.html';"  type="button" class="btn btn-primary">Shop Now</button>
    `;

    mainRowContainer.append(noProduct);
  }

  saveCart();
}

function cretePlaceOrderDiv() {
  let placeOrder = document.createElement("div");
  placeOrder.classList = "placeOrderOuterDiv sticky-place-order shadow";
  // $orange-500
  //
  //   <div class="placeOrder d-flex justify-content-end rounded p-4 border"  style="max-width: 18rem; position:sticky; bottom:0; z-index:1020;">

  placeOrder.innerHTML = `
  <div class="placeOrder d-flex justify-content-end rounded p-4 border" style="background-color: white;">
    <form>
      <button type="button" class="btn btn-warning">
        <span>Place Order</span>
      </button>
    </form>
  </div>
  `;

  return placeOrder;
}

function changePage() {
  window.location.href = "index.html";
}

navList.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const target = e.target;
  if (target.tagName.toLowerCase() !== "a") return;

  const category = target.textContent.trim();
  const currentPath = window.location.pathname;

  // Pages where clicking category should redirect to Home
  const redirectPages = ["cart.html", "order.html"];

  if (redirectPages.some((page) => currentPath.endsWith(page))) {
    localStorage.setItem("lastCategory", category);
    window.location.href = "index.html";
    return;
  }

  // Remove active class
  document
    .querySelectorAll(".nav-link")
    .forEach((item) => item.classList.remove("active"));
  target.classList.add("active");

  // Clear old content
  productCards.innerHTML = "";

  // Create heading
  let heading = document.createElement("h1");
  heading.innerText = category;
  productCards.insertAdjacentElement("afterbegin", heading);

  // Load products based on category
  const categoryMap = {
    Home: "",
    Clothes: "clothing",
    Electronics: "electronics",
    Jewelery: "jewelery",
  };

  displayProduct(categoryMap[category]);
});

if (location.pathname === "/" || location.pathname.includes("index")) {
  const lastCategory = localStorage.getItem("lastCategory");

  if (lastCategory) {
    let categoryParam;
    // Map the stored text to the API category name
    if (lastCategory === "Home") {
      displayProduct();
    } else if (lastCategory === "Clothes") {
      categoryParam = "clothing";
    } else if (lastCategory === "Electronics") {
      categoryParam = "electronics";
    } else if (lastCategory === "Jewelery") {
      categoryParam = "jewelery";
    }

    if (categoryParam) {
      displayProduct(categoryParam);
    }

    // Set the active class on the correct nav item
    document.querySelectorAll(".nav-link").forEach((item) => {
      if (item.textContent === lastCategory) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Add a heading for the selected category
    if (lastCategory !== "Home") {
      let heading = document.createElement("h1");
      heading.innerText = lastCategory;
      productCards.insertAdjacentElement("afterbegin", heading);
    }
  } else {
    // If no category is stored, display all products (default behavior)
    displayProduct();
  }
}

if (document.location.pathname.endsWith("cart.html")) {
  console.log("Loading cart.html");

  loadCart();

  displayProductForCart();
}

function cretePlaceOrderDiv() {
  let placeOrder = document.createElement("div");
  placeOrder.classList = "placeOrderOuterDiv sticky-place-order shadow";

  placeOrder.innerHTML = `
  <div class="placeOrder d-flex justify-content-end rounded p-4 border" style="background-color: white;">
      <button type="button" id="placeOrderBtn" class="btn btn-warning">
        <span>Place Order</span>
      </button>
  </div>
  `;

  // order.addEventListener('click',()=>{});

  // Event Listener
  setTimeout(() => {
    let btn = document.getElementById("placeOrderBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        if (cartProduct.length > 0) {
          let orders = JSON.parse(localStorage.getItem("orders")) || [];

          // calculate total price
          let totalPrice =
            cartProduct.reduce(
              (sum, product) => sum + parseFloat(product.price),
              0
            ) * 10;

          orders.push({
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: cartProduct,
            total: totalPrice.toFixed(1),
          });

          localStorage.setItem("orders", JSON.stringify(orders));

          cartProduct = [];
          saveCart();

          window.location.href = "order.html";
        }
      });
    }
  }, 100);

  return placeOrder;
}
