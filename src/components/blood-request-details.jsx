import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { convertBloodType } from "@/utils/utils";
import { useLanguage } from "@/context/language_context";

export default function BloodRequestDetails({ request, isLoading }) {
  const { t } = useLanguage();
  const safeRequest = request || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t?.createBloodRequest?.bloodRequestDetails?.title || "Request Details"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.patientName || "Patient Name"}</p>
            {isLoading ? <Skeleton className="h-5 w-3/4" /> : <p className="truncate">{safeRequest.profile?.name || safeRequest.name || '—'}</p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.personalId || "Personal ID"}</p>
            {isLoading ? <Skeleton className="h-5 w-1/2" /> : <p>{safeRequest.profile?.personalId || safeRequest.personalId || '—'}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.phone || "Phone"}</p>
            {isLoading ? <Skeleton className="h-5 w-1/2" /> : <p>{safeRequest.profile?.phone || safeRequest.phone || '—'}</p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.patientBloodType || "Patient Blood Type"}</p>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : (
              <Badge variant="secondary" className="text-sm">{convertBloodType(safeRequest.profile?.bloodType) || '—'}</Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.address || "Address"}</p>
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
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.requestedBloodType || "Requested Blood Type"}</p>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-md" />
            ) : (
              <Badge variant="outline" className="text-sm">{convertBloodType(safeRequest.bloodType) || '—'}</Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.urgency || "Urgency"}</p>
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
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.created || "Created"}</p>
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
            <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.requiredDate || "Required Date"}</p>
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
          <p className="text-sm text-muted-foreground">{t?.createBloodRequest?.bloodRequestDetails?.specialCases || "Special Cases"}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </>
            ) : (
              <>
                {safeRequest.pregnant && (
                  <Badge variant="secondary" className="text-xs">{t?.createBloodRequest?.bloodRequestDetails?.pregnant || "Pregnant"}</Badge>
                )}
                {safeRequest.servedCountry && (
                  <Badge variant="secondary" className="text-xs">{t?.createBloodRequest?.bloodRequestDetails?.servedCountry || "Served Country"}</Badge>
                )}
                {safeRequest.disabled && (
                  <Badge variant="secondary" className="text-xs">{t?.createBloodRequest?.bloodRequestDetails?.disabled || "Disabled"}</Badge>
                )}
                {!safeRequest.pregnant && !safeRequest.servedCountry && !safeRequest.disabled && (
                  <p className="text-sm">{t?.createBloodRequest?.bloodRequestDetails?.none || "None"}</p>
                )}
              </>
            )}
          </div>
        </div>

        {!isLoading && safeRequest.medicalConditions?.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.medicalConditions || "Medical Conditions"}</p>
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
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.medicalConditions || "Medical Conditions"}</p>
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
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.additionalMedicalInformation || "Additional Medical Information"}</p>
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
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.additionalMedicalInformation || "Additional Medical Information"}</p>
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </>
        )}

        {!isLoading && safeRequest.additionalNotes && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.additionalNotes || "Additional Notes"}</p>
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
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.additionalNotes || "Additional Notes"}</p>
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </>
        )}

        {!isLoading && safeRequest.componentRequests?.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.componentRequests || "Component Requests"}</p>
              <div className="space-y-2">
                {safeRequest.componentRequests.map((comp, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="font-medium truncate">{comp.componentType}</span>
                    <Badge className="text-xs">{comp.volume} {t?.createBloodRequest?.bloodRequestDetails?.units || "units"}</Badge>
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
              <p className="text-sm text-muted-foreground mb-2">{t?.createBloodRequest?.bloodRequestDetails?.componentRequests || "Component Requests"}</p>
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