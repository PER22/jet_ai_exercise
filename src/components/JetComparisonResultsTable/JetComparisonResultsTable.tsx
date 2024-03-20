import React from 'react';
import Comparison from '@/interfaces/Comparison';

const JetComparisonResultsTable = ({ comparisonResults }: { comparisonResults: Comparison[] }) => {
  return (
    <div id="comparison-results">
      <h1>Comparison Results</h1>
      <table id="results-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {comparisonResults && comparisonResults.map((result, index) => 
            <tr key={index}>
              <td>{result.rank}</td>
              <td>{result.name}</td>
              <td>{result.value}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default JetComparisonResultsTable;
