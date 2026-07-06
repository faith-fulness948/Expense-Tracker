const form = document.getElementById("form");
const list = document.getElementById("list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const search = document.getElementById("search");
const filter = document.getElementById("filter");
const monthFilter = document.getElementById("monthFilter");
const yearFilter = document.getElementById("yearFilter");

const submitBtn = document.getElementById("submitBtn");

let editId = null;

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

function loadYears(){

    const years = [...new Set(
        transactions.map(item =>
            new Date(item.date).getFullYear()
        )
    )];

    years.sort((a,b)=>a-b);

    yearFilter.innerHTML =
    `<option value="all">All Years</option>`;

    years.forEach(year=>{

        yearFilter.innerHTML +=
        `<option value="${year}">${year}</option>`;

    });

}

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

    const filtered = transactions.filter(item=>{

        const matchesSearch =
        item.text.toLowerCase().includes(keyword);

        const matchesType =
        filter.value==="all" ||
        item.type===filter.value;

        const date = new Date(item.date);

        const transactionMonth = date.getMonth();

        const transactionYear = date.getFullYear();

        const matchesMonth =
            monthFilter.value==="all" ||
            transactionMonth == monthFilter.value;

        const matchesYear =
            yearFilter.value==="all" ||
            transactionYear == yearFilter.value;

        return matchesSearch &&
           matchesType &&
           matchesMonth &&
           matchesYear;

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

    loadYears()

    update();

});

function removeTransaction(id){

    transactions=
    transactions.filter(item=>item.id!==id);

    loadYears()

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

yearFilter.addEventListener("change", update);

loadYears()

update();