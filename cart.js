document.addEventListener('DOMContentLoaded',()=>{
    updateCart();

})


function updateQuantity(button)
{
    let quantity=button.parentElement.querySelector('.quantity');
    if(button.classList.contains('decrement') && parseInt( quantity.textContent)>1)
    {
        quantity.textContent = parseInt(quantity.textContent) - 1;
    }
    else if(button.classList.contains('increment'))
    {
         quantity.textContent = parseInt(quantity.textContent) +1;
    }

    let productId=button.closest('.product').dataset.productId;
    let userId=localStorage.getItem('UserID');
    let quantityValue=parseInt(quantity.textContent);
    let products=localStorage.getItem('cartItems');
    products.JSON.parse(products);

    let index=products.findIndex(item=> item.productId==productId);

    if(index!=-1){
        products[index].quantity=quantityValue;
    }
    localStorage.setItem('cartItems',JSON.stringify(products));

    updateQuantityInDatabase(userId,productId,quantityValue);
}

async function updateQuantityInDatabase(userId,productId,quantityValue){
    const response=await fetch('/API/cart/quantity',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({userId,productId,quantityValue}),
});
}

function removeProduct(button) 
{
    let productList = document.querySelector('.cart-products-list');
    let product = button.closest('.product');
    let pid = product.dataset.productId;
    let userId=localStorage.getItem('UserId');
    productList.removeChild(product);
    let products=localStorage.getItem('cartItems');
    products=JSON.parse(products);

    products=products.filter(item=>item.productId!=pid);
    localStorage.setItem('cartItems',JSON.stringify(products));
    removeFromDataBase(userId,pid);
}

async function removeFromDataBase(userId,pid) {
    const response=await fetch('/API/cart/remove',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({userId,pid}),
    });
}

function updateCart(){
    let cartItems=localStorage.getItem('cartItems');
    let products=JSON.parse(cartItems);
    let productsList=document.querySelector('.cart-products-list');
    productsList.innerHTML='';

    products.forEach((item)=>{
        let product=document.createElement('div');
        product.className="product";
        product.dataset.productId=item.productId;

        product.innerHTML=`
        <div class="image">
                    <img src=${item.src}
                        class="img-1 img">
                </div>

                <div class="product-info">
                    <div class="general-info">
                        <div class="product-name">${item.productName}</div>
                        <div class="ratings">
                            <div class="stars">
                                <img src="/icons/rating.jpg"
                                    class="star">
                                <img src="/icons/rating.jpg"
                                    class="star">
                                <img src="/icons/rating.jpg"
                                    class="star">
                                <img src="/icons/rating.jpg"
                                    class="star">
                                <img src="/icons/rating.jpg"
                                    class="star">
                            </div>
                            <div class="rated-users">(${item.ratings} <i class="fa-solid fa-user">)</i></div>
                        </div>
                        <div class="price">MRP: &#8377; ${item.price}</div>
                        <div class="quantity">
                            <button class="decrement" onclick="updateQuantity(this)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increment" onclick="updateQuantity(this)">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeProduct(this)">Remove</button>
                </div>
        `;
        productsList.appendChild(product);
    });
}