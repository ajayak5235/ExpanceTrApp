
async function SignUpInfo(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    //  getting input from sign up page
    // const userEmail = event.target.userEmail.value;
    // const userPassword = event.target.userPassword.value;

    const signUp = {
        name,
        email,
        password
    }

    if (name === '' || email === '' || password === '') {
        confirm('Please Fill All fields');
    }

    // checking the condition

    try {
        let res = await axios.post('http://localhost:4000/user/signUp', signUp);
        console.log("Successfully added", res.data);
    } catch (err) {
        console.log('Error Occured during signing up');
    }
    event.target.name.value = '';
    event.target.email.value = '';
    event.target.password.value = '';
}

async function SignInInfo(event) {
    event.preventDefault();
    const userEmail = event.target.userEmail.value;
    const userPassword = event.target.userPassword.value;
    const signIn = {
        userEmail,
        userPassword
    }
    let display = document.getElementById('display');
    let li = document.createElement('li');

    try {
        let res = await axios.post('http://localhost:4000/user/signIn', signIn);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('ispremiumuser', res.data.ispremiumuser);
        console.log(res.data);
        window.location.href = './addXpense.html';
    } catch (err) {
        console.log(err, "USER DOES NOT EXISTS");
    }
}


var forgotPasswordButton = document.querySelector('#forgotPassword-Button');
forgotPasswordButton.addEventListener('click', () => {
    window.location.href = './forgotPassword.html';
})