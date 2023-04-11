const express = require('express');
const Admin = require('../models/Admin');
const SanPham = require('../models/product');
const session = require('express-session');
const Jimp=require('jimp');

const app = express();
const multer=require('multer');
const upload=multer({dest:"uploads/"})
var config = require('../config/database');
var passport = require('../config/Passport');

var jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser());


app.use(session({
    secret: 'sassa2',
    resave: true,
    saveUninitialized: true
 }));

app.get("/chmhc", (req, res) => {
    res.render("user/manhinhchinh")
})

app.get("", (req, res) => {
    //res.render('user/dangnhap',{display:'none'})
    res.render("user/dangnhap")
})
app.get("/cmhdangnhap", (req, res) => {
    res.render("user/dangnhap")
})
app.get("/cmhdetaiproduct", (req, res) => {
    res.render("user/getAllSp")
})
app.get("/cmhuser", (req, res) => {
    res.render("user/getAllUsers")
})
app.get("/cmhdangky", (req, res) => {
    res.render("user/dangky")
})
app.get("/cmhome", (req, res) => {
    res.render("user/addproduct")
})


app.post('/dangky',upload.single('img'), async (req, res) => {
    const u = new Admin(req.body)
    const imagePath = req.file.path; // lấy đường dẫn tới file từ đối tượng req.file
    const image = await Jimp.read(imagePath);
    const base64Image = await image.getBase64Async(Jimp.AUTO);
    u.img=base64Image;
    
    try {
     u.save();
     console.log(u)
        res.render("user/manhinhchinh", {
            titleView: "Đăng ký thành công!"
        })
    } catch (error) {
        res.status(500).send(error);
        console.log(u);
    }

   
});


app.put("/update/:id", upload.single("img"), async (req, res) => {
    try {
     const { name, email, password,role } = req.body;
      const imagePath = req.file.path;
      const image = await Jimp.read(imagePath);
      const base64Image = await image.getBase64Async(Jimp.AUTO);
  
      // Cập nhật thông tin user trong CSDL
      await Admin.findOneAndUpdate(
        { _id: req.params.id },
        { name, email, password, img: base64Image,role }
      );
  
      // Chuyển hướng về trang danh sách user
      res.redirect("/user/getAllUsers");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi update thông tin người dùng");
    }
  });

app.post('/dangnhap', async function (req, res)  {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let users = await Admin.findOne({ email: email })
        if (!users) {
            res.send("email or password not found")
            return
        }else{
            users.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.sign({ users :"hung" },'nodeauthsecret', { expiresIn: '10s' });
                //    console.log(token);
                    res.cookie('token', token, { httpOnly: true });
                    // return the information including token as JSON
                    req.session.user = {
                        email: users.email,
                        password: users.password,
                        role: users.role,
                        image: users.img,
                        _id: users._id
        
                     }
                     res.redirect("/user/mhchome")
                } 
           });
            
       }
    
    } catch (error) {
        console.log(error);
    }

})
   
// app.use((req, res, next) => {
//     // Kiểm tra xem người dùng đã đăng nhập hay chưa
//     if (req.session && req.session.user) {
//       try {
//         // Giải mã token để lấy thông tin user
//         const decoded = jwt.verify(req.session.user, 'nodeauthsecret');
//         //req.user = decoded; // Lưu thông tin user vào req.user
//         res.session.user=decoded
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     next();
//   });
function verifyToken(req, res, next) {
    // Lấy mã thông báo từ cookie
    const token = req.cookies.token;
  console.log(token);
    // Kiểm tra xem mã thông báo có tồn tại không
    if (!token) {
      // Nếu không, chuyển hướng đến trang đăng nhập
      return res.render('user/dangnhap');
    }
  
    jwt.verify(token, 'nodeauthsecret', function (err, decoded) {
        if (err) {
            return res.render('user/dangnhap');
        }
        req.user = decoded.user;
        next();
    });
  }
  



app.get("/getAllUsers",verifyToken,(req, res) => {
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

app.get("/edit/:id", verifyToken,async (req, res) => {
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
app.get("/edituser/:id", verifyToken,async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        res.render("user/updateuser", {
            user: user.toJSON(),
        });
    } catch (err) {
        console.log(err);
    }
});
////////////////san pham//////////////

app.post('/addproduct',upload.single('imgsp'), async (req, res) => {
    const u = new SanPham(req.body)
   
    const imagePath = req.file.path; // lấy đường dẫn tới file từ đối tượng req.file
    const image = await Jimp.read(imagePath);
    const base64Image = await image.getBase64Async(Jimp.MIME_PNG);
    u.imgsp=base64Image;
    try {
     u.save();
        res.render("user/manhinhchinh", {
            titleView: "Đăng ký thành công!"
        })
    } catch (error) {
        res.status(500).send(error);
        console.log(u);
    }

   
});


   
// });
app.get("/getAllsp" ,verifyToken,(req, res) => {
    const u = SanPham.find({})
    SanPham.find({}).then(SanPham => {
        res.render("user/detailproduct", {
            SanPham: SanPham.map(user => user.toJSON())

        })
    })
})
app.put("/updateproduct/:id",upload.single("imgsp"), async (req, res) =>{
    try {
        const {masp, tensp, dongiasp,mausacsp,loaisanpham,makhachhang,tenkhachhang} = req.body;
        const imagePath = req.file.path;
        const image = await Jimp.read(imagePath);
        const base64Image = await image.getBase64Async(Jimp.AUTO);
      // Cập nhật thông tin user trong CSDL
      await SanPham.findOneAndUpdate(
        { _id: req.params.id },
    
       { masp, tensp, dongiasp,mausacsp,loaisanpham,makhachhang,tenkhachhang,imgsp:base64Image}
       
      );
  
      // Chuyển hướng về trang danh sách user
      res.redirect("/user/getAllSp");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi update thông tin người dùng");
    }
})

app.put("/update/:id", upload.single("img"), verifyToken,async (req, res) => {
    try {
     const { name, email, password } = req.body;
      const imagePath = req.file.path;
      const image = await Jimp.read(imagePath);
      const base64Image = await image.getBase64Async(Jimp.AUTO);
  
      // Cập nhật thông tin user trong CSDL
      await Admin.findOneAndUpdate(
        { _id: req.params.id },
        { name, email, password, img: base64Image }
      );
  
      // Chuyển hướng về trang danh sách user
      res.redirect("/user/getAllUsers");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi update thông tin người dùng");
    }
  });
app.get("/editsp/:id", verifyToken,async (req, res) => {
    try {
        const sanpham = await SanPham.findById(req.params.id);
        res.render("user/updatesp", {
            sanpham: sanpham.toJSON(),
        });
    } catch (err) {
        console.log(err);
    }
});
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
////////

app.get('/search', verifyToken,async (req, res) => {

    try {
        const name=req.query.Search;
        // Tìm kiếm trong cơ sở dữ liệu
        const user = await Admin.find({ name: { $regex: name, $options: 'i' }});
            console.log(user)
        res.render("user/detail", {
             Admin: user.map(users => users.toJSON()),
            
        
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
////////
app.get('/searchproduct', async (req, res) => {

    try {
        const tensp=req.query.searchproduct;
        // Tìm kiếm trong cơ sở dữ liệu
        const user = await SanPham.find({ tensp: { $regex: tensp, $options: 'i' }});
            console.log(user)
        res.render("user/detailproduct", {
            SanPham: user.map(users => users.toJSON()),
            
        
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//////
app.get("/mhchome", (req, res) => {
    const user = req.session.user
    console.log(user.role)
    if (!user) {
       res.redirect("user/dangnhap")
    } else {
       if (req.session.user.role === "Admin") {
          res.render("user/manhinhchinh")
       } else {
          res.redirect("/user/getAlluser")
       }
    }
 })

 app.get("/edituser/:id",(req, res) => {
  
    res.render("user/edituser")

  })
  app.put("/updateuser1/:id", upload.single("img"), async (req, res) => {
    try {
        const { name, email, password } = req.body;
         const imagePath = req.file.path;
         const image = await Jimp.read(imagePath);
         const base64Image = await image.getBase64Async(Jimp.AUTO);
     
         // Cập nhật thông tin user trong CSDL
         await Admin.findOneAndUpdate(
           { _id: req.params.id },
           { name, email, password, img: base64Image }
         );
     
         // Chuyển hướng về trang danh sách user
         res.render('/user/detailuser',{display:'none'})
         res.redirect("/user/getAlluser");
       } catch (err) {
         console.error(err);
         res.status(500).send("Lỗi khi update thông tin người dùng");
       }

  })

 ///////////
 app.get("/getAlluser",verifyToken,(req, res) => {
    const user = req.session.user
    console.log(user)
    Admin.findById({_id:user._id}).then(Admin1 => {
        res.render("user/detailuser", {
            Admin1: Admin1.toJSON()

        })
    })
})

module.exports = app;