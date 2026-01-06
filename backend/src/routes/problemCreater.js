const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");


// Create
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);


// Public problem read endpoints (make problem statements and starter code available
// to unauthenticated users). Protected endpoints remain protected elsewhere.
problemRouter.get("/problemById/:id", getProblemById);
problemRouter.get("/getAllProblem", getAllProblem);
// The following endpoints are user-specific and still require authentication
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);


module.exports = problemRouter;

// fetch
// update
// delete 
