// src/app/(user)/calendar/CalendarQueryProvider.tsx
'use client';

import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 5,
                    gcTime: 1000 * 60 * 30,
                    refetchOnWindowFocus: false,
                    placeholderData: keepPreviousData,
                    retry: 1,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
