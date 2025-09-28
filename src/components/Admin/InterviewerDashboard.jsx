import React, { useState, useMemo } from 'react';
import { useInterviewStore } from '../../store/useStore.js';
import CandidateDetailView from './CandidateDetailView.jsx';
import { Input } from '../ui/Input.jsx';
import { Search } from 'lucide-react';
import CandidateList from './CandidateList.jsx';

 const AdminDashBoard = () => {
  const { candidates } = useInterviewStore();
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('finalScore');
  const [sortOrder, setSortOrder] = useState('desc');

  const completedCandidates = useMemo(() => {
    return candidates
      .filter(c => c.interview.status === 'COMPLETED')
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const valA = sortKey === 'name' ? a.name : a.interview.finalScore ?? 0;
        const valB = sortKey === 'name' ? b.name : b.interview.finalScore ?? 0;
        
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [candidates, searchTerm, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'finalScore' ? 'desc' : 'asc');
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
  <div className="flex flex-col w-full gap-8">
    <div className=" flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">Candidates</h2>
      <div className="relative mb-4 w-full max-w-md">
        <Input
          id="search-candidate"
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" border border-white rounded-lg text-white py-2 pl-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <CandidateList
        candidates={completedCandidates}
        onSelectCandidate={setSelectedCandidateId}
        selectedCandidateId={selectedCandidateId}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
    </div>
    <div className="">
      {selectedCandidate ? (
        <CandidateDetailView candidate={selectedCandidate} />
      ) : (
        <div className="flex items-center justify-center h-full  rounded-lg">
          <p className="text-gray-500 m-3">Select a candidate to view details.</p>
        </div>
      )}
    </div>
  </div>
);

};

export default AdminDashBoard;