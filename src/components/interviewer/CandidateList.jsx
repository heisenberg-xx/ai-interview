import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const SortIcon = ({ active, order }) => {
    if (!active) return null;
    return order === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
}

export const CandidateList = ({ candidates, onSelectCandidate, selectedCandidateId, onSort, sortKey, sortOrder }) => {
 return (
  <div className="border border-white rounded-lg shadow-md overflow-hidden">
    <div className="grid grid-cols-5 p-4 border-b border-gray-300 font-bold text-sm text-gray-600">
      <button onClick={() => onSort('name')} className="col-span-3 text-left flex items-center space-x-1">
        <span>Name</span>
        <SortIcon active={sortKey === 'name'} order={sortOrder} />
      </button>
      <button onClick={() => onSort('finalScore')} className="col-span-2 text-right flex items-center justify-end space-x-1">
        <span>Score</span>
        <SortIcon active={sortKey === 'finalScore'} order={sortOrder} />
      </button>
    </div>
    <div className="max-h-[60vh] overflow-y-auto">
      {candidates.length > 0 ? (
        candidates.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCandidate(c.id)}
            className={`grid grid-cols-5 p-4 cursor-pointer transition-colors ${
              selectedCandidateId === c.id
                ? 'bg-blue-100'
                : 'hover:bg-gray-400 bg-white'
            }`}
          >
            <div className="col-span-3">
              <p className="font-semibold text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-600">{c.email}</p>
            </div>
            <div className="col-span-2 text-right font-bold text-lg flex items-center justify-end text-gray-900">
              {c.interview.finalScore}
            </div>
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-gray-500">No completed interviews.</p>
      )}
    </div>
  </div>
);

};
