const express=require("express")
const mongoose=require("mongoose")

const app=express()
const cors=require("cors")
const dotenv=require("dotenv")
const authRoutes=require("./routes/auth")
const RmsUser = require("./models/RmsUser")
const RmsProject = require("./models/RmsProject")
const RmsAssignment = require("./models/RmsAssignment")

app.use(express.json())

dotenv.config()
mongoose.connect(process.env.MONGODB).then(()=>console.log("Database connected successfully")).catch(error=>console.error(error))
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
   ' https://rms-frontend-umzk.vercel.app' // Optional: in case you're also using Create React App
    // Add production domain when deploying:
    // 'https://your-production-domain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use("/auth",authRoutes);
const PORT=process.env.PORT||5000

app.get("/",async(req,res)=>{
    res.status(200).json({message:"RMS Backend"})
})
app.post("/projects",async(req,res)=>{
    try {
        const data=req.body
            if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }

    const newProject = new RmsProject(data);
    const savedProject = await newProject.save();

    res.status(201).json({ message: "Project created successfully", project: savedProject });
    } catch (error) {
        res.status(500).json({message:"Failed to post project data"})
    }
})
app.post("/assignments",async(req,res)=>{
    try {
        const data=req.body
            if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }

    const newAssignment = new RmsAssignment(data);
    const savedProject = await newAssignment.save();

    res.status(200).json({ message: "Assignment created successfully", project: savedProject });
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Failed to post Assignment data"})
    }
})
app.get("/projects/:managerId",async(req,res)=>{
    try {
        const data=await RmsProject.find({managerId:req.params.managerId}).populate("managerId");
        if(data ){
res.status(200).json(data)
        }else{
            res.status(404).json({message:"Data not found"})
        }
    } catch (error) {
        console.log(error)
         res.status(500).json({message:"Failed to get project data"})
    }
})
app.get("/assignments",async(req,res)=>{
    try {
        const data=await RmsAssignment.find().populate('engineerId')
        if(data ){
res.status(200).json(data)
        }else{
            res.status(404).json({message:"Data not found"})
        }
    } catch (error) {
        console.log(error)
         res.status(500).json({message:"Failed to get Assignments data"})
    }
})
app.post("/update/:id", async (req, res) => {
  try {
    const updatedProject = await RmsProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
});
app.get("/engineers", async (req, res) => {
  try {
    const engineers = await RmsUser.find({ role: "engineer" });

    if (engineers.length > 0) {
      res.status(200).json(engineers);
    } else {
      res.status(404).json({ message: "No engineers found" });
    }
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({ message: "Failed to fetch engineers" });
  }
});
app.put("/assignments/update/:id", async (req, res) => {
  try {
    const updatedProject = await RmsAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment  updated successfully", Assignment : updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update Assignment " });
  }
});
app.get("/user/:userId",async(req,res)=>{
    try {
        const userData=await RmsUser.findOne({_id:req.params.userId})
        if(!userData){
            res.status(404).json({message:"Not Found"})
        }
        res.status(200).json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch user Details " });
    }
})
app.post("/user/:userId", async (req, res) => {
    try {
        const userData = await RmsUser.findOneAndUpdate(
            { _id: req.params.userId },
            req.body,
            { new: true } 
        );

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update details" });
    }
});
app.get("/engineer/:userId",async(req,res)=>{
try {
    const assignments=await RmsAssignment.find({engineerId:req.params.userId}).populate(engineerId)
 res.status(200).json(assignments)
} catch (error) {
      res.status(500).json({ message: "Failed toget Assignments data" });
}
})
app.listen(PORT,()=>{
    console.log("App is running on the PORT: "+PORT)
})