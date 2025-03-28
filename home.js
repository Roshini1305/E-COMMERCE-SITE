document.addEventListener('DOMContentLoaded',()=>{




let roundBtns = document.querySelectorAll('.round');
let ind = 0;
let timerId;
let loggedIn=localStorage.getItem('isLoggedIn');

if(loggedIn==="true"){
    showProfile();
}

roundBtns.forEach((button, index) => {
    button.addEventListener('click', () => {
        slideLeft(index);
        ind = index; // Only update ind here on click
        clearInterval(timerId); // Clear the timer on click
        timerId = setInterval(autoSlide, 5000); // restart the automatic slide again
    });
});

function slideLeft(i) {
    if (i < 0 || i >= roundBtns.length) return; // prevent from getting out of index
    roundBtns.forEach((button) => {
        button.classList.remove('active');
    });
    roundBtns[i].classList.add('active');
    let translateValue = -100 * i;
    document.querySelector('.Advertisement_banner_list').style.transform = `translateX(${translateValue}%)`;


}

function autoSlide() {
    ind++;
    if (ind >= roundBtns.length) {
        ind = 0;
    }
    slideLeft(ind);
}

timerId = setInterval(autoSlide, 5000);

let navBar = document.querySelector('.navigation-bar');
let offerText = document.querySelector('.offer-text');
let isNavBarFixed = false;
let navBarHeight = navBar.offsetHeight;

window.addEventListener('scroll',()=>{
    let scrollPosition = window.scrollY;
    let navBarPosition=navBar.getBoundingClientRect();

    if(navBarPosition.top<=0)
    {
        navBar.classList.add('fixed');
        isNavbarFixed=true;
        offerText.style.marginBottom=navBarHeight+'px';
    }
    else{
        navBar.classList.remove('fixed');
        isNavBarFixed=false;
        offerText.style.marginBottom='0';
    }

    if(scrollPosition<=55)
    {
        navBar.classList.remove('fixed');
        isNavBarFixed=false;
        offerText.style.marginBottom='0';
    }
    
});
});

function showProfile(){
    let profile_icon=document.querySelector('.profile-icon');
    let login_btn=document.querySelector('.login_btn');

    if(profile_icon.style.display === "none"){
        profile_icon.style.display="block";
        login_btn.style.display="none";
        console.log("1");
    }
    else{
        profile_icon.style.display="none";
        login_btn.style.display="block";
        console.log("2");
    }
}

function redirectToLogin()
{
    if(document.querySelector('.profile-icon').style.display==="block")
        localStorage.setItem('isLoggedIn',"false");
    window.location.href="/API/auth/login";
}

async function createUser(e)
{
    e.preventDefault();
    let userName = document.querySelector('#userName').value;
    let  email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

      let response =await fetch('/API/auth/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({userName,email,password}),
      });
      if(response.ok){
        
        localStorage.setItem('isLoggedIn','true');
        window.location.href="/";
        

      }
   
}
function goToRegisterPage(){
    window.location.href="/API/auth/register";
}
 async function loginValidation(e){
    e.preventDefault();
    let email= document.querySelector('#email').value;
    let password= document.querySelector('#password').value;
    const response = await fetch('/API/auth/login',{
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({email,password}),
            });
            const data=await response.json();
            console.log(data.result);
            if(response.ok){
                localStorage.setItem('UserID',data.result[0].UserID);
                localStorage.setItem('isLoggedIn','true');
                window.location.href="/";

            }
            }
async function openCart(){
    const userId=localStorage.getItem('UserID');
    const response=await fetch(`/API/cart/${userId}`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
    });

    const data=await response.json();

    localStorage.setItem("cartItems",JSON.stringify(data.result));
    
    console.log(localStorage.getItem('cartItems'));

    window.location.href='/API/cart/open';
}
    
function addToCart(button){
    let product=button.closest('.product');
    const productName=product.querySelector('.product-name').textContent;
    const ratings=product.querySelector('.rated-users').textContent;
    const price=product.querySelector('.price').textContent;
    const image=product.querySelector('.img').src;
    const productDetails={
        productName:productName,
        ratings:ratings,
        price:price,
        src:image,
        quantity:1,
    }
    updateCartDatabase(productDetails);
}

async function updateCartDatabase(productDetails){
    const response=await fetch('/API/cart/add',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({productDetails}),
    });
}

function addToCart(button){
    const product=button.closest('.product');
    const UserID=localStorage.getItem('UserID');
    const pid=product.dataset.productId;

    const cartItem={
        UserId:UserID,
        pid:pid,
        quantity:1,

    }
    updateCartDatabase(cartItem);
}
async function updateCartDatabase(cartItem){
    const response=await fetch('/API/cart/add',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({cartItem}),
    });
}