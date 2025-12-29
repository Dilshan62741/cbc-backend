import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProdct(req,res){
   
    try{
        if(isAdmin(req)){
            const products = await Product.find();
             res.json(products)
        }else{
            const products = await Product.find({isAvailable : true});
            res.json(products)
        }
        
    }catch(err){
        res.json({message : "Failed to fetch products", error : err})
    }
    
}

export function saveProduct(req,res){
    if(!isAdmin){
        res.status(403).json({message : "Your are not authorized to add a product"});
        return
    }

    const product = new Product(
    req.body
    )
    product.save().then(() => {
        res.json({message: 'Product data saved successfully'});
    }).catch((err) => {
        res.json({message: 'Failed to save Product data', error: err});
    });
}
export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Your are not authorized to delete a product"});
        return
    }
    try{
        await Product.deleteOne({productId :req.params.productId})
        res.json({message : "Product deleted successfully"});
    }catch(err){
        res.status(500).json({message : "Failed to delete product", error : err})
    }
    
}