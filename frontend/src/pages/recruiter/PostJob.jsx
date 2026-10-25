import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';
import PostJobSteps from '../../components/recruiter/PostJobSteps.jsx';
import PostJobForm from '../../components/recruiter/PostJobForm.jsx';
import PostJobSuccess from '../../components/recruiter/PostJobSuccess.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Post a new job role screen for verified employers
export default function PostJob({ user: propUser }) {
  const auth = useAuth();
  const user = propUser !== undefined ? propUser : auth.user;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workMode: 'onsite',
    city: 'Lagos',
    clientName: '',
    requiredSkills: [],
  });
  const [createdJob, setCreatedJob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleCreateJob = async () => {
    if (posting) return;
    setPosting(true);

    try {
      setErrorMessage('');
      const response = await api('/api/jobs', {
        method: 'POST',
        body: formData,
      });
      setCreatedJob(response);
      toast.success('Role published successfully!');
    } catch (err) {
      setErrorMessage(err.message + ' — log in as a recruiter in a company first.');
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleSwitchToRemote = async () => {
    if (switching || !createdJob) return;
    setSwitching(true);

    try {
      const updatedJob = await api(`/api/jobs/${createdJob.id}/to-remote`, {
        method: 'PATCH',
        body: {},
      });
      setCreatedJob({ ...createdJob, ...updatedJob, notice: null });
      toast.success('Job switched to remote — now visible nationwide!');
    } catch (err) {
      toast.error(err.message || 'Failed to switch job to remote');
    } finally {
      setSwitching(false);
    }
  };

  const handleReset = () => {
    setCreatedJob(null);
    setFormData({
      title: '',
      description: '',
      workMode: 'onsite',
      city: 'Lagos',
      clientName: '',
      requiredSkills: [],
    });
  };

  return (
    <div className="max-w-[1120px] mx-auto my-4">
      <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Post a Job</h1>
          <Briefcase className="w-5 h-5 text-zinc-700" />
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mb-6">
          Publish verified openings to reach qualified candidates across Nigeria.
        </p>

        {user?.role === 'candidate' && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-indigo-700 shrink-0" />
              <b className="text-xs md:text-sm">Candidate Account Active</b>
            </div>
            <p className="text-xs mb-3 text-indigo-900/90">
              You are currently signed in as a candidate ({user.email}). Only verified recruiter accounts can publish live job posts on ialihub.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link
                className="px-3 py-1.5 rounded-lg bg-indigo-950 text-white text-xs font-semibold hover:bg-slate-900 transition inline-flex items-center gap-1 shadow-xs"
                to="/jobs"
              >
                <span>Browse jobs instead</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-50 transition"
                to="/login"
                state={{ from: '/post-job' }}
              >
                Switch to Recruiter Account
              </Link>
            </div>
          </div>
        )}

        <PostJobSteps currentStep={createdJob ? 3 : 1} />

        {createdJob ? (
          <PostJobSuccess
            createdJob={createdJob}
            onSwitchToRemote={handleSwitchToRemote}
            switching={switching}
            onReset={handleReset}
          />
        ) : (
          <PostJobForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateJob}
            posting={posting}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
}
