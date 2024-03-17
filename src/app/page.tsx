'use client';
import { use, useEffect, useState } from 'react';
import Jet from '@/interfaces/Jet';
import { requestJets } from '@/services/jet-service';
import AvailableJetsTable from '@/components/AvailableJetsTable/AvailableJetsTable';

const CharterJetComparison = () => {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loadingAvailableJets, setLoadingAvailableJets] = useState<boolean>(true);
  const [selectedJets, setSelectedJets] = useState<number[]>([]);
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

  //To check whether Jet index call worked
  useEffect(()=>console.log(jets) ,[jets]) 

  return (
    <div id="charter-jet-container">
      <h1>Top 10 Charter Jets</h1>
      {!loadingAvailableJets &&
        <AvailableJetsTable
          jets={jets}
          setSelectedJets={setSelectedJets}>
        </AvailableJetsTable>}
    </div>
  );
};

export default CharterJetComparison;
