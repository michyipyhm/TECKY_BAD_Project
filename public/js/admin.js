window.onload = async () => {
    await getUserProfile()
    getAllItem()

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

    async function getAllItem() {
        const res = await fetch("/getallItem");
        const products = await res.json();
        // console.log(products)
        for (const product of products) {
            const productDiv = document.createElement('div');
            productDiv.classList.add('productDiv');
            productDiv.innerHTML = `
                    <div class="productId">${product.product_option_id}</div>
                    <div class="productName">${product.product_name}</div>
                    <div class="productModel">${product.model_name}</div>
                    <div class="productColor">${product.color_name !== "null" ? product.color_name : 'N/A'}</div>
                    <div class="productListBtn">
                        <button type="button" class="btn btn-outline-primary" class="detailsBtn" id="editProduct">Edit</button>
                        <button type="button" class="btn btn-outline-success" class="copyBtn" id="copyProduct">Copy</button>
                        <button type="button" class="btn btn-outline-danger" id="deleteProduct" name="deleteProduct">Delete</button>
                    </div>
            `;
            productList.appendChild(productDiv);
            // Delete
            const deleteProduct = productDiv.querySelector('#deleteProduct')
            deleteProduct.addEventListener("click", async (e) => {
                e.preventDefault()

                const id = product.product_option_id
                const body = {  
                    id: id
                }
                console.log("Delete item:", id)
                const res = await fetch("/adminDeleteItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                const data = await res.json()
                if (res.ok) {
                    alert(data.message);
                    location.reload();
                    return;
                }
            })
            //Copy
            const copyProduct = productDiv.querySelector('#copyProduct')
            copyProduct.addEventListener("click", async (e) => {
                e.preventDefault()

                const id = product.product_option_id
                const body = {  
                    id: id
                }
                console.log("copy item:", id)
                const res = await fetch("/adminCopyItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                const data = await res.json()
                if (res.ok) {
                    alert(data.message);
                    location.reload();
                    return;
                }
            })

            const editProduct = productDiv.querySelector('#editProduct')
            copyProduct.addEventListener("click", async (e) => {
                e.preventDefault()

                const id = product.product_option_id
                const body = {  
                    id: id
                }
                console.log("copy item:", id)
                const res = await fetch("/adminCopyItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                const data = await res.json()
                if (res.ok) {
                    alert(data.message);
                    location.reload();
                    return;
                }
            })
        }
    }
}

async function showTab(index) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content > div');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    tabs[index].classList.add('active');
    contents[index].classList.add('active');
}

