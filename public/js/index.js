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
        console.log(body)
        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (res.ok) {
            window.location.href = "/login.html"
            alert("Register successful")
        } else {
            alert(data.message)
        }

        document.getElementById('registerForm').reset();
        overlay.style.display = 'none';
    })
}