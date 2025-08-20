"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7000;
app.use(express_1.default.json());
app.use("/api", adminRoute_1.default);
app.get("/", (request, response) => {
    response.send(`Server statrted on Port ${PORT}.....WOW👍💕`);
});
app.listen(PORT, () => {
    console.log(`Server statrted on Port ${PORT}.....`);
});
//# sourceMappingURL=index.js.map