import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "shopay. - Store Dashboard",
    description: "shopay. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
