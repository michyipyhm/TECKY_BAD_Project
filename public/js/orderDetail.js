document.addEventListener("DOMContentLoaded", async () => {
  // const urlParams = new URLSearchParams(window.location.search);
  // const orderNumber = urlParams.get('orderNum');
  // let res = await fetch(`/order?orderNum=${orderNumber}`)

  let res = await fetch("/checkOrder");

  if (res.status === 401) {
    alert("Please login first.");
    window.location.href = "/index.html";
    return;
  }

  let result = await res.json();
  let grandTotal = 0;
  let fetchPackage = result.fetchOrderDetail;
  for (let resultObject of fetchPackage) {
    console.log("orderResult is", resultObject);

    // const orderId = document.getElementById("orderNum");
    const orderDetails = document.getElementById("orderDetails");
    // orderId.textContent = `TECKYACADEMY-C32-WSP012-${orderNumber}`

    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
                <div class="productPicName">
                    <div class="productPicture"><img src="${resultObject.product_images[0]}" width="100" height="100"/></div>
                    <div class="productName">PRODUCT NAME: ${resultObject.product_name}</div>
                </div>
                <div class="productRow">
                    <div>UNIT PRICE: $${resultObject.product_price}</div>
                </div>
                <div class="productRow">
                    <div>QUANTITY: ${resultObject.quantity}</div>
                </div>
                <div class="productRow">
                    <div>SUBTOTAL: $${resultObject.subtotal}</div>
                </div>
              </div>
          `;
    orderDetails.appendChild(productDiv);

    grandTotal += resultObject.subtotal;
  }

  const totalPrice = document.getElementById("totalPrice");
  totalPrice.textContent = `${grandTotal}`;

  //Cancel order
  const cancelBtn = document.getElementById("cancelOrder");
  cancelBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const orderIds = fetchPackage.map((order) => order.order_id);

    const res = await fetch("/orderCancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderIds }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      window.location = "/index.html";
    } else {
      alert(data.message);
    }
  });

  //Stripe
  const stripe = Stripe(
    "pk_test_51Q8k8BRxPcdn4EKsbQzTyA8MmMbbatLcaT7ble016SP62sGEVmyflvK3FkQcFfRpvu512FBrYSMbr0QuEHaBdMCc00C3S67Z7d"
  );

  const checkOut = document.getElementById("checkOutBtn");
  checkOut.addEventListener("click", async (event) => {
    event.preventDefault();

    const orderIds = fetchPackage.map((order) => order.order_id);

    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderIds, grandTotal }),
    });
    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  });
});
