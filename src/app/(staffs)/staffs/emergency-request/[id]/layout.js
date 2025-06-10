'use client';

import Progress from '@/components/progress/progress';
import { useBloodRequests } from '@/context/bloodRequest_context';
import { useParams } from 'next/navigation';
import { use, useEffect } from 'react';

export default function ProcessLayout({ children }) {
  const { findBloodRequest, bloodRequest, findRequiredBlood } = useBloodRequests();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      findBloodRequest(params.id);
    }
  }, [params?.id]);

  useEffect(() => {
    if(bloodRequest) findRequiredBlood();
  },[bloodRequest])

  return(
    <>
        <Progress/>
        {children}
    </>
  );
}
