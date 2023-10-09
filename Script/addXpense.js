
const Button = document.querySelector('.submitButton');

async function saveData(event) {
    event.preventDefault();
    const amount = event.target.amount.value;
    const desc = event.target.desc.value;
    const category = event.target.category.value;
    const token = localStorage.getItem('token');


    const expenseData = {
        amount,
        desc,
        category,
        token
    }
    console.log(Button.id);
    //  Adding en expense in databse from front end
    try {
        let res = await axios.post('http://localhost:4000/expense/add-expense', expenseData);
        display(res.data);
        if (document.getElementById('tbody-leaderboard').childElementCount != 0) {
            showLeaderBoard()
        }
    } catch (err) {
        console.log(err);
    }
    event.target.amount.value = '';
    event.target.desc.value = '';
    event.target.category.value = '';
}

// function to display data on screen
async function display(expenseData) {
    const { amount, desc, category, updatedAt } = expenseData;

    const dateTime = updatedAt;
    const date = dateTime.split('T')[0];

    const tbody = document.querySelector('#tbody');

    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');

    tr.className = 'table-dark ms-2';

    td1.textContent = date;
    td2.textContent = desc;
    td3.textContent = category;
    td4.textContent = amount;

    // li.textContent = amount + " : " + desc + " : " + category;

    //  DELETE BUTTON
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'Delete';
    deleteButton.className = 'btn btn-outline-danger  m-lg-1 delete';

    let id = expenseData.id;

    deleteButton.onclick = async () => {
        try {
            let res = await axios.post('http://localhost:4000/expense/delete-expense/', { id });
            console.log(res.data.msg, res.status);
        }
        catch (err) {
            console.log(err, 'ERROR OCCURED WHILE DELETING AN ITEM');
        }
        tbody.removeChild(tr);

    };


    td5.appendChild(deleteButton);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tbody.appendChild(tr);

}

// integration with razorpay

document.querySelector('#rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/premium/buypremium', { headers: { 'Authorization': token } });
    console.log('RESONSE TESTINGG ---------->>>>>>>>>>>>>>>>>>>>>>>>', response);
    var options = {
        "key": response.data.key_id, // Entering the key id which is generating from dashboard
        "order_id": response.data.order.id, // for one time payment
        "handler": async function (response) {
            await axios.post('http://localhost:4000/premium/updatingTransactionStatus', { order_id: options.order_id, payment_id: response.razorpay_payment_id }, { headers: { "Authorization": token } });
            document.getElementById('rzp-button1').style.visibility = 'hidden';
            document.getElementById('premium-result').style.display = 'block';
            document.getElementById('premium-result').textContent = 'VIP';

            // Making visible download button 
            let downlaodButton = document.getElementById('downloadFile');
            downlaodButton.classList.remove('disabled');

            downlaodButton.addEventListener('click', download);

            //  creating Button
            const leaderboard = document.createElement('button');
            leaderboard.textContent = 'LeaderBoard';
            leaderboard.className = 'btn btn-primary';
            leaderboard.addEventListener('click', showLeaderBoard);
            document.getElementById('parentButton').appendChild(leaderboard);
            localStorage.setItem('token', res.data.token);

            showurl()
        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response, 'TESTING RESPONSE IN XPENSE.JS LINE NO 123 ----------HUUUUUUUU');
        alert('TERE PAS PESA NAHI HAI -- ISILIYE ERROR AYA HAI -- KANGAAAAAAAAAL')
    })
}


window.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('ispremiumuser') == 'true') {
        document.getElementById('rzp-button1').style.display = 'none';
        document.getElementById('rzp-button1').textContent = '';

        let downlaodButton = document.getElementById('downloadFile');
        downlaodButton.classList.remove('disabled');

        downlaodButton.addEventListener('click', download);


        const leaderboard = document.createElement('button');
        leaderboard.textContent = 'LeaderBoard'
        leaderboard.className = 'btn btn-primary';

        leaderboard.addEventListener('click', showLeaderBoard)
        document.getElementById('parentButton').appendChild(leaderboard)

        showurl();
    }

    const headers = {
        'Authorization': localStorage.getItem('token')
    }
    try {
        let res = await axios.get('http://localhost:4000/expense/add-expense', { headers })
        for (var i = 0; i < res.data.length; i++) {
            display(res.data[i]);
        }
    } catch (err) {
        console.log(err);
    }
});



function table(a, b) {
    const LeaderBoardtable = document.getElementById('tableOfLeaderBoard');
    const titleofleaderboard = document.getElementById('titleofleaderboard');
    // making visible 
    LeaderBoardtable.style.display = "table";
    titleofleaderboard.style.display = "block";

    const LeaderbordRow = document.querySelector('#tbody-leaderboard');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');

    tr.className = 'table-dark';

    td1.textContent = a;
    td2.textContent = b;

    tr.appendChild(td1);
    tr.appendChild(td2);
    LeaderbordRow.appendChild(tr);
}
// show leader board to premium user only function
function showLeaderBoard() {
    axios.get('http://localhost:4000/premium/leaderBoard')
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
                table(res.data[i].name, res.data[i].totalExpense)
            }
            console.log(res);
        }).catch(err => console.log(err))
}

//  Sign out Functionality
document.addEventListener('DOMContentLoaded', () => {
    const LogOut = document.getElementById('signOut-button');
    LogOut.addEventListener('click', () => {
       
        window.location.href = '../signin.html';
    })
})

function download() {
    const headers = {
        'Authorization': localStorage.getItem('token')
    };
    
    
    axios.get('http://localhost:4000/expense/download', { headers })
        .then((res) => {
            
            if (res.status === 200) {
                
                var a = document.createElement('a');
                a.href = res.data.fileurl;
              
                a.click();
            } else {
                throw new Error(res.data.message)
            }
        }).catch(err => console.log(err));
    
    

}
function showurl() {
    const urlList = document.getElementById('downloadeurl');
    while (urlList.firstChild) {
        urlList.removeChild(urlList.firstChild);
    }

    urlList.innerHTML = `<h5>list of url </h5>`
    const headers = {
        'Authorization': localStorage.getItem('token'),
    };
    //console.log('IS SHOW URL WORKING R NOT');

    axios.get("http://localhost:4000/expense/download/allurl", { headers })
        .then((res) => {
            console.log(res, 'haiiiiiiiiiiiii');
            if (res.status === 200) {
                for (let i = 0; i < res.data.length; i++) {
                    console.log(res.data, 'TESTING DATA')
                    let a = document.createElement('a');
                    a.href = res.data[i].url;
                    a.textContent = `expense data downloaded in ${res.data[i].date},click again to download`
                    urlList.appendChild(a);
                    const br = document.createElement('br')
                    urlList.appendChild(br)
                }

            } else {
                throw new Error(res.data.message)
            }
        }).catch(err => console.log(err))
}
