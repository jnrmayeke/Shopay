import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authAdmin from "@/utils/authAdmin";

// Get Dashboard Data for admin (total orders, total stores, total products, total revenue)
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    // Get total orders
    const totalOrders = await prisma.order.count()

    // Get total stores
    const totalStores = await prisma.store.count()

    // Get total order include only creadedAt and total & calculte total revenue
    const allOrders = await prisma.order.findMany({
        select: {
            createdAt: true,
            total: true
        }
    })

    let totalRevenue = 0
    allOrders.forEach(order => {
        totalRevenue += order.total
    })

    const revenue = totalRevenue.toFixed(2)

    // Get total products
    const totalProducts = await prisma.product.count()

    const dashboardData = {
        totalOrders,
        totalStores,
        totalProducts,
        revenue,
        allOrders
    }

    return NextResponse.json({dashboardData})
}
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 400 });
    }
}