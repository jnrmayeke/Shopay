import imageKit from "@/configs/imageKit"
import { NextResponse } from "next/server"
import prisma from "@/configs/prismadb"
import {getAuth} from "@clerk/nextjs/server"
import authSeller from "@/utils/authSeller"

//add new product
export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: "unauthorized"}, {status: 401})
        }

        //get the data from the form
        const formData = await request.formData()
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp = Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const images = formData.getALL("images")

        if(!name || !description || !mrp || !price || !category || !images.length < 1){
            return NextResponse.json({error: "missing product details"}, {status: 400})
        }

        //upload images to imagekit
        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imageKit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            });
            const url = imageKit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto", format: "webp", width: "1024" }
                ]
            });
            return url;
        }));

        await prisma.product.create({
            data: {
                storeId: storeId,
                name: name,
                description: description,
                mrp: mrp,
                price: price,
                category: category,
                images: imagesUrl
            }
        })

        return NextResponse.json({message: "product added successfully"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}

//get all products of a store
export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: "unauthorized"}, {status: 401})
        }

        const products = await prisma.product.findMany({
            where: {
                storeId: storeId
            }
        })

        return NextResponse.json({products})
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}