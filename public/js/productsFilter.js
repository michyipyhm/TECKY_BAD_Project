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
    getUserProfile();
    async function getUserProfile() {
      const res = await fetch("/userinfo");
      const data = await res.json();
      const userInfo = data.userInfo;
      const userArea = document.querySelector(".loginbox");
  
      if (res.ok && userInfo) {
        userArea.innerHTML = `
                  <div class="userInfo"><span class="userInfoFont">${userInfo.username}</span></div>
                  <div class="settingBtn"><a href="/profile.html"><span class="userInfoFont">Profile</span></a></div>
                  <div class="logout"><button type="button" id="logoutBtn" class="userInfoFont">Logout</button></div>
              `;
        const logoutEle = document.querySelector("#logoutBtn");
        if (logoutEle) {
          logoutEle.addEventListener("click", async () => {
            const res = await fetch("/logout", { method: "POST" });
            if (res.ok) {
              window.location.reload();
            } else {
              alert("Logout failed");
            }
          });
        }
      } else {
        bindAuthButtons();
      }
    }
  
    function bindAuthButtons() {
      const signupBtn = document.getElementById("signupBtn");
      const loginBtn = document.getElementById("loginBtn");
      const signUpOverlay = document.getElementById("signUpOverlay");
      const loginOverlay = document.getElementById("loginOverlay");
      const signUpCloseBtn = document.getElementById("signUpCloseBtn");
      const loginCloseBtn = document.getElementById("loginCloseBtn");
  
      if (signupBtn) {
        signupBtn.onclick = function () {
          signUpOverlay.style.display = "flex";
        };
      }
  
      if (loginBtn) {
        loginBtn.onclick = function () {
          loginOverlay.style.display = "flex";
        };
      }
  
      if (signUpCloseBtn) {
        signUpCloseBtn.onclick = function () {
          signUpOverlay.style.display = "none";
        };
      }
  
      if (loginCloseBtn) {
        loginCloseBtn.onclick = function () {
          loginOverlay.style.display = "none";
        };
      }
  
      const registerForm = document.querySelector("#registerForm");
      if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          console.log("ReG");
          const username = e.target.registerUsername.value;
          const password = e.target.registerPassword.value;
          const email = e.target.registerEmail.value;
  
          const body = { username, password, email };
          const res = await fetch("/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
  
          if (res.ok) {
            window.location.reload();
          } else {
            const data = await res.json();
            alert(data.message);
          }
        });
      }
  
      const loginForm = document.querySelector("#loginForm");
      if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
  
          const email = e.target.loginEmail.value;
          const password = e.target.loginPassword.value;
  
          const body = { email, password };
          const res = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
  
          if (res.ok) {
            window.location.reload();
          } else {
            const data = await res.json();
            alert(data.message);
          }
        });
      }
    }
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

    const res = await fetch(`/category/${categoryType}/subcategory`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      displaySubCategories(data);
    }
    
  };

  const displaySubCategories = (subCategories) => {
    console.log("productionFilter.js displaySubCategories start subCategories[" + JSON.stringify(subCategories) + "]");
    subCategoryTypeSelect.innerHTML = `<option value="all">Select Subcategory Type</option>`;
    subCategories.forEach((subCategory) => {
      subCategoryTypeSelect.innerHTML += `<option value="${subCategory.id}">${subCategory.category_name}</option>`;
    });
    document
      .querySelector("#subCategoryTypeSelect")
      .addEventListener("change", async () => {
        getAllProducts();
       
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

            window.location.href = `/productDetails.html?product=${id}`;
          });
        });
      });
    } else {
      alert(data.message);
    }
  };

  getAllProducts();
};
