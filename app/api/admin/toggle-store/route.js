import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authAdmin from "@/utils/authAdmin";

// Toggle store isActive
export async function POST(request){
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({error: 'unauthorized'}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: { status: 'approved' },
            include: {user: true}
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, {status: 400})
    }
}