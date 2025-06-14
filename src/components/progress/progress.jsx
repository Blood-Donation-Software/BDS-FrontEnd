import React from "react";
import { CheckIcon } from "lucide-react";
export default function Progress(props) {
    const stepperData = [
        { id: 1, status: "completed" },
        { id: 2, status: "completed" },
        { id: 3, status: "inactive" },
        { id: 4, status: "inactive" },
    ];
    return(
        <div className="mt-6">
            <div className="w-full flex flex-col items-center">
                <div className="flex items-center h-8 mb-2">
                    {stepperData.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        step.status === "completed" ? "bg-[#e83333]" : 
                                        step.status === "active" ? "bg-[#e83333] ring-2 ring-[#e83333] ring-offset-2" : 
                                        "bg-neutral-100"
                                    }`}
                                >
                                    {step.status === "completed" ? (
                                        <CheckIcon className="w-4 h-4 text-white" />
                                    ) : (
                                        <span className={`font-medium text-sm ${
                                            step.status === "active" ? "text-white" : "text-[#49454f]"
                                        }`}>
                                            {step.id}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs mt-1 text-gray-500">{step.label}</span>
                            </div>

                            {index < stepperData.length - 1 && (
                                <div
                                    className={`w-10 h-0.5 ${
                                        step.status === "completed" ? "bg-[#e83333]" : "bg-[#e3e3e3]"
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}