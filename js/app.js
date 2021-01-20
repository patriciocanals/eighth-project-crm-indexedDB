(function(){
    const customersList = document.querySelector('#customers-list');
    document.addEventListener('DOMContentLoaded', ()=>{
        createDB();

        if (window.indexedDB.open('crm',1)) {
            obtainCustomers();
        }

        customersList.addEventListener('click',deleteReg);
    });

    function deleteReg(e){
        if(e.target.classList.contains('delete')){
            const deleteID = Number(e.target.dataset.customer);
            const confirmation = confirm('Do you want to delete this customer?');
            
            if(confirmation){
                const transaction = DB.transaction(['crm'],'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(deleteID);

                transaction.oncomplete = function(){
                    console.log('Deleting...');
                    e.target.parentElement.parentElement.remove();
                };
                transaction.onsuccess = function(){
                    console.log('There was an error.');
                };
            }
        }
    }
    
    function createDB(){
        const createDB = window.indexedDB.open('crm',1);
        createDB.onerror = function(){
            console.log('There was an error creating DB');
        };
        createDB.onsuccess = function(){
            DB = createDB.result;
        };
        createDB.onupgradeneeded = function(e){
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm',{keyPath:'id', autoIncrement:true});
            objectStore.createIndex('name','name',{unique:false});
            objectStore.createIndex('email','email',{unique:true});
            objectStore.createIndex('phone','phone',{unique:false});
            objectStore.createIndex('job','job',{unique:false});
            objectStore.createIndex('id','id',{unique:true});

            console.log('DB ready');
        }

    }

    function obtainCustomers(){
        const openConection = window.indexedDB.open('crm',1);
        openConection.onerror = function(){
            console.log('There was an error');
        };
        openConection.onsuccess = function(){
            DB = openConection.result;

            const objectStore = DB.transaction('crm').objectStore('crm');
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {name,phone,email,id,job} = cursor.value;

                    customersList.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${phone}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${job}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="edit-customer.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                                <a href="#" data-customer="${id}" class="text-red-600 hover:text-red-900 delete">Delete</a>
                            </td>
                        </tr>
                        `; 
                    cursor.continue();
                } else {
                    console.log('There is no more regs');
                };
            };
        };
    }
})();