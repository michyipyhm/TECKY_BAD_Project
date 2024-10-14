window.onload = async () => {
  await getUserProfile();
  await replicateAi();
  await chatBoxToggle();
  await getproductBySubCategory();

  async function getUserProfile() {
    const res = await fetch("/userinfo");
    const data = await res.json();
    const userInfo = data.userInfo;
    const userArea = document.querySelector(".userArea");

    if (res.ok && userInfo) {
      userArea.innerHTML = `
                <div class="profilebox">
               
                <div id="profileBox" >
                <a href="/profile.html" class="btn btn-outline-light">Profile</a>
                </div>
                <div id="logoutBox">
                <button type="button" id="logoutBtn" class="btn btn-outline-light">Logout</button>
                </div>
                </div>
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

  async function replicateAi() {
    const promptForm = document.querySelector("#promptForm");
    const addToCartBtn = document.querySelector("#addToCartBtn");
    let generatedProductData = null;

    promptForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const prompt = e.target.prompt.value;
      const phoneModel = e.target.phoneModel.value;
      const resultDiv = document.querySelector("#result");

      resultDiv.innerHTML = "Generating image...";
      addToCartBtn.disabled = true;

      const body = {
        prompt: prompt,
        phoneModel: phoneModel,
      };

      try {
        const res = await fetch("/replicateAI", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        console.log("Response data:", data);

        if (res.ok) {
          const imageUrl = data.data;
          console.log("Image URL:", imageUrl);

          resultDiv.innerHTML = `
          <h2>Generated Image:</h2>
          <img src="/uploads/${imageUrl}" alt="Generated image">
        `;
          generatedProductData = data;

          console.log("Generated product data:", generatedProductData);
          addToCartBtn.disabled = false;
        } else {
          resultDiv.innerHTML = `Error: ${
            data.message || "Unknown error occurred"
          }`;
        }
      } catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = "An error occurred while generating the image.";
      }
    });

    addToCartBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!generatedProductData) {
        alert("Please generate an image first");
        return;
      }

      const body = {
        name: generatedProductData.productName,
        product_option_id: generatedProductData.productOptionId,
      };

      try {
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
          window.location = "/index.html";
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to cart");
      }
    });
  }

  function chatBoxToggle() {
    const chatWindow = document.getElementById("chatBox");
    const toggleBtn = document.getElementById("chatToggleBtn");

    toggleBtn.addEventListener("click", () => {
      if (
        chatWindow.style.display === "none" ||
        chatWindow.style.display === ""
      ) {
        chatWindow.style.display = "block";
        loadChatMessages();
      } else {
        chatWindow.style.display = "none";
      }
    });
  }

  async function loadChatMessages() {
    const res = await fetch("/readMessage");
    const data = await res.json();
    const results = data.userMessage;
    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML = "";

    for (const result of results) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "chatBoxMessage";
      messageDiv.innerHTML = `
      <div class="chatMsg">
        <div class="responseMsg">${result.response_message}</div>
        <div class="userMsg">${result.user_message}</div>
      </div>
      `;
      chatBody.appendChild(messageDiv);
    }
  }

  document.getElementById("sendBtn").addEventListener("click", async function () {
      const chatInputElem = document.getElementById("chatInput");
      const chatInput = chatInputElem.value;
      const body = { question: chatInput };

      const res = await fetch("/aiBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        loadChatMessages();
        chatInputElem.value = "";
        const chatBody = document.getElementById("chatBody");
        chatBody.scrollTop = chatBody.scrollHeight;
      } else {
        const data = await res.json();
        alert(data.message);
      }
    })

  document
    .getElementById("createNewChatBtn")
    .addEventListener("click", async function () {
      const res = await fetch("/createNewChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        loadChatMessages();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    });
};

const getproductBySubCategory = async () => {


  const res = await fetch(`/index`, {
    method: "GET",
  });
  const data = await res.json();
  console.log("321-data", data);
  if (res.ok) {
    document.querySelector(`#products-container`).innerHTML = "";
    let displayedCount = 0;
    for (let i = 0; i < data.length && displayedCount < 6; i++) {
      let imagePath = data[i].image_path;
      let productId = data[i].product_id;
      let subCategoryName = data[i].sub_category_name;
      if (subCategoryName === "Own Brand") {
      console.log("328-imagePath", imagePath);
      console.log("329-productId", productId);

      document.querySelector(`#products-container`).innerHTML += `
    <div class="col">
      <div class="card" id="card1">
        <img src="${imagePath}" class="gallery-item" data-id="${productId}" alt="gallery" />
        <div class="card-body">
            </div>
          <div class="cards">
          <a href="#" class="btn btn-light" data-id="${productId}">Details</a>
          </div>
        </div>
      </div>
    </div>`;
    displayedCount++;
    }
  }
    document.querySelectorAll(".cards").forEach((cardDiv) => {
      const checkProductDetails = cardDiv.querySelectorAll(".btn");
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