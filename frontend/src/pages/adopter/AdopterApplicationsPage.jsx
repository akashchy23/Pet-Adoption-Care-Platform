import React, { useState, useEffect } from 'react';
import { adoptionApi } from '../../api/adoptionApi';
import { AdoptionRequestsTable } from '../../components/tables/AdoptionRequestsTable';
import { TabView } from '../../components/common/TabView';

export const AdopterApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await adoptionApi.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pendingCount = applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;

  const filtered = applications.filter((a) => {
    if (activeTab === 'pending') return a.status === 'Pending' || a.status === 'Under Review';
    if (activeTab === 'approved') return a.status === 'Approved';
    if (activeTab === 'completed') return a.status === 'Completed' || a.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          Adoption Applications
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Track the status of your submitted adoption questionnaires and shelter review updates.
        </p>
      </div>

      <TabView
        tabs={[
          { id: 'all', label: 'All Applications', count: applications.length },
          { id: 'pending', label: 'Under Review', count: pendingCount },
          { id: 'approved', label: 'Approved', count: approvedCount }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AdoptionRequestsTable applications={filtered} onRefresh={fetchApplications} />
    </div>
  );
};
