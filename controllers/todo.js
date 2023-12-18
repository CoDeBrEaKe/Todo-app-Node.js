
const Task = require('../models/task')
const Category = require('../models/category')
const tasksPerPage = 3
exports.getHome = (req, res, next)=>{
    res.render("index",
    {
        isAuth:req.session.isAuth
    })
}

exports.getTasks =  async(req, res, next)=>
{
    const page = +req.query.page || 1;
    
    let categoryName = req.query.category || "";
    
    let totalItems ;
    Task.find().countDocuments().then(tasksCount =>{
        totalItems = tasksCount
        Task.find({userId:req.user._id}).skip(tasksPerPage* (page-1)).limit(tasksPerPage).populate('categoryId').sort({"dateOfCreation":-1}).then(tasks=>{
        
            Category.find({userId : req.user._id }).then(categories=>{
                
                if (categoryName){   
                    tasks = tasks.filter(task => task.categoryId? task.categoryId.name == categoryName : null)
                }
                return res.render('todo/tasks' , {
                    path:categoryName,
                    tasks:tasks,
                    user:req.user,
                    categories:categories,
                    totalItems: totalItems,
                    hasNextPage: page * tasksPerPage < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage:page + 1,
                    previousPage : page -1,
                    page:page
                })
            })
    })
})  
} 
exports.createTask = (req , res, next)=>{

    const title = req.body.title;
    const categoryId = req.body.categoryId
    let task;
    
    if (categoryId)
    {
        task = new Task({
            title:title,
            userId:req.user._id,
            categoryId:categoryId
        })
    }else{
        task = new Task({
             title:title,
             userId:req.user._id,
         })
    }
    task.save().then(result=>{
        res.status(200)
        res.redirect("/tasks")
    })
}

exports.updateTask = (req,res,next)=>{

    if (!req.session.isAuth){
        res.redirect("/")
    }

    let taskId = req.params.taskId
    let completed = req.query.completed
    Task.findById(taskId).then(task=>{
        task.completed = completed
        task.save()
        res.status(200)
        res.json({message:"done"})
    })
}

exports.deleteTask = (req,res,next)=>{
    let taskId = req.params.taskId
    Task.deleteOne({_id : taskId}).then(result=>{
        res.status(200)
        res.json({message:'Done'})
        
    })

}

// Category methods
exports.getCategories = async (req, res, next)=>{
    
    // await Task.find().then(tasks=>{
    //     res.render('todo/tasks' , {
    //         tasks:tasks,
    //         isAuth : req.session.isAuth
    //     })
    // })
} 

exports.createCategory = async(req , res, next)=>{
    // console.log("wasl ya basha")
    const name = req.body.name
    const color = req.body.color

    const category = new Category({
        name:name,
        color:color,
        userId:req.user._id
    })
    await category.save()
    res.status(200)
    res.redirect("/tasks")
}

exports.deleteCategory = (req , res , next)=>{
    
    const categoryId = req.params.categoryId

    Category.deleteOne({_id:categoryId}).then(result=>{
        res.status(200)
        return res.redirect('/tasks')
    })
}