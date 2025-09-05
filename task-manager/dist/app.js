"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const connect_1 = __importDefault(require("./db/connect"));
const dotenv_1 = __importDefault(require("dotenv"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const path_1 = __importDefault(require("path"));
// extra security packages
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//Load env var
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "blob:"],
        workerSrc: ["'self'", "blob:"],
    },
}));
// extra security
app.set('trust proxy', 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, xss_clean_1.default)());
// middleware
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.json());
// routes
app.use('/api/v1/tasks', tasks_1.default);
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to DB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri)
            throw new Error("MONGO_URI is not defined");
        yield (0, connect_1.default)(mongoUri);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        else
            console.log(error);
    }
});
start();
//# sourceMappingURL=app.js.map