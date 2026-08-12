import AdminLayout from "@/components/admin/AdminLayout";
import {signedIn, SignedOut, SignIn} from "@clerk/nextjs";

export const metadata = {
    title: "shopay. - Admin",
    description: "shopay. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <SignedIn>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/admin" routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}