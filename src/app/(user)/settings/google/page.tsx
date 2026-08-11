import SettingGoogleConnectionCallback from "@/feature/setting/components/SettingGoogleConnectionCallback";

interface GoogleConnectionCallbackPageProps {
  searchParams: Promise<{
    googleConnection?: string;
  }>;
}

export default async function GoogleConnectionCallbackPage({ searchParams }: GoogleConnectionCallbackPageProps) {
  const { googleConnection } = await searchParams;

  return <SettingGoogleConnectionCallback success={googleConnection === "success"} />;
}
