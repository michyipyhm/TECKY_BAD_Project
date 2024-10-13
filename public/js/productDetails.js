const colorDropdown = document.getElementById("color_dropdown");
const colorDropdownArea = document.getElementById("color_dropdown_area");
const modelDropdown = document.getElementById("model_dropdown");
const emblaContainer = document.getElementById("embla__container");
const emblaThumbsContainer = document.getElementById("embla-thumbs__container");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");


var selectedImage = "";
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get("product");
  // console.log("productId:", productId);

  const res = await fetch(`/product/details/${product_id}`);

  
  const result = await res.json();
  
  const products = result.data;
  const product = products[0];
  selectedImage = product.image_path;

  productTitle.innerHTML = product.product_name;
  productPrice.innerHTML = `$${product.product_price}`;
  
  

  //image
  emblaContainer.innerHTML = "";
  emblaThumbsContainer.innerHTML = "";
  
  products.forEach((product) => {
    emblaContainer.innerHTML += `
    <div class="embla__slide">
      <div class="embla__slide__number"><img src="${product.image_path}" width="300" height="300">
      </div>
      </div>`;
    emblaThumbsContainer.innerHTML += `
    <div class="embla-thumbs__slide">
      <button type="button" class="embla-thumbs__slide__number">
        <img src="${product.image_path}" width="50" height="50">
      </button>
    </div>`;
  });

  //color_dropdown
  if (product.color !== "null") {
    colorDropdown.innerHTML = ``;
    products.forEach((product) => {
      colorDropdown.innerHTML += `<option value="${product.color}">${product.color}</option>`;
    });
  } else {
    colorDropdownArea.style.display = "none";
  }

  //model_dropdown
  modelDropdown.innerHTML = ``;
  products.forEach((product) => {
    modelDropdown.innerHTML += `<option value="${product.model}">${product.model}</option>`;
  });

  

  const productDetails = document.getElementById("productDetails");

  loadEmblaCarousel();
  // const productDiv = document.createElement("div");
  // productDiv.className = "product";
  // productDiv.innerHTML = `
  //     <div class="firstSection">
  //         <div class="row">
  //         <div class="col-md-6">
  //             <div class="productImage">
  //                 <img  data-id="${product.id}" src="${
  //                   product.image_path
  // }"/>
  //             </div>
  //         </div>
  //         <div class="col-md-6">
  //         <div class="productBtn">
  //             <div class="productName"><h1>${product.product_name}</h1><br>
  //                 <span class="productId">BAD-${product.id}</span>
  //             </div>
             
  //             <div class="price"><span class="priceFont">Price: $${
  //               product.product_price
  //             }<span>
  //             </div>
  //             <div class="pickUp">
  //                 <div calss="pickUpLocation">Pickup available at 
  //                 </div>
  //                 <div class="pickUpTime">Usually ready in 2 days
  //                 </div>
  //             </div>
  //             <div class="addToCart">
  //             <button type="button" class="btn btn-light">Add to cart</button>
  //             </div>
  //              <div class="description">
  //                 <div><h3>Description</h3></div>
  //                 <div><span class="descriptionRow">Model: </span>${
  //                   product.model || "N/A"
  //                 }</div>
  //                 <div><span class="descriptionRow">Color: </span>${
  //                   product.color === "null" ? "N/A" : product.color
  //                 }</div>
  //             </div>
  //         </div>
  //         </div>
  //     </div>
  // `;
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
      window.location = "/shoppingCart.html"
    } else {
      alert(data.message);
    }
  });
});


const loadEmblaCarousel = async () => {
  const addThumbBtnsClickHandlers = (emblaApiMain, emblaApiThumb) => {
    const slidesThumbs = emblaApiThumb.slideNodes()
  
    const scrollToIndex = slidesThumbs.map(
      (_, index) => () => {
        emblaApiMain.scrollTo(index)
      }
    )
  
    slidesThumbs.forEach((slideNode, index) => {
      slideNode.addEventListener('click', scrollToIndex[index], false)
    })
  
    return () => {
      slidesThumbs.forEach((slideNode, index) => {
        slideNode.removeEventListener('click', scrollToIndex[index], false)
      })
    }
  }
  
  const addToggleThumbBtnsActive = (emblaApiMain, emblaApiThumb) => {
    const slidesThumbs = emblaApiThumb.slideNodes()
  
    const toggleThumbBtnsState = () => {
      emblaApiThumb.scrollTo(emblaApiMain.selectedScrollSnap())
      const previous = emblaApiMain.previousScrollSnap()
      const selected = emblaApiMain.selectedScrollSnap()
      slidesThumbs[previous].classList.remove('embla-thumbs__slide--selected')
      slidesThumbs[selected].classList.add('embla-thumbs__slide--selected')
    }
  
    emblaApiMain.on('select', toggleThumbBtnsState)
    emblaApiThumb.on('init', toggleThumbBtnsState)
  
    return () => {
      const selected = emblaApiMain.selectedScrollSnap()
      slidesThumbs[selected].classList.remove('embla-thumbs__slide--selected')
    }
  }
  
  const OPTIONS = {}
  const OPTIONS_THUMBS = {
    containScroll: 'keepSnaps',
    dragFree: true
  }
  
  const viewportNodeMainCarousel = document.querySelector('.embla__viewport')
  const viewportNodeThumbCarousel = document.querySelector(
    '.embla-thumbs__viewport'
  )
  const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
  const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)
  
  const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
    emblaApiMain,
    emblaApiThumb
  )
  const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
    emblaApiMain,
    emblaApiThumb
  )
  
  emblaApiMain
    .on('destroy', removeThumbBtnsClickHandlers)
    .on('destroy', removeToggleThumbBtnsActive)
  
  emblaApiThumb
    .on('destroy', removeThumbBtnsClickHandlers)
    .on('destroy', removeToggleThumbBtnsActive)  
}