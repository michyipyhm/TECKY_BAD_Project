window.onload = async () => {
    await getUserProfile();

    async function getUserProfile() {
        const res = await fetch("/userinfo");
        const data = await res.json();
        const userInfo = data.userInfo;
        const userArea = document.querySelector('.userArea');
        
        if (res.ok && userInfo) {
            userArea.innerHTML = `
                <div class="userInfo"><span class="userInfoFont">Welcome! ${userInfo.username}!</span></div>
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
                        alert('Logout failed');
                    }
                });
            }
        } else {
            bindAuthButtons();
        }
    }

    function bindAuthButtons() {
        const signupBtn = document.getElementById('signupBtn');
        const loginBtn = document.getElementById('loginBtn');
        const signUpOverlay = document.getElementById('signUpOverlay');
        const loginOverlay = document.getElementById('loginOverlay');
        const signUpCloseBtn = document.getElementById('signUpCloseBtn');
        const loginCloseBtn = document.getElementById('loginCloseBtn');
        
        if (signupBtn) {
            signupBtn.onclick = function () {
                signUpOverlay.style.display = 'flex';
            };
        }

        if (loginBtn) {
            loginBtn.onclick = function () {
                loginOverlay.style.display = 'flex';
            };
        }

        if (signUpCloseBtn) {
            signUpCloseBtn.onclick = function () {
                signUpOverlay.style.display = 'none';
            };
        }

        if (loginCloseBtn) {
            loginCloseBtn.onclick = function () {
                loginOverlay.style.display = 'none';
            };
        }

        const registerForm = document.querySelector("#registerForm");
        if (registerForm) {
            registerForm.addEventListener("submit", async (e) => {
                e.preventDefault();

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
    
};