import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Users,
  MapPin,
  Mail,
  Phone,
  Copy,
  MessageSquare,
} from 'lucide-react';
import EmptyState from '../../components/EmptyState.jsx';
import MessageModal from '../../components/MessageModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { copyToClipboard } from '../../lib/clipboard.js';
import { api } from '../../lib/api.js';

const STAGES = ['All', 'Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Withdrawn'];

// Recruiter applicant pipeline and stage progression screen
export default function JobApplicants() {
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState(null);
  const [activeStage, setActiveStage] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [messageCandidate, setMessageCandidate] = useState(null);
  const toast = useToast();

  const loadData = () => {
    setLoading(true);
    api(`/api/jobs/${jobId}/applications`)
      .then((res) => {
        setJob(res.job);
        setApplications(res.applications || []);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load applicants');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [jobId]);

  const handleUpdateStatus = async (appId, newStatus, rejected = false) => {
    try {
      setUpdatingId(appId);
      await api(`/api/jobs/applications/${appId}/status`, {
        method: 'PATCH',
        body: { status: newStatus, rejected },
      });
      toast.success(`Application updated to ${rejected ? 'Rejected' : newStatus}`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = (applications || []).filter((app) => {
    if (activeStage === 'All') return true;
    return app.status === activeStage && !app.rejected;
  });

  return (
    <div>
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black mb-3 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all posted jobs</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-1">
            Applicants for {job?.title || 'Job'}
          </h1>
          <p className="text-xs md:text-sm text-zinc-500">
            Total {applications?.length || 0} candidate applications received.
          </p>
        </div>

        <Link
          to={`/jobs/${jobId}`}
          className="self-start px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition flex items-center gap-1.5 shadow-xs"
        >
          <span>View Live Job Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </Link>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
        {STAGES.map((stage) => {
          const count =
            stage === 'All'
              ? applications?.length || 0
              : applications?.filter((a) => a.status === stage && !a.rejected).length || 0;

          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeStage === stage
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>{stage}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeStage === stage ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      )}

      {!loading && filteredApps.length === 0 && (
        <EmptyState
          icon={Users}
          title={`No candidates in ${activeStage}`}
          hint="Candidates who apply will appear here. You can advance candidates across hiring stages in real time."
        />
      )}

      {!loading && (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const cand = app.candidate || {};
            const prof = cand.profile || {};

            return (
              <div
                key={app.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <b className="text-base font-bold text-zinc-900">{cand.name || 'Candidate'}</b>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.rejected
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {app.rejected ? 'Rejected' : app.status}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-zinc-600 font-medium mb-1.5 flex items-center gap-1 flex-wrap">
                    <span>{prof.headline || 'Job Seeker'}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{prof.city || 'Lagos, Nigeria'}</span>
                    </span>
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cand.email, 'Candidate email copied!')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition cursor-pointer"
                      title="Click to copy email"
                    >
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{cand.email}</span>
                      <Copy className="w-3 h-3 text-zinc-400" />
                    </button>

                    {cand.phone && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cand.phone, 'Candidate phone number copied!')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition cursor-pointer"
                        title="Click to copy phone"
                      >
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{cand.phone}</span>
                        <Copy className="w-3 h-3 text-zinc-400" />
                      </button>
                    )}

                    <span className="text-zinc-400">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(prof.skills || []).map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stage Action Controls */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => setMessageCandidate({ userId: cand.id, name: cand.name })}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Message</span>
                  </button>

                  <select
                    value={app.rejected ? 'Rejected' : app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Rejected') {
                        handleUpdateStatus(app.id, app.status, true);
                      } else {
                        handleUpdateStatus(app.id, val, false);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 bg-white focus:outline-none focus:border-zinc-950 transition cursor-pointer"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Viewed">Viewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Hired">Hired</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Candidate Modal */}
      <MessageModal
        isOpen={Boolean(messageCandidate)}
        onClose={() => setMessageCandidate(null)}
        candidate={messageCandidate}
        onSuccess={() => toast.success('Message sent to candidate!')}
      />
    </div>
  );
}
