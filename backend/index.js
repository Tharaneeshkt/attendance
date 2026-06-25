import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });


// ================= STUDENT SCHEMA =================

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});


const Student = mongoose.model(
  "Student",
  studentSchema
);


// ================= ATTENDANCE SCHEMA =================

const attendanceSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  date: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["P", "A"],
    required: true
  }

});


const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);



const PORT = 3000;


// ================= HOME ROUTE =================

app.get("/", (req, res) => {

  res.send("Server Has Started Successfully");

});



// ================= CUSTOM ROUTE =================

app.get("/tharaneesh", (req, res) => {

  res.send("Server says Hi to tharaneesh");

});



// ================= GET ALL STUDENTS =================

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ rollNo: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


// ================= ADD STUDENT =================

app.post("/students", async(req,res)=>{

  try{

    const student = await Student.create({

      rollNo:req.body.rollNo,

      name:req.body.name

    });


    res.status(201).json(student);


  }catch(error){


    res.status(500).json({

      error:error.message

    });


  }


});




// ================= MARK ATTENDANCE =================

app.post("/attendance", async(req,res)=>{


  try{


    const {
      studentId,
      date,
      status
    } = req.body;



    const attendance = await Attendance.findOneAndUpdate(

      {
        studentId:studentId,
        date:date
      },


      {

        studentId:studentId,

        date:date,

        status:status

      },


      {

        new:true,

        upsert:true

      }

    );


    res.status(200).json(attendance);



  }catch(error){


    res.status(500).json({

      error:error.message

    });


  }


});




// ================= GET ALL ATTENDANCE =================

app.get("/attendance", async(req,res)=>{


  try{


    const attendance = await Attendance.find()
    .populate("studentId");


    res.json(attendance);



  }catch(error){


    res.status(500).json({

      error:error.message

    });


  }


});





// ================= START SERVER =================


app.listen(PORT,()=>{


  console.log(`Server running on port ${PORT}`);


}); 
