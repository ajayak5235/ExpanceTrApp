function checks(event){
    event.preventDefault()
    const password = document.getElementById('password').value;
    const uuidd = document.getElementsByName('uuidd')[0].value;

    const obj={
        password,
        uuidd
    }
    axios.post(`http://localhost:4000/password/resettingPassword`,obj)
        .then(res=>{
            console.log(res);
            alert('password changed successfully')
        }).catch(err=>{
            console.log(err,'error')
            alert('please fill all field correctly')
        })
}