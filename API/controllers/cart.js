const express = require('express');
const database = require('../db.js');
const mysql = require('mysql');
const db = database.db;

const addProduct = async (req, res) => {
    const cartItem = req.body.cartItem;

    db.getConnection(async (err, connection) => {
        if (err) throw err;

        // Check if product already exists in the cart
        const checkCart = "SELECT quantity FROM cart WHERE uid = ? AND pid = ?";
        const checkCart_query = mysql.format(checkCart, [cartItem.UserId, cartItem.pid]);

        connection.query(checkCart_query, async (err, result) => {
            if (err) {
                console.error("SQL Error:", err);
                connection.release();
                return res.status(500).json({ error: err.sqlMessage });
            }

            if (result.length > 0) {
                // If product exists, increment quantity
                const incrementQuantity = "UPDATE cart SET quantity = quantity + 1 WHERE uid = ? AND pid = ?";
                const incrementQuantity_query = mysql.format(incrementQuantity, [cartItem.UserId, cartItem.pid]);

                connection.query(incrementQuantity_query, (err, updateResult) => {
                    if (err) {
                        console.error("SQL Error:", err);
                        connection.release();
                        return res.status(500).json({ error: err.sqlMessage });
                    }
                    console.log("incremented successfully");
                    connection.release();
                    return res.json({ message: "Incremented successfully" });
                });
            } else {
                // If product does not exist, insert it
                const addInCart = "INSERT INTO cart (uid, pid, quantity) VALUES (?, ?, ?)";
                const addInCart_query = mysql.format(addInCart, [cartItem.UserId, cartItem.pid, cartItem.quantity]);

                connection.query(addInCart_query, (err, insertResult) => {
                    if (err) {
                        console.error("SQL Error:", err);
                        connection.release();
                        return res.status(500).json({ error: err.sqlMessage });
                    }
                    console.log("Product added to cart successfully");
                    connection.release();
                    return res.json({ message: "Product added to cart successfully" });
                });
            }
        });
    });
};

const getProducts=async(req,res)=>{
    const userId=req.params.UserId;

    await db.getConnection(async (err,connection)=>{
        if(err)
            throw err;
        const selectProducts=`
        SELECT products.*,cart.quantity
        FROM cart
        JOIN products ON cart.pid=products.productId
        WHERE cart.uid=?
        `;

        const selectProducts_query=mysql.format(selectProducts,[userId]);
        await connection.query(selectProducts_query,async(err,result)=>{
            if(err)
                throw err;
            connection.release();
            console.log("exported successfully");
            res.json({result});
        });
    });
};

const removeProduct=async(req,res)=>{
    const uid=req.body.UserID;
    const pid=req.body.pid;

    await db.getConnection(async (err,connection)=>{
        if(err)
            throw err;
        const remove="DELETE FROM cart WHERE uid=? AND pid=?";
        const remove_query=mysql.format(remove,[uid,pid]);

        await connection.query(remove_query,async(err,result)=>{
           if(err)
            throw err;
           console.log("product removed successfully");
           connection.release(); 
        });
    });
};

const updateQuantity=async(req,res)=>{
    const userId=req.body.UserID;
    const productId=req.body.productId;
    const quantity=req.body.quantityValue;

    await db.getConnection(async (err,connection)=>{
        if(err)
            throw err;

        const update="UPDATE cart SET quantity=? WHERE uid=? AND pid=?";
        const update_query=mysql.format(update,[quantity,userId,productId]);

        await connection.query(update_query,async(err,result)=>{
            if(err)
                throw err;

            console.log("quantity updated successfully");
            connection.release();
        });
    });
}

module.exports.addProduct = addProduct;
module.exports.getProducts=getProducts;
module.exports.removeProduct=removeProduct;
module.exports.updateQuantity=updateQuantity;
