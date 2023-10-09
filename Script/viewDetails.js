window.addEventListener('DOMContentLoaded', async () => {
   
    const headers = {
        'Authorization': localStorage.getItem('token')
    }
    try {
        let res = await axios.get('http://localhost:4000/expense/add-expense', { headers })
        for (var i = 0; i < res.data.length; i++) {
            display(res.data[i]);
            console.log(res.data[i]);
        }
    } catch (err) {
        console.log(err);
    }
});

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
    const td5= document.createElement('td');

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



    //  setting id with the data id
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

    // EDIT BUTTON
    const editButton = document.createElement('input');
    editButton.type = 'button';
    editButton.value = 'Edit';
    editButton.className = 'btn btn-outline-primary m-lg-1 edit';
  

   
    // appending the child element
   // td5.appendChild(editButton);
    td5.appendChild(deleteButton);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tbody.appendChild(tr);

}