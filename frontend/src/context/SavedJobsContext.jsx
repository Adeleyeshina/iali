import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

const SavedJobsContext = createContext(null);

const STORAGE_KEY = 'iali_saved_jobs';

function readSavedJobIdsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function SavedJobsProvider({ children }) {
  const [savedJobIds, setSavedJobIds] = useState(readSavedJobIdsFromStorage);
  const [savedJobs, setSavedJobs] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Sync across browser tabs or windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        setSavedJobIds(readSavedJobIdsFromStorage());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isSaved = useCallback(
    (jobId) => {
      if (!jobId) return false;
      return savedJobIds.includes(jobId);
    },
    [savedJobIds]
  );

  const toggleSaveJob = useCallback(
    (jobId, explicitState) => {
      if (!jobId) return false;

      setSavedJobIds((prev) => {
        const currentlySaved = prev.includes(jobId);
        const shouldSave = explicitState !== undefined ? explicitState : !currentlySaved;

        let next;
        if (shouldSave) {
          next = currentlySaved ? prev : [...prev, jobId];
        } else {
          next = prev.filter((id) => id !== jobId);
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        // If savedJobs list is currently loaded and we are un-saving, prune from list
        if (!shouldSave) {
          setSavedJobs((currentList) =>
            currentList ? currentList.filter((j) => j.id !== jobId) : currentList
          );
        }

        return next;
      });
    },
    []
  );

  const loadSavedJobs = useCallback(async () => {
    const currentIds = readSavedJobIdsFromStorage();
    if (currentIds.length === 0) {
      setSavedJobs([]);
      return [];
    }

    try {
      setLoadingSaved(true);
      const res = await api(`/api/jobs?limit=50&ids=${currentIds.join(',')}`);
      const list = Array.isArray(res) ? res : res.jobs || [];
      setSavedJobs(list);
      return list;
    } catch {
      setSavedJobs([]);
      return [];
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  const value = {
    savedJobIds,
    savedCount: savedJobIds.length,
    savedJobs,
    loadingSaved,
    isSaved,
    toggleSaveJob,
    loadSavedJobs,
  };

  return <SavedJobsContext.Provider value={value}>{children}</SavedJobsContext.Provider>;
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
}
