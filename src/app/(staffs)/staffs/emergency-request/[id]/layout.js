'use client';

import Progress from '@/components/progress/progress';
import { useBloodRequests } from '@/context/bloodRequest_context';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ProcessLayout({ children }) {
  const { findBloodRequest } = useBloodRequests();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      findBloodRequest(params.id);
    }
  }, [params?.id]);

  return(
    <>
        <Progress/>
        {children}
    </>
  );
}
