window.onload = () => {
    const registerEle = document.querySelector("#register-form")
    registerEle.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = e.target.username.value
        const password = e.target.password.value
        const phone = e.target.phone.value
        const address = e.target.address.value
        const email = e.target.email.value
        
        const body = {
            username,
            password,
            phone,
            address,
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
    })
}

function login() {
    window.location.href = "/login.html"
}