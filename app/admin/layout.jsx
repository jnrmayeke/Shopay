import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "shopay. - Admin",
    description: "shopay. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
