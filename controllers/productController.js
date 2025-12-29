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

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({message : "Your are not authorized to update a product"});
        return
    }
    const productId = req.params.productId;
    const updatingData = req.body;

    try{
        await Product.updateOne(
  { productId },
  { $set: updatingData }
);

        res.json({message : "Product updated successfully"});


    }catch (err) {
  console.error(err);

  res.status(500).json({
    message: "Failed to update product",
    error: err.message
  });
}


}

export async function getProductById(req,res){
    const productId = req.params.productId;
    try{
        const product = await Product.findOne({productId : productId})

        if(product == null){
            res.status(404).json({message : "Product not found"});
            return
        }
        if(product.isAvailable){
            res.json(product)
        }else{
            if(!isAdmin(req)){
                res.status(403).json({message : "Product not available"});
            }else{
                res.json(product)
        }
        }
    }catch(err){
        res.status(500).json({message : "Failed to fetch product", error : err})
    }
}