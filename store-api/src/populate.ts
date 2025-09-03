import dotenv from "dotenv"
import connectDB from './db/connect'
import Product from './models/product'
import jsonProducts from './products.json'  //"resolveJsonModule": true in tsconfig.json

dotenv.config()

// define type for Product
interface ProductType {
    name: string;
    price: number;
    company: string;
    rating?: number;
    featured?: boolean;
}

const products: ProductType[] = jsonProducts as ProductType[];

const start = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI is not defined");
        await connectDB(mongoUri);

        await Product.deleteMany() //optional, just to make sure
        await Product.create(products)
        
        console.log('success')
        process.exit(0)
    } catch (error: unknown) {
        if (error instanceof Error) console.log(error.message);
        else console.log(error);
        process.exit(1);
    }

}

start()