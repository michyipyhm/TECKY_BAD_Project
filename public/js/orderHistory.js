document.addEventListener('DOMContentLoaded', async () => {

    let res = await fetch("/orderHistory")
        if (res.status === 401) {
        alert('Please login first.');
        window.location.href = '/index.html';
        return;
    }

    let result = await res.json()
    
    const orderDetail = result.orderHistoryResult
    // console.log(orderDetail)
    const orderForm = document.getElementById('orderForm');

    for (let order of orderDetail) {
        console.log(order)

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hur = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            const sec = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year} ${hur}:${min}:${sec}`;
        }
        const createdDate = formatDate(new Date(order.created_at))
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
            <div class="card" id="orderCard">
                <div class="orderId"><span id="orderFont">Order Number: </span><span>TECKYACADEMY-C32-WSP012-</span>${order.id}</div>
                <div class="orderTotalPrice"><span id="orderFont">Total Price: </span>$${order.total}</div>
                <div class="orderStatus"><span id="orderFont">Status: </span>
                <span id="statFont" class="${order.state}">${order.state}</span> </div>
                <div class="orderDate"><span id="orderFont">Order Date: </span>${createdDate}</div>
                <button type="button" class="btn btn-info" id="detailsBtn">Details</button>
            </div>
        `;
        orderForm.appendChild(orderDiv)

        const detailsBtn = orderDiv.querySelector('#detailsBtn')
        detailsBtn.addEventListener("click", async (e) => {
            const id = order.id
            window.location.href = `/orderDetail.html`
        })
    }
})

// const checkOut = document.getElementById("checkOutBtn");
// const orderStatus = document.getElementById("status");
// orderStatus.textContent = `${resultObject.orderStatus.state}`

// if (orderStatus.textContent === 'Paid') {
// checkOut.style.display = 'none'
// cancelBtn.style.display = 'none'
// orderStatus.classList.add('paid')
// } else if (orderStatus.textContent === 'Canceled') {
// checkOut.style.display = 'none'
// cancelBtn.style.display = 'none'
// orderStatus.classList.add('canceled')

// } else {
// checkOut.style.display = 'block';
// cancelBtn.style.display = 'block';
// }