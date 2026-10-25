import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import ApplicationTimelineModal from '../../components/ApplicationTimelineModal.jsx';
import ApplicationsStats from '../../components/candidate/applications/ApplicationsStats.jsx';
import ApplicationsFilterBar from '../../components/candidate/applications/ApplicationsFilterBar.jsx';
import ApplicationItemCard from '../../components/candidate/applications/ApplicationItemCard.jsx';
import SavedJobsTab from '../../components/candidate/applications/SavedJobsTab.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

// Application tracker and status pipeline for candidates
export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'saved' ? 'saved' : 'applications'
  );
  const [applications, setApplications] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [timelineTarget, setTimelineTarget] = useState(null);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [confirmWithdrawTarget, setConfirmWithdrawTarget] = useState(null);
  const toast = useToast();

  const loadApplications = () => {
    api('/api/applications/mine')
      .then((data) => setApplications(data))
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdrawConfirm = async () => {
    if (!confirmWithdrawTarget) return;
    try {
      setWithdrawingId(confirmWithdrawTarget.id);
      await api(`/api/applications/${confirmWithdrawTarget.id}/withdraw`, { method: 'PATCH' });
      toast.success('Application withdrawn successfully');
      setConfirmWithdrawTarget(null);
      loadApplications();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    if (!applications) return [];

    let list = applications.filter((app) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Rejected') return app.rejected;
      return app.status === statusFilter && !app.rejected;
    });

    return list.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [applications, statusFilter, sortBy]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'saved' ? { tab: 'saved' } : {});
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Application Tracker</h1>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Real-time stage tracking directly from verified Nigerian employers.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white text-xs font-bold transition self-start sm:self-auto shadow-md shadow-indigo-500/20"
        >
          <span>Find more jobs</span>
          <ArrowRight className="w-3.5 h-3.5 text-coral-300" />
        </Link>
      </div>

      <ApplicationsStats applications={applications} />

      <ApplicationsFilterBar
        activeTab={activeTab}
        onSwitchTab={switchTab}
        applicationsCount={applications ? applications.length : 0}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {activeTab === 'saved' ? (
        <SavedJobsTab />
      ) : (
        <div className="space-y-3">
          {filteredAndSortedApplications.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-xs md:text-sm text-zinc-500">
              No applications in this category.
            </div>
          ) : (
            filteredAndSortedApplications.map((app) => (
              <ApplicationItemCard
                key={app.id}
                app={app}
                onOpenTimeline={(target) => setTimelineTarget(target)}
                onRequestWithdraw={(target) => setConfirmWithdrawTarget(target)}
                withdrawingId={withdrawingId}
              />
            ))
          )}
        </div>
      )}

      {timelineTarget && (
        <ApplicationTimelineModal
          application={timelineTarget}
          onClose={() => setTimelineTarget(null)}
        />
      )}

      {confirmWithdrawTarget && (
        <ConfirmModal
          isOpen={Boolean(confirmWithdrawTarget)}
          title="Withdraw Application?"
          message={`Are you sure you want to withdraw your application for "${confirmWithdrawTarget.job?.title || 'this role'}"? The recruiter will be notified and your submission will be archived.`}
          confirmLabel="Yes, withdraw"
          confirmVariant="danger"
          loading={withdrawingId === confirmWithdrawTarget.id}
          onConfirm={handleWithdrawConfirm}
          onClose={() => setConfirmWithdrawTarget(null)}
        />
      )}
    </div>
  );
}
