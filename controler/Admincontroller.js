const express = require('express');

const Admin = require('../models/Admin');
const SanPham = require('../models/product');
const app = express();




app.get("/", (req, res) => {
    res.render("user/dangky")
})
app.get("/cmhome", (req, res) => {
    res.render("user/addproduct")
})


app.post('/dangky', async (req, res) => {
    console.log(req.body);
    if(req.body.id==''){
        addUser(req, res);
    }else{
     //   updateUser(req, res);
    }

   
});
function addUser(req, res) {
    const u = new Admin(req.body)
    console.log(u);
    try {
     u.save();
        res.render("user/dangnhap", {
            titleView: "Đăng ký thành công!"
        })
    } catch (error) {
        res.status(500).send(error);
        console.log(u);
    }
};
// function updateUser(req, res){
//     Admin.findOneAndUpdate({_id:req.params.id} , req.body, (err , doc) =>{
//        if(!err){
//          res.redirect("/user/detail")
//        }else{
//         console.log(err)
//         res.render("user/dangky",{
//             titleView:"Update loi !"
//         })
//        }
//     })
// }

app.put("/update/:id", (req, res) =>{
    console.log(req.params.id)
    console.log(req.body.name)
    Admin.updateOne({_id:req.params.id}, req.body)
    .then(() => res.redirect("/user/getAllUsers"))
    .catch(err => console.error(err))
})

app.post('/dangnhap', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.passWord;
        const users = await Admin.findOne({ email: email, pass: password })
        if (!users) {
            res.send("email or password not found")
            return
        }
        res.render("user/manhinhchinh", {
            titleView: "Đăng ký thành công!"
        })
    } catch (error) {
        console.log(error);
    }
})

app.get("/getAllUsers", (req, res) => {
    const u = Admin.find({})
    Admin.find({}).then(Admin => {
        res.render("user/detail", {
            Admin: Admin.map(user => user.toJSON())

        })
    })
})
app.get("/delete/:id", async (req, res) => {
    try {
        const users = await Admin.findByIdAndDelete(req.params.id, req.body)
        if (!users) {
            res.status(404).send("no items found")
        } else {
            res.status(200).redirect("/user/getAllUsers")
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/edit/:id", async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        res.render("user/update", {
            viewTitle: "update user",
            user: user.toJSON(),
        });
    } catch (err) {
        console.log(err);
    }
});
////////////////san pham//////////////
app.post('/addproduct', async (req, res) => {
    console.log(req.body);
    if(req.body.id==''){
        addSp(req, res);
    }else{
     //   updateUser(req, res);
    }

   
});
function addSp(req, res) {
    const u = new SanPham(req.body)
    console.log(u);
    try {
     u.save();
        res.render("user/manhinhchinh", {
            titleView: "Đăng ký thành công!"
        })
    } catch (error) {
        res.status(500).send(error);
        console.log(u);
    }
};
///////
// app.get("/", (req, res) => {
//     res.render("user/addproduct")
// })
// app.post('/addproduct', async (req, res) => {
//     const u = new SanPham(req.body)
//     try {
//    await u.save();
//         res.redirect("/getAllSp")
//     } catch (error) {
//         res.status(500).send(error);
//         console.log(u);
//     }

   
// });
app.get("/getAllsp", (req, res) => {
    const u = SanPham.find({})
    SanPham.find({}).then(SanPham => {
        res.render("user/detailproduct", {
            SanPham: SanPham.map(user => user.toJSON())

        })
    })
})
app.get("/deletesp/:id", async (req, res) => {
    try {
        const users = await SanPham.findByIdAndDelete(req.params.id, req.body)
        if (!users) {
            res.status(404).send("no items found")
        } else {
            res.status(200).redirect("/user/getAllSp")
        }
    } catch (error) {
        res.status(500).send(error);
    }
})
module.exports = app;