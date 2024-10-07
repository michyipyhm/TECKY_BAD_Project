document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('products');
  const res = await fetch(`/products?products=${productId}`)



  const result = await res.json()
  const product = result.data
  console.log(product)
  const productDetails = document.getElementById('productDetails');
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.innerHTML = `
      <div class="firstSection">
          <div class="row">
          <div class="col-md-6">
              <div class="productImage">
                  <img src="${product_image.image_path}"/>
              </div>
          </div>
          <div class="col-md-6">
          <div class="productBtn">
              <div class="productName"><h1>${products.product_name}</h1><br>
                  <span class="productId">WSP012-${products.id}</span>
              </div>
             
              <div class="price"><span class="priceFont">Price: $${products.product_price}<span>
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
                  <div><span class="descriptionRow">Type: </span>${products.camera_type || 'N/A'}</div>
                  <div><span class="descriptionRow">Format: </span>${products.format_name === 'digital' ? 'N/A' : products.format_name}</div>
                  <div><span class="descriptionRow">Brand: </span>${products.brand_name || 'N/A'}</div>
                  <div><span class="descriptionRow">Origin: </span>${products.origin_country || 'N/A'}</div>
                  <div><span class="descriptionRow">Year: </span>${products.production_year || 'N/A'}</div>
                  
              </div>
          </div>
          </div>
      </div>
  `;
  productDetails.appendChild(productDiv)
  const name = products.product_name
  const addToCartBtns = document.querySelector('.btn.btn-light')
  addToCartBtns.addEventListener('click', async (e) => {
      e.preventDefault()
      const body = {
          name: name
      }
      const res = await fetch("/addToCart", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
          alert(data.message);
      } else {
          alert(data.message);
      }
  })
})
