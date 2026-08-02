import React from 'react';
import ServiceDetailPage from '@/features/marketing/components/services/ServiceDetailPage';
import { SERVICES } from '@/features/marketing/content/servicesConfig';

const EmployeeBootcampPage: React.FC = () => {
  const svc = SERVICES.find((s) => s.id === 'bootcamp')!;
  return <ServiceDetailPage svc={svc} />;
};

export default EmployeeBootcampPage;
