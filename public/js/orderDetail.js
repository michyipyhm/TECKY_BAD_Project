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

  for (let resultObject of result.orderResult) {
    console.log("orderResult is", resultObject);

    const orderId = document.getElementById("orderNum");
    const orderDetails = document.getElementById("orderDetails");
    // orderId.textContent = `TECKYACADEMY-C32-WSP012-${orderNumber}`

    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
                <div class="productPicName">
                    <div class="productPicture"><img src="${resultObject.image_path}" width="100" height="100"/></div>
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

    //價錢

    const checkOut = document.getElementById("checkOutBtn");
    const cancelBtn = document.getElementById("cancelOrder");
    const orderStatus = document.getElementById("status");
  }
  
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.textContent = `${grandTotal}`;

  // orderStatus.textContent = `${resultObject.orderStatus.state}`

  // if (orderStatus.textContent === 'Paid') {
  //   checkOut.style.display = 'none'
  //   cancelBtn.style.display = 'none'
  //   orderStatus.classList.add('paid')
  // } else if (orderStatus.textContent === 'Canceled') {
  //   checkOut.style.display = 'none'
  //   cancelBtn.style.display = 'none'
  //   orderStatus.classList.add('canceled')

  // } else {
  //   checkOut.style.display = 'block';
  //   cancelBtn.style.display = 'block';
  // }

  // //Stripe
  // const stripe = Stripe('pk_test_51PreUORwdDaooQDsXVRYADhkpUyJjq3dMOSpQuv4mYsDcrw1kR9F0l157cC5IeJSOeSC0ipQXwVCy4cy6p2j05F100pYHXCLcU');
  // const orderId = orderNumber
  // // console.log(orderId)

  // checkOut.addEventListener('click', async (event) => {
  //   event.preventDefault();

  //   const response = await fetch('/create-checkout-session', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ orderId })
  //   })
  //   const session = await response.json();

  //   const result = await stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   })

  //   if (result.error) {
  //     alert(result.error.message);
  //   }
  // })
  //     }
  // }
  // console.log("grandTotal is", grandTotal)

  // //Cancel order
  // const urlParams = new URLSearchParams(window.location.search);
  // const orderId = urlParams.get('orderNum');
  // const cancelBtn = document.getElementById('cancelOrder')
  // console.log(orderId)
  // cancelBtn.addEventListener('click', async (event) => {
  //   event.preventDefault();

  //   const res = await fetch('/orderCancel', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ orderId })
  //   })

  //   const data = await res.json()
  //   if (res.ok) {
  //     alert(data.message)
  //     window.location = "/index.html"
  //   } else {
  //     alert(data.message)
  //   }
});
