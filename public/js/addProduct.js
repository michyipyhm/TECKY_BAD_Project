// function updateSecondType() {
//     const firstType = document.getElementById('firstType').value
//     const secondType = document.getElementById('secondType')
//     secondType.innerHTML = ''
//     let options = []
//     if (firstType === '1') {
//         options = [
//             { value: '1', text: 'Own Brand' },
//             { value: '2', text: 'Third-party brand' }
//         ]
//     } else if (firstType === '2') {
//         options = [
//             { value: '3', text: 'Camera Guard' },
//             { value: '4', text: 'Lens Guard' }
//         ]
//     } else if (firstType === '3') {
//         options = [
//             { value: '5', text: 'AR' },
//             { value: '6', text: 'Privacy' },
//             { value: '7', text: 'Anti-Blue' },
//             { value: '8', text: 'AntiFingerprint' }
//         ]
//     }
//     options.forEach(opt => {
//         secondType.innerHTML += `<option value="${opt.value}">${opt.text}</option>`
//     })
// }

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

    const res = await fetch("/addProductSelect");
    const data = await res.json();
    const products = data.products
    const color = data.color
    const model = data.model
    console.log(products)
    const addProductDiv = document.getElementById('addProduct');
    const productInfoDiv = document.createElement('div');
    productInfoDiv.innerHTML = `
        <div class="productName">
            <label for="productName" class="productName">
                <span class="infoFont">Select a Product:</span><br>
                <select id="productSelect" name="productSelect">
                </select>
            </label>
        </div>
        <div class="productType">
            <label for="firstType" class="firstType">
                <span class="infoFont">Product type:</span><br>
                <select id="firstType" name="firstType">
                    <option value="1">Phone Case</option>
                    <option value="2">Lens Protector</option>
                    <option value="3">Screen Protector</option>
                </select>
            </label>
            <label for="secondType" class="secondType">
                <select id="secondType" name="secondType">
                    <option value="1">Own Brand</option>
                    <option value="2">Third-party brand</option>
                    <option value="3">Camera Guard</option>
                    <option value="4">Lens Guard</option>
                    <option value="5">AR</option>
                    <option value="6">Privacy</option>
                    <option value="7">Anti-Blue</option>
                    <option value="8">AntiFingerprint</option>
                </select>
            </label>
        </div>
        <div class="productPrice">
            <span class="infoFont">Product price:</span><br>
            <input type="text" id="productPriceLabel" value="">
        </div>
        <div class="productPrice">
            <span class="infoFont">Product quantity:</span><br>
            <input type="text" id="productQuantityLabel" value="">
        </div>
        <div class="productColor">
            <label for="productColor" class="productColor">
                <span class="infoFont">Color :</span><br>
                <select id="colorType" name="colorType">
                </select>
            </label>
        </div>
        <div class="productModel">
            <label for="productModel" class="productModel">
                <span class="infoFont">Model:</span><br>
                <select id="productModel" name="productModel">
                </select>
            </label>
        </div>
    `;
    
    addProductDiv.appendChild(productInfoDiv);

    function productSelect() {
        const productNameSelect = document.getElementById("productSelect")
        products.forEach(product => {
            const option = document.createElement("option")
            option.value = product.id
            option.textContent = product.product_name
            productNameSelect.appendChild(option)
        })
    }


    // function colorType() {
    //     const colorTypeSelect = document.getElementById("colorType");
    //     colorResults.forEach(color => {
    //         const option = document.createElement("option");
    //         option.value = color.id
    //         option.textContent = color.name
    //         if (color.name === product.color_name) {
    //             option.selected = true
    //         }
    //         colorTypeSelect.appendChild(option)
    //     })
    // }

    // function modelType() {
    //     const productModelSelect = document.getElementById("productModel");
    //     modelResults.forEach(model => {
    //         const option = document.createElement("option");
    //         option.value = model.id
    //         option.textContent = model.name
    //         if (model.name === product.model_name) {
    //             option.selected = true
    //         }
    //         productModelSelect.appendChild(option)
    //     })
    // }

    // updateSecondType()
    // colorType()
    // modelType()
    productSelect()
}