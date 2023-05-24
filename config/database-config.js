const mongoose = require('mongoose');

const uri = 'mongodb+srv://shiwang7308:naman%40srt@cluster0.ggf4ymw.mongodb.net/?retryWrites=true&w=majority';
const connect = async () => {
    try{
        await mongoose.connect(uri);
        console.log("mongo db connected")
    }
    catch(err){
        console.log(err);
        throw new Error(err);
        
    }

}

module.exports = connect;