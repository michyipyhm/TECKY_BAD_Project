document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get("product");
// console.log("productId:", productId);
 
  const res = await fetch(`/product/details/${product_id}`);

  console.log("res is =", res);
  const result = await res.json();
  console.log("result is ", result);
  const products = result.data; // result {result: {data: {}}}
  const product = products[0]; // result {result: {data: {}}}

  console.log("product is ", product);

  const productDetails = document.getElementById("productDetails");
  const productDiv = document.createElement("div");
  productDiv.className = "product";
  productDiv.innerHTML = `
      <div class="firstSection">
          <div class="row">
          <div class="col-md-6">
              <div class="productImage">
                  <img  data-id="${product.id}" src="${
                    product.image_path
  }"/>
              </div>
          </div>
          <div class="col-md-6">
          <div class="productBtn">
              <div class="productName"><h1>${product.product_name}</h1><br>
                  <span class="productId">BAD-${product.id}</span>
              </div>
             
              <div class="price"><span class="priceFont">Price: $${
                product.product_price
              }<span>
              </div>
              <div class="pickUp">
                  <div calss="pickUpLocation">Pickup available at 
                  </div>
                  <div class="pickUpTime">Usually ready in 2 days
                  </div>
              </div>
              <div class="addToCart">
              <button type="button" class="btn btn-light">Add to cart</button>
              </div>
               <div class="description">
                  <div><h3>Description</h3></div>
                  <div><span class="descriptionRow">Model: </span>${
                    product.model || "N/A"
                  }</div>
                  <div><span class="descriptionRow">Color: </span>${
                    product.color === "null" ? "N/A" : product.color
                  }</div>
              </div>
          </div>
          </div>
      </div>
  `;
  productDetails.appendChild(productDiv);
  const name = product.product_name;
  const addToCartBtns = document.querySelector(".btn.btn-light");
  addToCartBtns.addEventListener("click", async (e) => {
    e.preventDefault();
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
