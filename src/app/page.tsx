'use client';

import { useEffect, useState } from 'react';

import Jet from '@/interfaces/Jet';
import Comparison from '@/interfaces/Comparison';

import { requestJets } from '@/services/jet-service';
import { requestJetComparison } from '@/services/compare-service';

import AvailableJetsTable from '@/components/AvailableJetsTable/AvailableJetsTable';
import JetComparisonControls from '@/components/JetComparisonControls/JetComparisonControls';

const CharterJetComparison = () => {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loadingAvailableJets, setLoadingAvailableJets] = useState<boolean>(true);
  const [selectedJets, setSelectedJets] = useState<number[]>([]);
  const [criterium, setCriterium] = useState<string>("fuel efficiency");
  const [loadingComparison, setLoadingComparison] = useState<boolean>(false);
  const [showComparisonResultsTable, setShowComparisonResultsTable] = useState<boolean>(false);
  const [comparisonResults, setComparisonResults] = useState<Comparison[]>([])
  
  const [error, setError] = useState<String>("");

  useEffect(
    () => {
      async function fetchJetList() {
        try {
          const response = await requestJets();
          if (!response.error) {
            setJets(response)
          }
          else {
            setError(response.error)
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoadingAvailableJets(false);
        }
      }
      fetchJetList();
    }
    , []);

  const initiateJetComparison = async () => {
    if (selectedJets.length === 0) {
      setError('Please select at least one jet to compare.');
      return;
    }

    setLoadingComparison(true);
    setError("");

    try {
      const response = await requestJetComparison(selectedJets, criterium);
      if (!response.error) {
        setComparisonResults(response);
        setShowComparisonResultsTable(true);
      } else {
        setError(response.error);
        setShowComparisonResultsTable(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during the comparison.");
      setShowComparisonResultsTable(false);
    } finally {
      setLoadingComparison(false);
    }
  };

  useEffect(() => console.log(comparisonResults), [comparisonResults]);

  return (
    <div id="charter-jet-container">
      <h1>Top 10 Charter Jets</h1>
      {!loadingAvailableJets &&
        <AvailableJetsTable
          jets={jets}
          setSelectedJets={setSelectedJets}>
        </AvailableJetsTable>}

        <JetComparisonControls
        selectedJets={selectedJets}
        setLoadingComparison={setLoadingComparison}
        initiateJetComparison={initiateJetComparison}
        criterium={criterium}
        setCriterium={setCriterium}>
      </JetComparisonControls>
    </div>
  );
};

export default CharterJetComparison;
