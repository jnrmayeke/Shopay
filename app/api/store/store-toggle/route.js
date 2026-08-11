import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { authSeller } from "@/utils/authSeller";


//toggle stock of product
export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const {productId} = await request.json()
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: "unauthorized"}, {status: 401})
        }

        if(!productId){
            return NextResponse.json({error: "missing details: productId"}, {status: 400})
        }

        //check if product exists
        const product = await prisma.product.findFirst({
            where: {
                id: productId, storeId
            }
        })

        if(!product){
            return NextResponse.json({error: "product not found"}, {status: 404})
        }

        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                inStock: !product.inStock
            }
        })

        return NextResponse.json({message: "product stock updated successfully"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}