import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function BloodRequestDetails({ request, isLoading }) {
  const safeRequest = request || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Request Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            {isLoading ? <Skeleton className="h-5 w-3/4" /> : <p className="truncate">{safeRequest.name || '—'}</p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            {isLoading ? <Skeleton className="h-5 w-1/2" /> : <p>{safeRequest.phone || '—'}</p>}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          {isLoading ? <Skeleton className="h-5 w-full" /> : <p className="break-words">{safeRequest.address || '—'}</p>}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Blood Type</p>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : (
              <Badge variant="outline" className="text-sm">{safeRequest.bloodType || '—'}</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Urgency</p>
            {isLoading ? (
              <Skeleton className="h-6 w-20 rounded-md" />
            ) : (
              <Badge
                variant={safeRequest.urgency === "High" ? "destructive" : "default"}
                className="text-sm"
              >
                {safeRequest.urgency || '—'}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            {isLoading ? (
              <Skeleton className="h-5 w-2/3" />
            ) : (
              <p className="text-sm">
                {safeRequest.createdTime
                  ? new Date(safeRequest.createdTime).toLocaleString()
                  : '—'}
              </p>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-2/3" />
          ) : safeRequest.endTime && (
            <div>
              <p className="text-sm text-muted-foreground">End Time</p>
              <p className="text-sm">{new Date(safeRequest.endTime).toLocaleString()}</p>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground">Special Cases</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </>
            ) : (
              <>
                {safeRequest.pregnant && (
                  <Badge variant="secondary" className="text-xs">Pregnant</Badge>
                )}
                {safeRequest.servedCountry && (
                  <Badge variant="secondary" className="text-xs">Served Country</Badge>
                )}
                {safeRequest.disabled && (
                  <Badge variant="secondary" className="text-xs">Disabled</Badge>
                )}
                {!safeRequest.pregnant && !safeRequest.servedCountry && !safeRequest.disabled && (
                  <p className="text-sm">None</p>
                )}
              </>
            )}
          </div>
        </div>

        {!isLoading && safeRequest.componentRequests?.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Component Requests</p>
              <div className="space-y-2">
                {safeRequest.componentRequests.map((comp, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium truncate">{comp.componentType}</span>
                    <Badge className="text-xs">{comp.volume} units</Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Component Requests</p>
              <div className="space-y-2">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
