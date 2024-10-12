const categoryTypeSelect = document.getElementById("category_type");
const subCategoryTypeSelect = document.getElementById("subCategoryTypeSelect");
const decOrderBtn = document.querySelector("#price-dec");
const ascOrderBtn = document.querySelector("#price-asc");
const sortingInput = document.querySelector("#sorting");

window.onload = async () => {
  categoryTypeSelect.addEventListener("change", () => {
    subCategoryTypeSelect.value = "all";
    getSubCategory();
    getAllProducts();
  });

  decOrderBtn.addEventListener("click", () => {
    sortingInput.value = "desc";
    getAllProducts();
  });
  ascOrderBtn.addEventListener("click", () => {
    sortingInput.value = "asc";
    getAllProducts();
  });

  const getSubCategory = async () => {
    console.log("productionFilter.js getSubCategory start");
    const searching = [];
    const categoryType = categoryTypeSelect.value;
    const subCategoryType = subCategoryTypeSelect.value;
    if (subCategoryType.subCategoryType) {
      searching.push(subCategoryType);
    }

    console.log(
      "productionFilter.js getSubCategory start categoryType[" +
        categoryType +
        "]"
    );

    const res = await fetch(`/category/${categoryType}/subcategory`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      displaySubCategories(data);
    }
    console.log("productionFilter.js getSubCategory end");
  };

  const displaySubCategories = (subCategories) => {
    console.log("productionFilter.js displaySubCategories start subCategories[" + JSON.stringify(subCategories) + "]");
    subCategoryTypeSelect.innerHTML = `<option value="all">全部</option>`;
    subCategories.forEach((subCategory) => {
      subCategoryTypeSelect.innerHTML += `<option value="${subCategory.id}">${subCategory.category_name}</option>`;
    });
    document
      .querySelector("#subCategoryTypeSelect")
      .addEventListener("change", async () => {
        getAllProducts();
        // document.querySelector(`#products-container`).innerHTML = "";
        // for (let i = 0; i < searching.length; i++) {
        //   let imagePath = searching[i].image_path;
        //   let productId = searching[i].product_id;
        //   let quantity = searching[i].product_quantity;
        //   let productName = searching[i].product_name;
        //   let price = searching[i].product_price;

        //   let quantityText = "";
        //   let quantityClass = "";

        //   if (quantity > 1) {
        //     quantityText = "In stock";
        //     quantityClass = "quantity-green";
        //   } else if (quantity <= 0) {
        //     quantityText = "Out of stock";
        //     quantityClass = "quantity-gray";
        //   } else if (quantity === 1) {
        //     quantityText = `Still ${quantity} left`;
        //     quantityClass = "quantity-red";
        //   }
        //   document.querySelector(`#products-container`).innerHTML += `
        //   <div class="col">
        //     <div class="card" id="card1">
        //       <img src="${imagePath}" class="gallery-item" data-id="${productId}" alt="gallery" />
        //       <div class="card-body">
        //         <div class="producy-idDiv">BAD-<span class="product-id">${productId}</span>
        //           &nbsp;<span class="quantity ${quantityClass}">${quantityText}</span>
        //           </div>
        //         <div class="product-name">${productName}</div>
                
        //         <a href="#" class="btn btn-light">$${price}</a>
        //       </div>
        //     </div>
        //   </div>`;
        // }

        // document.querySelectorAll(".card").forEach((cardDiv) => {
        //   const checkProductDetails = cardDiv.querySelectorAll(".gallery-item");
        //   checkProductDetails.forEach((button) => {
        //     button.addEventListener("click", async (e) => {
        //       e.preventDefault();
        //       const id = button.dataset.id;

        //       window.location.href = `/productdetails.html?product=${id}`;
        //     });
        //   });
        // });
      });

    console.log("productionFilter.js displaySubCategories start");
  };

  const getAllProducts = async () => {
    const searching = [];
    const sorting = { sorting: sortingInput.value };
    const categoryType = { categoryType: categoryTypeSelect.value };
    const subCategoryType = { subCategoryType: subCategoryTypeSelect.value };

    if (categoryType.categoryType) {
      searching.push(categoryType);
    }

    if (subCategoryType.subCategoryType && subCategoryType.subCategoryType !== "all") {
      searching.push(subCategoryType);
    }

    if (sorting.sorting) {
      searching.push(sorting);
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
    // console.log(query);

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

            window.location.href = `/productdetails.html?product=${id}`;
          });
        });
      });
    } else {
      alert(data.message);
    }
  };

  getAllProducts();
};
