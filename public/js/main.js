
let addCategoryButton = document.querySelector(".add-category")

let addTask = document.querySelector('.add-task-form')

let categorySelection = document.querySelector(".choose-category")
let select = document.querySelector("select")
let hiddenValue = document.querySelector(".category-input")
let btn = document.querySelector('.btn')

let deleteBtns = document.querySelectorAll('.delete-button')

let checkBoxes = document.querySelectorAll('[type=checkbox]')

let csrf  = document.querySelector('[name=_csrf]').value

let categoryToggle = document.querySelector(".category-toggle")

categoryToggle.addEventListener('click',function(){
    overlay.style.display = "block"
    document.querySelector('aside').classList.add('active')
})

addCategoryButton.addEventListener('click' , e=>{
    
    e.preventDefault()
    overlay.style.display = "block"

    let form = document.createElement('form')
    form.classList.add('pop-up-form')
    form.method = 'post'
    form.action = "/addCategory"
    
    let title = document.createElement('h2')
    title.textContent = "Add Category"

    let inputControl = document.createElement('div')
    inputControl.classList.add("form-control")

    let colorControl = document.createElement('div')
    colorControl.classList.add("form-control")


    let input = document.createElement('input')
    input.type = "text"
    input.placeholder = "Category name"
    input.name = "name"
    input.autocomplete = "off"


    let color = document.createElement('input')
    color.type = "color"
    color.value = '#' + Math.floor(Math.random()*16777215).toString(16)
    color.name = "color"

    let csrfInput = document.createElement('input')
    csrfInput.type = "hidden"
    csrfInput.value = csrf
    csrfInput.name = "_csrf"
    
    let colorLabel = document.createElement('label')
    colorLabel.for = color
    colorLabel.textContent = "pick color"
   
    let submit = document.createElement('button')
    submit.textContent = "Add"

    inputControl.append(input)
    
    colorControl.append(colorLabel)
    colorControl.append(color)

    form.append(title)
    form.append(csrfInput)
    form.append(inputControl)
    form.append(colorControl)
    form.append(submit)
    
    document.body.append(form)

})

overlay.addEventListener('click' , (e)=>{
    if (document.querySelector('.pop-up-form')){
        document.querySelector('.pop-up-form').style.display = 'none'
    }
    overlay.style.display = 'none';
    categorySelection.style.display = "none";
    let header = document.querySelector("header ul")
    header.classList.remove('active')
    document.querySelector('aside').classList.remove('active')
})

addTask.addEventListener('submit' , e =>{
    if (hiddenValue.value == ""){

        e.preventDefault()
        overlay.style.display = "block"
        categorySelection.style.display = "flex"
        
        btn.addEventListener('click' , function(){
            hiddenValue.value = select.value 
            e.target.submit()
        })
    }
})

deleteBtns.forEach(button =>{
    button.addEventListener('click',async function(e){
        e.preventDefault()
        let taskId = button.parentNode.querySelector("[name=taskId]").value
        
        let res = await fetch("/tasks/"+ taskId,{
            method:"delete",
            headers:{
                "csrf-token":csrf
            }
        })
        if (res.status == 200){
            button.parentElement.remove()
            window.location.href = '/tasks'
        } else{
            window.location.href = '/tasks'
        }
    } )
})

checkBoxes.forEach(box =>{
    box.addEventListener('change' ,async (e)=>{
        
        let taskName = box.parentNode.parentNode.querySelector('h3')
        let taskId = box.parentNode.parentNode.parentNode.querySelector("[name=taskId]").value
        if (box.checked){

            taskName.classList.add("completed")
            let res = await fetch("/tasks/"+taskId+"?completed="+"true")
            
            
        }else{
            let res = await fetch("/tasks/"+taskId+"?completed="+"false")
            taskName.classList.remove("completed")
        }
    })
})

