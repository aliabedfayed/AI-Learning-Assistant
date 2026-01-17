"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Providers({
    children
}: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
        </QueryClientProvider>
    )
}
