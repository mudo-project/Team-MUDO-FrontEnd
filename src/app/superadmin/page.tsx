import SuperAdminDashboard from "@/feature/superadmin/components/SuperAdminDashboard";

interface SuperAdminProps {
    searchParams: Promise<{
        scope: 'ACADEMY' | 'ALL';
        period: 'LAST_HOUR' | 'TODAY' | 'LAST_24_HOURS';
        academyCode?: string;
    }>
}

export default async function Page({ searchParams }: SuperAdminProps) {
    const { scope = 'ALL', period = 'TODAY', academyCode } = await searchParams;
    const selectedAcademyCode = scope === "ACADEMY" ? academyCode ?? "academy-a" : undefined;

    return <SuperAdminDashboard academyCode={selectedAcademyCode} period={period} scope={scope} />;
}
