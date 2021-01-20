(function(){
    document.addEventListener('DOMContentLoaded',()=>{
        connectDB();
        form.addEventListener('submit',validate);
    });

    function validate(e){
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const job = document.querySelector('#job').value;

        if(name === '' || email === '' || phone === '' || job === ''){
            printAlert('All fields required','error');
            return;
        }

        const customer = {
            name,
            email,
            phone,
            job
        }
        customer.id = Date.now()

        createNewCustomer(customer);
    }

    function createNewCustomer(customer){
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.add(customer);

        transaction.onerror = function(){
            printAlert('There was an error','error');
        };
        transaction.oncomplete = function(){
            console.log('Added');
            printAlert('Added successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };
    }
})();