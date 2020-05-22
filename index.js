const express=require("express");
const app=express();
const port=8000;
const path=require("path");
const db=require("./config/mongoose");
const Todo=require("./models/todo");
const dateFormat=require("dateformat");
const windowAlert=require("js-alert");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded());
app.use(express.static("assets"))

//TODO object



// var todo = [
//     {
//         description : "null",
//         category : "null",
//         dueDate: "null"
//     },
// ];

//HOME Route
app.get("/",function(req,res){

    Todo.find({},function(err,todo){
        if(err)
        console.log("Error fetching results from db");
        else
        {
            console.log("All good");
            res.render("home",{todo_list:todo});
        }
    });
});

app.get("/task",(req,res)=>{
    res.render("tasks",{todo_list:Todo});
})



//CREATE TASK Route(create-task)
app.post("/create",(req,res) =>{
    var dueDate=req.body.dueDate;
    var formatedDueDate=dateFormat(dueDate,"dddd, mmmm dS,yyyy");
   
    //todo.push(req.body);
    Todo.create({
        description:req.body.description,
        category:req.body.category,
        dueDate:req.body.dueDate
    },function(err,newTodo){
        if(err)
        {
            console.log("Error creating a new todo task");
        }
        console.log("-------------------------------");
        console.log(newTodo);
    });

    res.redirect("back");
});

//DELETE Route
app.post("/delete",(req,res)=>{
    console.log(typeof(req.body.delete));
    let taskToBeDeleted=[];
    console.log(req.body.delete);
    if(req.body.delete===undefined){
        console.log("Empty");
        res.redirect("back");
    }
    else if (typeof(req.body.delete)==="string")
    {   taskToBeDeleted.push(req.body.delete);        
        Todo.deleteOne({_id:taskToBeDeleted},function(err,deletedTask){
                if(err)
                {
                    console.log("Error in deleting ONE task");
                    return;
                }
                else{
                    console.log("Successfully deleted one task");
                    res.redirect("back");
                }
            });

        
        }
        else{
            taskToBeDeleted.push(req.body.delete);
            console.log(typeof(req.body.delete));
            for(let i of taskToBeDeleted){
                for(let j of i){
                    var deleteTask=j;
                    Todo.deleteOne({_id:deleteTask},function(err,deletedTask){
                       if(err){
                        console.log(`Error in deleting task${err}`);
                             return;
                         }
        
                     });
                }
                console.log(deleteTask);
                res.redirect("back");  
            }
        }

        
            
        
    
    //taskToBeDeleted.push(req.body.delete);
    // console.log(taskToBeDeleted.length);
    //console.log(taskToBeDeleted.length);
    // if(taskToBeDeleted.length==0){
    //     window.alert("Select atleast one item to delete");
    // }

    
    //res.redirect("back");
    // var taskToBeDeleted=req.body.delete;
    // let index= todo.findIndex(todo=> todo.description==taskToBeDeleted);
    //    todo.splice(index,1);
    // console.log(taskToBeDeleted);
    // console.log(todo);
    // res.render("back");


});

//LISTEN Route
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting server at ${port} \n ${err}`);
        return;
    }
    console.log(`Server running at ${port}`);
    
});