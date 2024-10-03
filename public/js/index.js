<<<<<<< HEAD
window.onload = () => {
    const signupBtn = document.getElementById('signupBtn');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');

    signupBtn.onclick = function () {
        overlay.style.display = 'flex';
    };

    closeBtn.onclick = function () {
        overlay.style.display = 'none';
    };
=======
window.onload = async () => {
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const signUpOverlay = document.getElementById('signUpOverlay');
    const loginOverlay = document.getElementById('loginOverlay');
    const signUpCloseBtn = document.getElementById('signUpCloseBtn');
    const loginCloseBtn = document.getElementById('loginCloseBtn');

    signupBtn.onclick = function () { signUpOverlay.style.display = 'flex' };
    loginBtn.onclick = function () { loginOverlay.style.display = 'flex' };

    signUpCloseBtn.onclick = function () { signUpOverlay.style.display = 'none' };
    loginCloseBtn.onclick = function () { loginOverlay.style.display = 'none' };
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a

    const registerEle = document.querySelector("#registerForm")
    registerEle.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = e.target.username.value
        const password = e.target.password.value
        const email = e.target.email.value

        const body = {
            username,
            password,
            email
        }
<<<<<<< HEAD
        console.log(body)
=======
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a
        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (res.ok) {
<<<<<<< HEAD
            window.location.href = "/login.html"
            alert("Register successful")
        } else {
            alert(data.message)
        }

        document.getElementById('registerForm').reset();
        overlay.style.display = 'none';
    })
=======
            window.location.reload();
        } else {
            alert(data.message)
        }
    })

    const loginEle = document.querySelector("#loginForm")
    loginEle.addEventListener("submit", async (e) => {
        e.preventDefault()

        const email = e.target.email.value
        const password = e.target.password.value

        const body = {
            email: email,
            password: password
        }
        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await res.json()
        if (res.ok) {
            window.location.reload();
        } else {
            alert(data.message)
        }
    })
    await getUserProfile();
    async function getUserProfile() {
        const res = await fetch("/userinfo");
        const data = await res.json();
        const userIfo = data.userInfo


        if (res.ok) {
            const userArea = document.querySelector('.userArea');
            userArea.innerHTML = `
            <div class="userInfo"><span class="userInfoFont">Welcome! ${userIfo.username}!</span></div>
            <div class="settingBtn" href="/profile.html"><a href="/profile.html"><span class="userInfoFont">Setting</span></a></div>
            <div class="logoutBtn"><a href="/index.html"><span class="userInfoFont">Logout</span></a></div>
            `;
        }
    }
>>>>>>> 02c7deddcc8920aa8e45dd40a4a1bdca53e5bc9a
}