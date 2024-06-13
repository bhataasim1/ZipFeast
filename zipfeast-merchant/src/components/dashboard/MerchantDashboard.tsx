import MerchantProfileUpdateCard from "./MerchantProfileUpdateCard";
import MerchantProfileCard from "./MerchantProfileCard";

export function MerchantDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <MerchantProfileUpdateCard />
          </div>
          <div>
            <MerchantProfileCard />
          </div>
        </main>
      </div>
    </div>
  );
}
