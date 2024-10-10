const productTypeSelect = document.getElementById("productType");
const categoryTypeSelect = document.getElementById("categoryType");
const decOrderBtn = document.querySelector("#price-dec");
const ascOrderBtn = document.querySelector("#price-asc");

window.onload = async () => {
  getAllProducts();
  

  productTypeSelect.addEventListener("change", getAllProducts);
};

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
    // console.log("test:[" + JSON.stringify(test) + "]");
    let limit = test[0].length;
    // console.log("limit:[" + JSON.stringify(limit) + "]");

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
              <img src="${imagePath}" class="gallery-item" data-id="${productId}" alt="gallery" />
              <div class="card-body">
                <div class="producy-idDiv">BAD-<span class="product-id">${productId}</span>
                &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
                </div>
                <div class="product-name">${productName}</div>
                <a href="#" class="btn btn-light">$${price}</a>
              </div>
            </div>
          </div>`;
      }
    } catch {
      console.error("Error fetching data");
    }
  }
};

handlePriceOrder();

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
  document.querySelector(`#products-container`).innerHTML = "";
  
  let query = "";
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
  
  const res = await fetch(`/products${query}`, {
    method: "GET",
  });
  const result = await res.json();

  if (res.ok) {
    
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
console.log("productId:[" + JSON.stringify(productId) + "]");
      document.querySelector(`#products-container`).innerHTML += `
        <div class="col">
          <div class="card" id="card1">
            <img src="${imagePath}" class="gallery-item" data-id="${productId}" alt="gallery" />
            <div class="card-body">
              <div class="producy-idDiv">BAD-<span class="product-id">${productId}</span>
                &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
                </div>
              <div class="product-name">${productName}</div>
              
              <a href="#" class="btn btn-light">$${price}</a>
            </div>
          </div>
        </div>`;
    }

    document.querySelectorAll(".card").forEach((cardDiv) => {
      const checkProductDetails = cardDiv.querySelectorAll(".gallery-item");
      checkProductDetails.forEach((button) => {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          const id = button.dataset.id;
          console.log("id: " + id);
          window.location.href = `/productdetails.html?product=${id}`;
        });
      })
    });

  } else {
    alert(data.message);
  }
};

