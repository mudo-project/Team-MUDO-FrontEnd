import AcademyApplicationList from "@/feature/admin/academy/components/AcademyApplicationList";
import AcademyApplicationNav from "@/feature/admin/academy/components/AcademyApplicationNav";

export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-2 py-4 sm:px-2.5 md:px-4 md:py-5 lg:px-8 lg:py-7">
            <AcademyApplicationNav />
            <AcademyApplicationList />
        </main>
    );
}
