const { use } = require('express/lib/application');
const mongoose = require('mongoose');
const { schema } = require('./models/campground');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/camp-app');
}

//Case1. One to Few
const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [{
        _id: { id: false },
        street: String,
        city: String,
        state: String,
        country: String
    }]
})

const User = mongoose.model('User', userSchema);

const makeUser = async() => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    })
    u.address.push({
        street: '123 Sesame St.',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await u.save()
    console.log(res)
}

const addAddress = async(id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '99 3rd St.',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await user.save()
    console.log(res);
}


//Case2. One to Many
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});
//parent is having child in it
const farmSchema = new mongoose.Schema({
    name: String,
    city: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema);

Product.insertMany([
    { name: 'Goddess Melon', price: 4.5, season: 'Spring' },
    { name: 'Goddess Strawberry', price: 4.5, season: 'Spring' },
    { name: 'Goddess Watermelon', price: 4.5, season: 'Spring' }
])
const makeFarm = async() => {
    const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' });
    const melon = await Product.findOne({ name: 'Goddess Melon' });
    farm.products.push(melon);
}

//If you want to see every element of products and not only id
Farm.findOne({ name: 'Full Belly Farms' })
    .populate('products') //If you want to populate only some elements(like price) you can do following: .populate('products', 'price')
    .then(farm => console.log(farm));


//Case3. One to Bajillions
const userSchema = new mongoose.Schema({
    username: String,
    age: Number
})

//Child is having parent in it
const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);