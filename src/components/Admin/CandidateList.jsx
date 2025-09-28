import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const SortIcon = ({ active, order }) => {
  if (!active) return null;
  return order === 'asc' ? <ArrowUp className="h-4 w-4 ml-1 inline-block" /> : <ArrowDown className="h-4 w-4 ml-1 inline-block" />;
};

 const CandidateList = ({
  candidates,
  onSelectCandidate,
  selectedCandidateId,
  onSort,
  sortKey,
  sortOrder,
}) => {
  return (
    <div className="border border-white rounded-lg shadow-md  max-w-md w-full">
      <table className="w-full">
        <thead className="border-b border-white">
          <tr className='flex w-full'>
            <th
              colSpan={3}
              onClick={() => onSort('name')}
              className="flex-1 p-4 cursor-pointer flex items-center text-white"
            >
              Name
              <SortIcon active={sortKey === 'name'} order={sortOrder} />
            </th>
            <th
              colSpan={2}
              onClick={() => onSort('finalScore')}
              className="flex-1 p-4 cursor-pointer flex justify-center items-center text-white"
            >
              Score
              <SortIcon active={sortKey === 'finalScore'} order={sortOrder} />
            </th>
          </tr>
        </thead>
        <tbody className=" overflow-y-auto">
          {candidates.length > 0 ? (
            candidates.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectCandidate(c.id)}
                className={`cursor-pointer transition-colors flex ${
                  selectedCandidateId === c.id
                    ? 'bg-white/5'
                    : 'hover:bg-white/10 bg-inherit'
                }`}
              >
                <td colSpan={3} className="flex-1 p-4">
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-sm text-gray-600">{c.email}</p>
                </td>
                <td colSpan={2} className=" flex-1 p-4 text-center font-bold text-lg text-white">
                  {c.interview.finalScore}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No completed interviews.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;
