var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    nexmo =require("nexmo");
    socket=require("socket.io");
    twilio=require("twilio")('AC469a1d1ac926a402868674c7b924865e','561247090aad67fd48152a65a028fc92'),
    Doctor = require("./models/doctor"),
    Recipt=require("./models/recipt"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser=require("body-parser"),
    User = require("./models/user");
var override = require("method-override");
mongoose.connect("mongodb://localhost/bookadoc_v11", { useUnifiedTopology: true, useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());
app.use(express.static("public"));
app.use(override("_method"));


// var doctor = {
//     name: "Sathya",
//     Speciality: "general" ,
//     experience: "5 years"
// }

// Doctor.create(doctor,function(err,doctor){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("new doc added!");
//         console.log(doctor);
//     }
// });
// PASSPORT CONFIGUTATION

app.use(require("express-session")({
    secret:"Hi there , This is Surya Kanegyan",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/// user details

app.use(function(req,res,next){
res.locals.currentUser = req.user;

next();
});
const Nexmo=new nexmo({
    apiKey:'cacc8192',
    apiSecret:'iFxxIgJctgu8wFhm'
},{debug:true});




app.get("/",function(req,res){
res.render("home");
});
app.get("/user",function(req,res){
    console.log(req.user);
    if(req.user.profession==="patient"){
        res.redirect("/patient");
    }
    else if(req.user.profession==="doctor"){
        res.redirect("/doctor");
    }
})
app.get("/patient",function(req,res){
    res.redirect("/bookdoc");
});

app.get("/bookdoc",isLoggedIn,function(req,res){
    User.find({profession:"doctor"},function(err,doctor){
        if(err){
            console.log(err);
        }else{
          
             res.render("bookdoc",{doctor:doctor,loggeduser:req.user});
        }
    })

});
app.get("/bookings/:id",isLoggedIn,function(req,res){
    res.render("bookings",{id:req.params.id,loggeduser:req.user});
})
app.post("/bookings",isLoggedIn,function(req,res){
    
    var data=new Recipt({ name:req.body.tname,mob:req.body.mob,description:req.body.description,status:"Pending"});
   var id =req.body.doc;
   User.findById(req.user._id,function(err,foundUser){
       if(err){
           console.log(err);
           res.redirect("/bookdoc");
       }
       else{
        User.findById(id,function(err,founddoc){
            if(err){
                console.log(err);
                res.redirect("/bookdoc");
            }
            else{
                Recipt.create(data,function(err,recipt){
                    if(err){
                           console.log(err);
                           res.redirect("/");
                    }else{
                       console.log(founddoc);
                        //console.log(type(founddoc.reciptid));
                            recipt.docname=founddoc.firstname+" "+founddoc.lastname;
                            recipt.speciality=founddoc.speciality;
                            recipt.save();
                       
                           founddoc.reciptid.push(recipt._id);
                           founddoc.save();
                           console.log(founddoc);
                           console.log(foundUser);
                           foundUser.reciptid.push(recipt._id);
                           foundUser.save();
                           console.log(foundUser);
                          
                           res.redirect("/recipts");

                    }
                   });           
                }
          });  
           }
      });
 
});
app.get("/doctor", isLoggedIn,function(req,res){
    res.redirect("/doctor/recipts");
});
app.get("/doctor/recipts", isLoggedIn,function(req,res){
    var user=req.user._id;
    User.findById(user,function(err,user){
        Recipt.find({},function(err,recipt){
            var arr=[];
            console.log("receipts"+recipt);
            recipt.forEach(element => {
                console.log("element"+element);
                console.log("element id"+element._id);
                console.log("array of user_receipt"+user.reciptid);
                console.log((user.reciptid).includes(element._id));
                if((user.reciptid).includes(element._id)){
                    arr.push(element);
                }
               
                
            });
            console.log(arr);
            res.render("doctorRecipt",{recipts:arr});
        });
        
    
    });    
});


app.post("/doctor/recipt/approved/:number/:id", isLoggedIn,function(req,res){
      console.log(req.params.number);
      res.render("docterapprove",{number:req.params.number,id:req.params.id});
    
});
app.post("/doctor/approve/message",function(req,res){
var id=req.body.id;
Recipt.findById(id,function(err,recipt){
    if(err){
        console.log("error");
    }
    else{
        recipt.status="Approved";
        recipt.appoint_date=req.body.date;
        recipt.appoint_time=req.body.time;
        recipt.save();
        console.log(recipt);
        return res.redirect('/doctor/recipts');
    }
  
});


});

app.post("/doctor/recipt/rejected/:number/:id", isLoggedIn,function(req,res){
    console.log(req.params.number);
    res.render("doctorreject",{number:req.params.number,id:req.params.id});
  
});
app.post("/doctor/reject/message",function(req,res){
    var id=req.body.id;
    Recipt.findById(id,function(err,recipt){
        if(err){
            console.log("error");
        }
        else{
            recipt.status="Rejected";
            recipt.reason=req.body.reason;
            recipt.save();
            console.log(recipt);
            return res.redirect('/doctor/recipts');
        }
    })
})


app.get("/recipts", isLoggedIn,function(req,res){
    var user=req.user._id;
User.findById(user,function(err,user){
    Recipt.find({},function(err,recipt){
        var arr=[];
        console.log("receipts"+recipt);
        recipt.forEach(element => {
            console.log("element"+element);
            console.log("element id"+element._id);
            console.log("array of user_receipt"+user.reciptid);
            console.log((user.reciptid).includes(element._id));
            if((user.reciptid).includes(element._id)){
                arr.push(element);
            }
           
            
        });
        console.log(arr);
        res.render("recipt",{recipts:arr});
    });
    

});           
});
 //// ABOUT & CONTACT
 app.get("/about",function(req,res){
res.render("about");
 });
 app.get("/contact",function(req,res){
res.render("contact");
     });

 //// AUTHENTICATION ROUTES
    
app.get("/register",function(req,res){
    res.render("register");
    }); 
app.post("/register",function(req,res){
        var newUser = new User({username:req.body.username,firstname:req.body.firstname,profession:"patient",lastname:req.body.lastname});
        User.register(newUser,req.body.password,function(err,user){
            if(err){
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/patient");
            });
        });
    });
    app.get("/registerdoctor",function(req,res){
        res.render("docterRegister");
    })
    app.post("/registerdocter",function(req,res){
        var newuser=new User({firstname:req.body.firstname,lastname:req.body.lastname,speciality:req.body.speciality,profession:"doctor",experience:req.body.experience,username:req.body.username});
        User.register(newuser,req.body.password,function(err,docter){
            if(err){
                console.log(err);
                return res.render("docterRegister");
            }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/doctor");
            });

        })
    })

   
app.get("/login",function(req,res){
        res.render("login");
    });
app.post("/login",passport.authenticate("local",{
        successRedirect:"/user",
        failureRedirect:"/login"
    }),function(req,res){
    
    });
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
    });
function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }



app.listen("3000",function(res,res){
console.log("BOOK-A-DOC App Has Started !!");
});
