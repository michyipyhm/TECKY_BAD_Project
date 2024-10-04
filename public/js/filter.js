const productTypeSelect = document.getElementById("productType");

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

    const formData = new FormData(document.querySelector("#filterForm"));

    let test = [...formData];

    let limit = test[0].length;
    
    for (const [key, value] of formData) {
     
      body[key] = value.toLowerCase();
    }

   

    body = { ...body, ...priceOrder };

    

    try {
      const res = await fetch("/filter", {
        method: "POST",
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
        let phone_type = result.products[i].phone_type;
        let quantityText = "";
        let quantityClass = "";

        if (quantity > 1) {
          quantityText = "In stock";
          quantityClass = "quantity-green";
        } else if (quantity <= 0) {
          quantityText = "Out of stock";
          quantityClass = "quantity-gray";
        } else if (quantity === 1 ) {
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
                <div class="phone_type">${phone_type}</div>
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
    const res = await fetch("/getProduct");
    const result = await res.json();

    
    document.querySelector(`#products-container`).innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      
      let imagePath = result[i].image_path;
      let productId = result[i].product_id;
      let quantity = result[i].product_quantity;
      let productName = result[i].product_name;
      let price = result[i].product_price;
      let phone_type = result.products[i].phone_type;
      let quantityText = "";
      let quantityClass = "";

      if (quantity > 1) {
        quantityText = "In stock";
        quantityClass = "quantity-green";
      } else if (quantity <= 0) {
        quantityText = "Out of stock";
        quantityClass = "quantity-gray";
      } else if (quantity === 1 ) {
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
              <div class="phone_type">${phone_type}</div>
              <div class="price">$ ${price}</div>
              <a href="#" class="btn btn-light">Add to cart</a>
            </div>
          </div>
        </div>`;
    }
  } catch (error) {
    console.error("Error fetching data");
  }
};

handlePriceOrder();

const handleSelectChange = async (e) => {
  e.preventDefault();
 

  let body = {};

  let clearArray = [
    "phone_type_area",
    "category_name_area",
    "category_type_area",
  ];

  let currentPosition = clearArray.findIndex(
    (element) => element == e.target.name + "_area"
  );
  

  for (let i = currentPosition + 1; i < clearArray.length; i++) {
    
    clearContent(clearArray[i]);
  }
  const formData = new FormData(document.querySelector("#filterForm"));
  

  for (const [key, value] of formData) {
   
    body[key] = value.toLowerCase();
  }

  

  
  const res = await fetch("/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await res.json();

  

  

  let htmlName;
  let displayName;

  switch (result.nextCriteria) {
    case "product_type":
      htmlName = "productType";
      displayName = "Product Type";
      break;
    case "format_name":
      htmlName = "formatName";
      displayName = "Format";
      break;
    case "camera_type":
      htmlName = "cameraType";
      displayName = "Camera Type";
      break;
    case "is_used":
      htmlName = "isUsed";
      displayName = "New or Used";
      break;
    case "origin_country":
      htmlName = "originCountry";
      displayName = "Origin";
      break;
    case "brand_name":
      htmlName = "brandName";
      displayName = "Brand";
      break;
    case "iso":
      htmlName = "iso";
      displayName = "ISO";
      break;
  }

  let dynamicHTML = "";
  console.log("Nextcrit result is", result.nextCriteria);
  for (let option of result.nextOptions) {
    
    if (
      option[`${result.nextCriteria}`] !== undefined &&
      option[`${result.nextCriteria}`] !== null
    ) {
      dynamicHTML += `<option value="${option[`${result.nextCriteria}`]}">${
        option[`${result.nextCriteria}`]
      }</option>`;
    }
  }



  if (result.nextCriteria) {
    document.querySelector(`#${result.nextCriteria + "_area"}`).innerHTML = `
          <label for="${htmlName}">${displayName}:</label>
            <select name="${result.nextCriteria}" id="${htmlName}">
              <option value="" disabled selected>Select ${displayName}</option>
              ${dynamicHTML}
            </select>`;

    const newSelect = document.querySelector(`#${htmlName}`);
    
    if (newSelect) {
      newSelect.addEventListener("change", handleSelectChange);
    } else {
      console.error(`"${htmlName}" not found`);
    }
  }

  document.querySelector(`#products-container`).innerHTML = "";
  for (let i = 0; i < result.products.length; i++) {
    
    let imagePath = result.products[i].image_path;
    let productId = result.products[i].product_id;
    let quantity = result.products[i].product_quantity;
    let productName = result.products[i].product_name;
    let price = result.products[i].product_price;
    let phone_type = result.products[i].phone_type;

    let quantityText = "";
    let quantityClass = "";

    if (quantity > 1) {
      quantityText = "In stock";
      quantityClass = "quantity-green";
    } else if (quantity <= 0) {
      quantityText = "Out of stock";
      quantityClass = "quantity-gray";
    } else if (quantity === 1 ) {
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
                <div class="phone_type">${phone_type}</div>
                <div class="price">$ ${price}</div>
                <a href="#" class="btn btn-light">Add to cart</a>
              </div>
            </div>
          </div>`;
  }
  document.querySelectorAll(".card").forEach((cardDiv) => {
    const productNameDiv = cardDiv.querySelector(".product-name");
    const productName = productNameDiv.textContent;
    const productIdSpan = cardDiv.querySelector(".product-id");
    const productId = productIdSpan.textContent;
    const addToCartBtns = cardDiv.querySelectorAll(".btn.btn-light");
    const checkProductDetails = cardDiv.querySelectorAll(".gallery-item");

    addToCartBtns.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const name = productName;
        const body = {
          name: name,
        };
        const res = await fetch("/addToCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
        } else {
          alert(data.message);
        }
      });
    });
    checkProductDetails.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = productId;
        window.location.href = `/product.html?product=${id}`;
      });
    });
  });
};

productTypeSelect.addEventListener("change", handleSelectChange);

function clearContent(target) {
  document.querySelector(`#${target}`).innerHTML = "";
}
