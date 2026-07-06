const form = document.getElementById("form");
const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const search = document.getElementById("search");
const filter = document.getElementById("filter");
const monthFilter = document.getElementById("monthFilter");

const submitBtn = document.getElementById("submitBtn");

let editId = null;

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

function save(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

function update(){

    list.innerHTML="";

    let totalIncome=0;
    let totalExpense=0;

    const keyword=search.value.toLowerCase();

    const filtered = transactions.filter(item => {

        const matchesSearch =
            item.text.toLowerCase().includes(keyword);

        const matchesType =
            filter.value === "all" ||
            item.type === filter.value;

        let matchesMonth = true;

        if (monthFilter.value !== "all") {

            const month = new Date(item.date).getMonth();

            matchesMonth = month == monthFilter.value;

        }

        return matchesSearch &&
           matchesType &&
           matchesMonth;

    });
    filtered.forEach(item=>{

        const li=document.createElement("li");

        li.innerHTML=`

        <div class="left">

            <strong>${item.text}</strong>

            <small>${item.type.toUpperCase()}</small>

            <small>${item.date}</small>

        </div>

        <div class="right">

            <span class="amount ${item.type==="income" ? "incomeText":"expenseText"}">

                ${item.type==="income" ? "+" : "-"}₦${Number(item.amount).toLocaleString()}

            </span>

            <button
            class="edit"
            onclick="editTransaction(${item.id})">

            Edit

            </button>

            <button
            class="delete"
            onclick="removeTransaction(${item.id})">

            Delete

            </button>

        </div>

        `;

        list.appendChild(li);

    });

    filtered.forEach(item => {

        if(item.type === "income"){

            totalIncome += Number(item.amount);

        }else{

            totalExpense += Number(item.amount);

        }

    });
    income.textContent=
    "₦"+totalIncome.toLocaleString();

    expense.textContent=
    "₦"+totalExpense.toLocaleString();

    balance.textContent=
    "₦"+(totalIncome-totalExpense).toLocaleString();

    save();

}

form.addEventListener("submit",function(e){

    e.preventDefault();

    const text=document.getElementById("text").value.trim();

    const amount=document.getElementById("amount").value;

    const type=document.getElementById("type").value;

    const date=document.getElementById("date").value;

    if(editId!==null){

        const index=
        transactions.findIndex(item=>item.id===editId);

        transactions[index]={

            ...transactions[index],

            text,
            amount,
            type,
            date

        };

        editId=null;

        submitBtn.textContent="Add Transaction";

    }else{

        transactions.push({

            id:Date.now(),

            text,
            amount,
            type,
            date

        });

    }

    form.reset();

    update();

});

function removeTransaction(id){

    transactions=
    transactions.filter(item=>item.id!==id);

    update();

}

function editTransaction(id){

    const transaction=
    transactions.find(item=>item.id===id);

    document.getElementById("text").value=
    transaction.text;

    document.getElementById("amount").value=
    transaction.amount;

    document.getElementById("type").value=
    transaction.type;

    document.getElementById("date").value=
    transaction.date;

    editId=id;

    submitBtn.textContent="Update Transaction";

}

search.addEventListener("input",update);

filter.addEventListener("change",update);

monthFilter.addEventListener("change",update);

update();