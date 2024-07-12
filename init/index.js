const sampleData = require("./data.js");
const mongoose = require('mongoose');
const Listing = require("../models/listings.js");

main()
.then(res=> console.log(`Connected succussfully`))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WonderLust');
}


const insertData = async () =>{
  await Listing.deleteMany({});
  sampleData.data=  sampleData.data.map((obj)=>({...obj,owner:"6687e08a9e024788b8d9440b"}));
    await Listing.insertMany(sampleData.data);
    console.log('data saved');
}

insertData();