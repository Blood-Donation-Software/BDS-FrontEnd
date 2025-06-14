'use client';

import Progress from '@/components/progress/progress';
import { useBloodRequests } from '@/context/bloodRequest_context';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import BloodRequestDetails from '@/components/blood-request-details';

export default function ProcessLayout({ children }) {
  const { findBloodRequest, bloodRequest, isLoading } = useBloodRequests();
  const params = useParams();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (params?.id) {
      findBloodRequest(params.id);
    }
  }, [params?.id]);


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto relative">
        {bloodRequest && !bloodRequest.automation && <Progress />}
        {children}

        {/* Mobile toggle button */}
        <div className="md:hidden fixed bottom-4 right-4 z-10">
          <Sheet open={showDetails} onOpenChange={setShowDetails}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full shadow-lg">
                {showDetails ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelRightOpen className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 p-0">
              <SheetTitle></SheetTitle>
              <ScrollArea className="h-full p-6">
                <BloodRequestDetails request={bloodRequest} isLoading={isLoading} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Details Panel - hidden on mobile */}
          <Separator orientation="vertical" className="hidden md:block" />
          <ScrollArea className="hidden md:block w-full md:w-96 border-l p-6">
            <BloodRequestDetails request={bloodRequest} isLoading={isLoading} />
          </ScrollArea>
    </div>
  );
}