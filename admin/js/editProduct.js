window.onload = async () => {

    await getUserProfile()

    async function getUserProfile() {
        const res = await fetch("/userinfo");
        const data = await res.json();
        const userInfo = data.userInfo;
        const userArea = document.querySelector(".userArea");

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
                console.log("ReG")
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

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const res = await fetch(`/editProduct?product=${productId}`)
    const result = await res.json()
    const images = result.images
    const product = result.product
    const priceResult = result.price
    const price = priceResult[0].product_price
    const quantityResult = result.quantity
    const quantity = quantityResult[0].product_quantity
    const colorResults = result.color
    const modelResults = result.model
    // console.log(product.product_option_id)
    const editProductDiv = document.getElementById('editProduct');
    const productInfoDiv = document.createElement('div')
    productInfoDiv.innerHTML = `
        <div class="productImage">
            <div class="productPicture" style="max-width: 10%; overflow: hidden;">
                <img src="${images[0].image_path}" style="width: 100%; height: auto;" />
            </div>
        </div>
        <div class="productName">
            <span class="infoFont"><h3>Product name:</h3></span>
            <span class="labelFont">${product.product_name}</span><br>
        </div>
        <div class="productType">
            <label for="firstType" class="firstType">
                <span class="infoFont"><h3>Product type:</h3></span>
                    <select id="firstType" name="firstType" disabled>
                        <option value="1" ${product.category_id == 1 ? "selected" : ""}>Phone Case</option>
                        <option value="2" ${product.category_id == 2 ? "selected" : ""}>Lens Protector</option>
                        <option value="3" ${product.category_id == 3 ? "selected" : ""}>Screen Protector</option>
                    </select>
            </label>
            <label for="secondType" class="secondType">
                    <select id="secondType" name="secondType" disabled>
                        <option value="1" ${product.sub_category_id == 1 ? "selected" : ""}>Own Brand</option>
                        <option value="2" ${product.sub_category_id == 2 ? "selected" : ""}>Third-party brand</option>
                        <option value="3" ${product.sub_category_id == 3 ? "selected" : ""}>Camera Guard</option>
                        <option value="4" ${product.sub_category_id == 4 ? "selected" : ""}>Lens Guard</option>
                        <option value="5" ${product.sub_category_id == 5 ? "selected" : ""}>AR</option>
                        <option value="6" ${product.sub_category_id == 6 ? "selected" : ""}>Privacy</option>
                        <option value="7" ${product.sub_category_id == 7 ? "selected" : ""}>Anti-Blue</option>
                        <option value="8" ${product.sub_category_id == 8 ? "selected" : ""}>AntiFingerprint</option>
                    </select>
            </label>
        </div>
        <div class="productPrice">
            <span class="infoFont"><h3>Product price:</h3></span>
            <span class="labelFont">$${price}</span>
        </div>
        <div class="productPrice">
            <span class="infoFont"><h3>Product quantity:</h3></span>
            <input type="text" id="quantityLabel" value="${quantity}">
        </div>
        <div class="productColor">
            <label for="productColor" class="productColor">
                <span class="infoFont"><h3>Color :</h3></span>
                    <select id="colorType" name="colorType">
                    </select>
            </label>
        </div>
        <div class="productModel">
            <label for="productModel" class="productModel">
                <span class="infoFont"><h3>Model:</h3></span>
                    <select id="productModel" name="productModel">
                    </select>
            </label>
        </div>
    `
    editProductDiv.appendChild(productInfoDiv)

    const quantityLabel = document.getElementById('quantityLabel')
    const colorTypeSelect = document.querySelector('#colorType')
    const modelSelect = document.querySelector('#productModel')
        const saveBtn = document.querySelector("#saveBtn")
    saveBtn.addEventListener('click', async function (e) {
        e.preventDefault()

        const body = {
            product_option_id: product.product_option_id,
            quantity: quantityLabel.value,
            color_id: colorTypeSelect.value,
            model_id: modelSelect.value
        }
        console.log(body)
        const res = await fetch('/saveEditProduct', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }
        )
        const data = await res.json()
        if (res.ok) {
            alert("Updated")
            window.location.reload();
        } else {
            alert(data.message)
        }
    })

    function colorType() {
        const colorTypeSelect = document.getElementById("colorType");
        colorResults.forEach(color => {
            const option = document.createElement("option");
            option.value = color.id
            option.textContent = color.name
            if (color.name === product.color_name) {
                option.selected = true
            }
            colorTypeSelect.appendChild(option)
        })
    }

    function modelType() {
        const productModelSelect = document.getElementById("productModel");
        modelResults.forEach(model => {
            const option = document.createElement("option");
            option.value = model.id
            option.textContent = model.name
            if (model.name === product.model_name) {
                option.selected = true
            }
            productModelSelect.appendChild(option)
        })
    }

    colorType()
    modelType()
}

