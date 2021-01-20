(function(){
    let customerID;
    const nameInput = document.querySelector('#name');
    const phoneInput = document.querySelector('#phone');
    const jobInput = document.querySelector('#job');
    const emailInput = document.querySelector('#email');
    const form = document.querySelector('#form');

    document.addEventListener('DOMContentLoaded', ()=>{
        connectDB();

        form.addEventListener('submit',updateCustomer);

        const urlParameters = new URLSearchParams(window.location.search);
        customerID = urlParameters.get('id');
        
        if(customerID){
            setTimeout(() => {
                getCustomer(customerID);
            }, 100);
        }

        function updateCustomer(e){
            e.preventDefault();
            if(nameInput.value === '' || phoneInput.value === '' || jobInput.value === '' || jobInput.value === ''){
                printAlert('All Fields Required','error');
                return;
            }

            const updatedCustomer = {
                name : nameInput.value,
                phone : phoneInput.value,
                email : emailInput.value,
                job : jobInput.value,
                id : Number(customerID)
            }
            const transaction = DB.transaction(['crm'],'readwrite');
            const objectStore = transaction.objectStore('crm');
            objectStore.put(updatedCustomer);
            transaction.oncomplete = function(){
                printAlert('Updated correctly');
                setTimeout(() => {
                    window.location.href = 'index.html'
                }, 3000);
            }
            transaction.onerror = function(){
                printAlert('There was an error','error');
            }
        }

        function getCustomer(id){
            const transaction = DB.transaction(['crm'],'readonly');
            const objectStore = transaction.objectStore('crm');
            
            const customer = objectStore.openCursor();
            customer.onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    if(cursor.value.id === Number(id)){
                        fillForm(cursor.value);
                    };
                cursor.continue();
                }
            }
        }

        function fillForm(customerData){
            const {name,phone,email,job} = customerData;
            nameInput.value = name;
            phoneInput.value = phone;
            emailInput.value = email;
            jobInput.value = job;
        }

        function connectDB(){
            const openConnection = window.indexedDB.open('crm',1);

            openConnection.onerror = function(){
                console.log('Error');
            };
            openConnection.onsuccess = function(){
                DB = openConnection.result;
            };
        };
    });
})();