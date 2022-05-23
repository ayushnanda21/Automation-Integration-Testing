const express = require("express");
const request = require('supertest');
const bookRoute  =require("../routes/books.route");
const {save} = require("../helperfunctions/save")

//Creating mock app
const app=express();
app.use(express.json());
app.use("/api/books", bookRoute);

//mock method
jest.mock("../data/books.json", ()=>{
    [
        { name: 'Call of the wild', author: 'Louis wilder', id: 1 },
        { name: 'Love like no other', author: 'Charlie Bronsey', id: 2 },
        { name: 'Dream', author: 'Jamie Phillips', id: 3 }
    ]
})


describe('Integration test for books api', ()=>{

    // beforeAll(()=>{
    //     const initData = [{ name: 'Call of the wild', author: 'Louis wilder', id: 1 },
    //     { name: 'Love like no other', author: 'Charlie Bronsey', id: 2 },
    //     { name: 'Dream', author: 'Jamie Phillips', id: 3 }
    // ]

    // save(initData)
    // })
    
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
    });

    it('POST  /api/books - faliure on invalid post body', async () => {
		const { body, statusCode } = await request(app).post('/api/books').send({
			name: '',
			author: 'John'
		});

		expect(statusCode).toBe(400);
		expect(body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'Book name is required',
					param: 'name',
					value: ''
				}
			]
		});
	});

    it('POST /api/books - success', async () => {
		const { body, statusCode } = await request(app).post('/api/books').send({
			name: 'Face Off',
			author: ' Travolta'
		});

		expect(statusCode).toBe(200);

		expect(body).toEqual({
			message: 'Success'
		});
    });

    it("PUT /api/:bookid - failure- book not found", async()=>{
        const {body, statusCode} = await request(app).put("/api/books/5000").send({
            name: "Lopop",
            author: "anonymous"
        });

        expect(statusCode).toBe(404);

        expect(body).toEqual({
            error: true,
            message: "Book not found"
        })
    });

    it('PUT /api/books/:bookid - Success - Successfully updated book', async () => {
		const { body, statusCode } = await request(app).put('/api/books/2').send({
			name: 'Hello world',
			author: 'Jack White'
		});

		expect(statusCode).toBe(201);

		expect(body).toEqual({
			name: 'Hello world',
			author: 'Jack White',
			id: 2
		});
	});

    it('Delete /api/books:bookid - failure - book is not found', async()=>{
        const {body, statusCode} = await request(app).delete("/api/books/5000");

        expect(statusCode).toBe(404);
        expect(body).toEqual({
            error: true,
            message: "Book not found"
        });
    });

    it('Delete /api/books/:bookid -Success - Successfully deleted book', async()=>{
        const {body, statusCode}  =await request(app).delete("/api/books/3");

        expect(statusCode).toBe(201);
        expect(body).toEqual({
            message: "Success"
        })
    })
    
})