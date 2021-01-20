
let DB;
const form = document.querySelector('#form');

function connectDB(){
    const openConnection = window.indexedDB.open('crm',1);

    openConnection.onerror = function(){
        console.log('Error');
    };
    openConnection.onsuccess = function(){
        DB = openConnection.result;
    };
}

function printAlert(msg,type){
    const warning = document.querySelector('.warning');

    if(!warning){
        const divAlert = document.createElement('div');
        divAlert.classList.add('px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','border','warning');

        if(type === 'error'){
            divAlert.classList.add('bg-red-100','border-red-400','text-red-700');
        } else {
            divAlert.classList.add('bg-green-100','border-green-400','text-green-700');            
        }

        divAlert.textContent = msg;

        form.appendChild(divAlert);

        setTimeout( ()=>{ divAlert.remove() },3000);
    }

}