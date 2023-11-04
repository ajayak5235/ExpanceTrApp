async function saveUser(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const user = {
        name, email, password
    };

    try {
        const response = await axios.post("http://localhost:4000/user/signup", user);
        alert(response.data.message);
        window.location.href = "./login.html";
    } catch (err) {
        console.error(err);
        
    }
}



async function logInUser(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const user = {
        email, password
    };

    try {
        const response = await axios.post("http://localhost:4000/user/login", user);
        alert(response.data.message);
        console.log("user::::", response.data.userId);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        if (response.data.success) {
           
            window.location.href = "./expense.html";
        }
    } catch (err) {
        console.error(err);
    
    }
}
