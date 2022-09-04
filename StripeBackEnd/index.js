const cors=require("cors")
const express=require("express")
//TODO:add a stripe 8️⃣ 
const stripe=require("stripe")("sk_test_51Ld6bMEx8Qozsy7Sdp2mb6IvH9agJYZPNvifWRDKTjx0DdExVjD0sgB0blo94Oo4YH82ojMD5CbUustP9LqY0ckw00Tzv2deFR")
//copied publishable key but tutorial show its mandatory secret key
const { uuid } = require('uuidv4');

const app=express();

//middleware
app.use(express.json())
app.use(cors())


//routes
app.get("/",(req,res)=>{
    res.send("IT WORKS AT LCO.lk");
});
app.post("/payment",(req,res)=>{
    const {product,token} =req.body
    console.log("PRODUCT",product)
    console.log("PRICE",product.price)
    const idempotencyKey=uuid()


    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        stripe.charges.create({
            amount:product.price*100,
            currency:"usd",
            customer:customer.id,
            
            receipt_email:token.email,
            description:`purchase of ${product.name}`,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempotencyKey})
    })
    .then(result=>res.status(200).json(result))
    .catch(err=>console.log(err))
})

//listen
app.listen(8282,()=>console.log("Listen AT PORT 8282"))