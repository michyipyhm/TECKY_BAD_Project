document.addEventListener("DOMContentLoaded", async () => {
  let res = await fetch("/shoppingcart");
  if (res.status === 401) {
    alert("Please login first.");
    window.location.href = "/index.html";
    return;
  }
  let data = await res.json();

  console.log("fetch result: ", data);

  const shoppingCartForm = document.getElementById("shoppingCartForm");
  const cartEmptyDiv = document.querySelector(".cartEmpty");
  const orderBtn = document.querySelector("#orderBtnForm");

  if (data.result.length > 0) {
    cartEmptyDiv.style.display = "none";
  }
  if (data.result.length <= 0) {
    orderBtn.style.display = "none";
  }

  for (let product of data.result) {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <div class="card" id="shoppingCartCard">
                <div class="productPicture"><img src="${
                  product.product_images[0]
                }" width="300" height="300"/></div>
                <div class="productProperty">
                    <div class="productName">${product.product_name}
                    </div>
                    <div class="productRow">
                        <div class="productDetails">
                            <span id="productDetailsH1">Product Details</span><br>
                            <div>Color: <span>${
                              product.color_name || "N/A"
                            }</span></div>
                        </div>
                        <div class="productQuantity">
                            <div class="productPrice">Product Price:<span id="priceNum">$${
                              product.product_price
                            }</span></div>
                        <label for="quantity">Quantity:</label>
                            <select id="quantity" name="quantity">
                                <option value="1" ${
                                  product.quantity == 1 ? "selected" : ""
                                }>1</option>
                                <option value="2" ${
                                  product.quantity == 2 ? "selected" : ""
                                }>2</option>
                                <option value="3" ${
                                  product.quantity == 3 ? "selected" : ""
                                }>3</option>
                                <option value="4" ${
                                  product.quantity == 4 ? "selected" : ""
                                }>4</option>
                                <option value="5" ${
                                  product.quantity == 5 ? "selected" : ""
                                }>5</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-outline-danger" id="deleteProduct" name="deleteProduct">Delete</button>
                    </div>
                <div>
        `;
    shoppingCartForm.appendChild(productDiv);

    // 選擇數量
    const quantitySelect = productDiv.querySelector("#quantity");
    quantitySelect.addEventListener("change", async (e) => {
      e.preventDefault();
      const newQuantity = e.target.value;
      const id = product.product_option_id;

      const body = {
        id: id,
        quantity: newQuantity,
      };

      const res = await fetch("/selectedQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        location.reload();
      } else {
        alert(data.message);
        location.reload();
      }
    });

    //刪除物品
    const deleteProduct = productDiv.querySelector("#deleteProduct");
    deleteProduct.addEventListener("click", async (e) => {
      e.preventDefault();

      const body = {
        product,
      };
      const res = await fetch("/deleteShoppingCartItem", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        productDiv.remove();
        location.reload();
        return;
      }
    });
  }

  //totalprice
  let totalPrice = 0;
  let pricedata = data.result;


  for (let i = 0; i < pricedata.length; i++) {
    totalPrice += pricedata[i].product_price;
    finalPrice = totalPrice * pricedata[i].quantity;
  }

  const totalPriceBox = document.getElementById("totalPrice");
  totalPriceBox.textContent = `Total Price: $ ${finalPrice}`;
});

//去orderdetails畫面
const orderBtn = document.querySelector("#order-button");
orderBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const body = {
    finalPrice: finalPrice
  }
  const res = await fetch("/shoppingCartSendOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({finalPrice}),
  });
  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    window.location.href = "/orderDetail.html";
  }
  if (res.status === 500) {
    alert(data.message);
    return;
  }
  if (res.status === 400) {
    alert(data.message);
    return;
  }
});
