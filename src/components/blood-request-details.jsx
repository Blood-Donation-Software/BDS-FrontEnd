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
            <p className="text-sm text-muted-foreground">Patient Name</p>
            {isLoading ? <Skeleton className="h-5 w-3/4" /> : <p className="truncate">{safeRequest.profile?.name || safeRequest.name || '—'}</p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Personal ID</p>
            {isLoading ? <Skeleton className="h-5 w-1/2" /> : <p>{safeRequest.profile?.personalId || safeRequest.personalId || '—'}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            {isLoading ? <Skeleton className="h-5 w-1/2" /> : <p>{safeRequest.profile?.phone || safeRequest.phone || '—'}</p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Patient Blood Type</p>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : (
              <Badge variant="secondary" className="text-sm">{safeRequest.profile?.bloodType || '—'}</Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          {isLoading ? <Skeleton className="h-5 w-full" /> : (
            <p className="break-words">
              {safeRequest.profile ? 
                `${safeRequest.profile.address || ''}, ${safeRequest.profile.ward || ''}, ${safeRequest.profile.district || ''}, ${safeRequest.profile.city || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') 
                : safeRequest.address || '—'
              }
            </p>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Requested Blood Type</p>
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
          <div>
            <p className="text-sm text-muted-foreground">Required Date</p>
            {isLoading ? (
              <Skeleton className="h-5 w-2/3" />
            ) : (
              <p className="text-sm">
                {safeRequest.requiredDate
                  ? new Date(safeRequest.requiredDate).toLocaleDateString()
                  : safeRequest.endTime 
                  ? new Date(safeRequest.endTime).toLocaleDateString()
                  : '—'}
              </p>
            )}
          </div>
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

        {!isLoading && safeRequest.medicalConditions?.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {safeRequest.medicalConditions.map((condition, index) => {
                  // Convert enum to display format
                  const displayCondition = condition.replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, l => l.toUpperCase());
                  
                  return (
                    <Badge key={index} variant="outline" className="text-xs">
                      {displayCondition}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-md" />
                ))}
              </div>
            </div>
          </>
        )}

        {!isLoading && safeRequest.additionalMedicalInformation && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Medical Information</p>
              <p className="text-sm break-words bg-gray-50 p-3 rounded-md">
                {safeRequest.additionalMedicalInformation}
              </p>
            </div>
          </>
        )}

        {isLoading && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Medical Information</p>
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </>
        )}

        {!isLoading && safeRequest.additionalNotes && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
              <p className="text-sm break-words bg-gray-50 p-3 rounded-md">
                {safeRequest.additionalNotes}
              </p>
            </div>
          </>
        )}

        {isLoading && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Notes</p>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </>
        )}

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