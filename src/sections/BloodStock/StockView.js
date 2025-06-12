import { SidebarTrigger } from "@/components/ui/sidebar";

export default function StockDashboard() {
    const bloodStockData = [
        { type: 'aPos', label: 'A+', units: 150 },
        { type: 'aNeg', label: 'A-', units: 80 },
        { type: 'bPos', label: 'B+', units: 120 },
        { type: 'bNeg', label: 'B-', units: 60 },
        { type: 'oPos', label: 'O+', units: 200 },
        { type: 'oNeg', label: 'O-', units: 100 },
        { type: 'abPos', label: 'AB+', units: 90 },
        { type: 'abNeg', label: 'AB-', units: 40 }
    ];
    return(
        <main className="flex-1 p-6">
            <div className="grid grid-cols-4 gap-6">
                {bloodStockData.map((item) => (
                    <div key={item.type} className="bg-white p-6 rounded border border-gray-200">
                        <div className="mb-2 text-sm text-gray-600">{item.label}</div>
                        <div className="text-3xl font-bold text-red-500">{item.units}</div>
                        <div className="text-xs text-gray-500">units available</div>
                    </div>
                ))}
            </div>
        </main>
    );
}