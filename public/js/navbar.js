let overlay = document.querySelector('.offset')
let burgerIcon = document.querySelector(".burger-icon");

// burgerIcon toggling
burgerIcon.addEventListener('click',function(){
    console.log('sdsd')
    let header = document.querySelector("header ul")
    header.classList.add('active')
    overlay.style.display = "block"
})
// Category Toggle

overlay.addEventListener('click' , (e)=>{
    if (document.querySelector('.pop-up-form')){
        document.querySelector('.pop-up-form').style.display = 'none'
    }
    overlay.style.display = 'none';
    let header = document.querySelector("header ul")
    header.classList.remove('active')
})
