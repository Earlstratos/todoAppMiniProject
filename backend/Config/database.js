const mongoose = require('mongoose');
require("dotenv").config();// it loads the data in the curent workig projects

// linking database
const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
.then(()=> console.log("Db connection established Successfully"))
.catch((error) =>{
    console.log("Issue in Db connect");
    console.error(error.message);
    process.exit(1);
});
}
module.exports = dbConnect;
