const express = require("express");
const request = require('supertest');
const bookRoute  =require("../routes/books.route");


//Creating mock app
const app=express();
app.use(express.json());
app.use("/api/books", bookRoute);


describe('Integration test for books api', ()=>{
    
    it("GET /api/books -success -get all books", async()=>{
        const {body, statusCode} = await request(app).get("/api/books");

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id : expect.any(Number),
                    name: expect.any(String),
                    author: expect.any(String)
                })
            ])
        );

        expect(statusCode).toBe(200);
    })
})