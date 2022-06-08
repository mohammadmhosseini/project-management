module.exports = class Application{
    #express = require("express");
    #app = this.#express();
    constructor(PORT, DB_URL){
        this.configeDatabase(DB_URL);
        this.createServer(PORT);
        this.configeApplication();
        this.createRoutes();
        this.errorHandler();
    }
    configeApplication(){
        const path = require("path");
        this.#app.use(this.#express.json());
        this.#app.use(this.#express.urlencoded({extended : true}));
        this.#app.use(this.#express.static(path.join(__dirname, "..", "public")));
    }
    configeDatabase(DB_URL){
        const mongoose = require("mongoose");
        mongoose.connect(DB_URL, (error) => {
            if(error) throw error;
            return console.log("Connect to DB successfully...");
        });
    }
    createServer(PORT){
        const http = require("http");
        const server = http.createServer(this.#app);
        server.listen(PORT,() => {
            console.log(`Server run > on http://localhost:${PORT}`);
        })
    }
    createRoutes(){
        this.#app.get("/", (req, res, next) => {
            return res.json({
                message : "This is my first Express application on github :)",
            });
        })
    }
    errorHandler(){
        this.#app.use((req, res, next) => {
            return res.status(404).json({
                status : 404,
                success : false,
                message : "مسیر مورد نظر یافت نشد"
            });
        });
        this.#app.use((error, req, res, next) => {
            const status = error?.status || 500;
            const message = error?.message || "InternalServerError";
            return res.status(status).json({
                status,
                success : false,
                message
            });
        })
    }
}