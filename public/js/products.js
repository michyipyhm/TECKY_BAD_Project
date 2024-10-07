const productTypeSelect = document.getElementById("productType");
const categoryTypeSelect = document.getElementById("categoryType");
const decOrderBtn = document.querySelector("#price-dec");
const ascOrderBtn = document.querySelector("#price-asc");

const handlePriceOrder = async (e) => {
  decOrderBtn.addEventListener("click", () => {
    setPriceOrder("dec");
  });
  ascOrderBtn.addEventListener("click", () => {
    setPriceOrder("asc");
  });

  async function setPriceOrder(order) {
    const priceOrder = {
      price_order: order,
    };
    let body = {};

    const formData = new FormData(document.querySelector("#productsForm"));

    let test = [...formData];

    let limit = test[0].length;
    console.log("limit:[" + JSON.stringify(limit) + "]")

    for (const [key, value] of formData) {
      body[key] = value.toLowerCase();
    }

    body = { ...body, ...priceOrder };

    try {
      const res = await fetch("/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      document.querySelector(`#products-container`).innerHTML = "";
      for (let i = 0; i < result.products.length; i++) {
        let imagePath = result.products[i].image_path;
        let productId = result.products[i].product_id;
        let quantity = result.products[i].product_quantity;
        let productName = result.products[i].product_name;
        let price = result.products[i].product_price;

        let quantityText = "";
        let quantityClass = "";

        if (quantity > 1) {
          quantityText = "In stock";
          quantityClass = "quantity-green";
        } else if (quantity <= 0) {
          quantityText = "Out of stock";
          quantityClass = "quantity-gray";
        } else if (quantity === 1) {
          quantityText = `Still ${quantity} left`;
          quantityClass = "quantity-red";
        }

        document.querySelector(`#products-container`).innerHTML += `
          <div class="col">
            <div class="card" id="card1">
              <img src="${imagePath}" class="gallery-item" alt="gallery" />
              <div class="card-body">
                <div class="producy-idDiv">WSP012-<span class="product-id">${productId}</span>
                &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
                </div>
                <div class="product-name">${productName}</div>
                <div class="price">$ ${price}</div>
                <a href="#" class="btn btn-light">Add to cart</a>
              </div>
            </div>
          </div>`;
      }
    } catch {
      console.error("Error fetching data");
    }
  }
};
window.onload = async () => {
  try {
    const res = await fetch("/products");
    const result = await res.json();

    document.querySelector(`#products-container`).innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      let imagePath = result[i].image_path;
      let productId = result[i].product_id;
      let quantity = result[i].product_quantity;
      let productName = result[i].product_name;
      let price = result[i].product_price;

      let quantityText = "";
      let quantityClass = "";

      if (quantity > 1) {
        quantityText = "In stock";
        quantityClass = "quantity-green";
      } else if (quantity <= 0) {
        quantityText = "Out of stock";
        quantityClass = "quantity-gray";
      } else if (quantity === 1) {
        quantityText = `Still ${quantity} left`;
        quantityClass = "quantity-red";
      }

      document.querySelector(`#products-container`).innerHTML += `
        <div class="col">
          <div class="card" id="card1">
            <img src="${imagePath}" class="gallery-item" alt="gallery" />
            <div class="card-body">
              <div class="producy-idDiv"><span class="product-id">${quantity}</span>                
              &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
              </div>
              <div class="product-name">${productName}</div>
              <div class="price">$ ${price}</div>
              <a href="#" class="btn btn-light">Add to cart</a>
            </div>
          </div>
        </div>`;
    }
  } catch (error) {
    console.error("Error fetching data");
  }
  productTypeSelect.addEventListener("change", getAllProducts);
};

handlePriceOrder();

// const handleSelectChange = async (e) => {
//   e.preventDefault();

//   let body = {};

//   let clearArray = ["product_type_area", "category_type_area"];

//   let currentPosition = clearArray.findIndex(
//     (element) => element == e.target.name + "_area"
//   );

//   for (let i = currentPosition + 1; i < clearArray.length; i++) {
//     clearContent(clearArray[i]);
//   }
//   const formData = new FormData(document.querySelector("#productsForm"));

//   for (const [key, value] of formData) {
//     body[key] = value.toLowerCase();
//   }

//   const res = await fetch("/products", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });
//   const result = await res.json();

//   let htmlName;
//   let displayName;

//   switch (result.nextCriteria) {
//     case "product_type":
//       htmlName = "productType";
//       displayName = "Product Type";
//       break;
//     case "category_type":
//       htmlName = "categoryType";
//       displayName = "Category Type";
//       break;
//   }

//   let dynamicHTML = "";

//   for (let option of result.nextOptions) {
//     if (
//       option[`${result.nextCriteria}`] !== undefined &&
//       option[`${result.nextCriteria}`] !== null
//     ) {
//       dynamicHTML += `<option value="${option[`${result.nextCriteria}`]}">${
//         option[`${result.nextCriteria}`]
//       }</option>`;
//     }
//   }

//   if (result.nextCriteria) {
//     document.querySelector(`#${result.nextCriteria + "_area"}`).innerHTML = `
//           <label for="${htmlName}">${displayName}:</label>
//             <select name="${result.nextCriteria}" id="${htmlName}">
//               <option value="" disabled selected>Select ${displayName}</option>
//               ${dynamicHTML}
//             </select>`;

//     const newSelect = document.querySelector(`#${htmlName}`);

//     if (newSelect) {
//       newSelect.addEventListener("change", handleSelectChange);
//     } else {
//       console.error(`"${htmlName}" not found`);
//     }
//   }

//   document.querySelector(`#products-container`).innerHTML = "";
//   for (let i = 0; i < result.products.length; i++) {
//     let imagePath = result.products[i].image_path;
//     let productId = result.products[i].product_id;
//     let quantity = result.products[i].product_quantity;
//     let productName = result.products[i].product_name;
//     let price = result.products[i].product_price;

//     let quantityText = "";
//     let quantityClass = "";

//     if (quantity > 1) {
//       quantityText = "In stock";
//       quantityClass = "quantity-green";
//     } else if (quantity <= 0) {
//       quantityText = "Out of stock";
//       quantityClass = "quantity-gray";
//     } else if (quantity === 1) {
//       quantityText = `Still ${quantity} left`;
//       quantityClass = "quantity-red";
//     }

//     document.querySelector(`#products-container`).innerHTML += `
//           <div class="col">
//             <div class="card" id="card1">
//               <img src="${imagePath}" class="gallery-item" alt="gallery" />
//               <div class="card-body">
//                 <div class="producy-idDiv">-<span class="product-id">${quantity}</span>
//                 &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
//                 </div>
//                 <div class="product-name">${productName}</div>
//                 <div class="price">$ ${price}</div>
//                 <a href="#" class="btn btn-light">Add to cart</a>
//               </div>
//             </div>
//           </div>`;
//   }
//   document.querySelectorAll(".card").forEach((cardDiv) => {
//     const productNameDiv = cardDiv.querySelector(".product-name");
//     const productName = productNameDiv.textContent;
//     const productIdSpan = cardDiv.querySelector(".product-id");
//     const productId = productIdSpan.textContent;
//     const addToCartBtns = cardDiv.querySelectorAll(".btn.btn-light");
//     const checkProductDetails = cardDiv.querySelectorAll(".gallery-item");

//     addToCartBtns.forEach((button) => {
//       button.addEventListener("click", async (e) => {
//         e.preventDefault();
//         const name = productName;
//         const body = {
//           name: name,
//         };
//         const res = await fetch("/addToCart", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(body),
//         });
//         const data = await res.json();
//         if (res.ok) {
//           alert(data.message);
//         } else {
//           alert(data.message);
//         }
//       });
//     });
//     checkProductDetails.forEach((button) => {
//       button.addEventListener("click", async (e) => {
//         e.preventDefault();
//         const id = productId;
//         window.location.href = `/product_details.html?products=${id}`;
//       });
//     });
//   });
// };

const getAllProducts = async (e) => {
  const searching = [];
  const productType = { productType: productTypeSelect.value };
  const category_type = { categoryType: productTypeSelect.value };
  if (productType.productType) {
    searching.push(productType);
  }
  if (category_type.categoryType) {
    searching.push(category_type);
  }
  document.querySelector(`#products-container`).innerHTML = '';
  // console.log("productType:[" + JSON.stringify(productType) + "]")
  let query = "";
  // console.log(searching);
  for (let i = 0; i < searching.length; i++) {
    const key = Object.keys(searching[i])[0];
    const value = Object.values(searching[i])[0];
    if (i == 0) {
      query += "?";
    } else {
      query += "&";
    }
    query += `${key}=${value}`;
  }
  // console.log(query);

  // ?productType=${productTypeSelect.value}&categoryType=${categoryTypeSelect.value}
  const res = await fetch(`/products${query}`, {
    method: "GET",
  });
  const data = await res.json();
  
  if (res.ok) {
    console.log("OK");
  } else {
    alert(data.message);
  }
  const productSelect = document.querySelector('#productsForm')
  productSelect.addEventListener('change', async (e) => {
    e.preventDefault()
  for (let i = 0; i < data.length; i++) {
    let imagePath = data[i].image_path;
    let productId = data[i].product_id;
    let quantity = data[i].product_quantity;
    let productName = data[i].product_name;
    let price = data[i].product_price;
    
    let quantityText = "";
      let quantityClass = "";

      if (quantity > 1) {
        quantityText = "In stock";
        quantityClass = "quantity-green";
      } else if (quantity <= 0) {
        quantityText = "Out of stock";
        quantityClass = "quantity-gray";
      } else if (quantity === 1) {
        quantityText = `Still ${quantity} left`;
        quantityClass = "quantity-red";
      }

    document.querySelector(`#products-container`).innerHTML += `
    <div class="col">
      <div class="card" id="card1">
        <img src="${imagePath}" class="gallery-item" alt="gallery" />
        <div class="card-body">
          <div class="producy-idDiv"><span class="product-id">${quantity}</span>                
          &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
          </div>
          <div class="product-name">${productName}</div>
          <div class="price">$ ${price}</div>
          <a href="#" class="btn btn-light">Add to cart</a>
        </div>
      </div>
    </div>`;
}

});
};
getAllProducts();
