import React, { useState } from 'react';
import Jet from '@/interfaces/Jet';
import AvailableJetsTableRow from './AvailableJetsTableRow/AvailableJetsTableRow';

interface AvailableJetsTableProps {
    jets: Jet[];
    setJets: React.Dispatch<React.SetStateAction<Jet[]>>;
    setSelectedJets: React.Dispatch<React.SetStateAction<number[]>>;
    loadingAvailableJets: boolean;
}

const AvailableJetsTable: React.FC<AvailableJetsTableProps> = ({ jets, setJets, setSelectedJets, loadingAvailableJets }) => {
    const [hoveredJetId, setHoveredJetId] = useState<number | null>(null);
    const [currentlySortedBy, setCurrentlySortedBy] = useState<string | null>(null);
    

    const sortJetsByColumn = (columnName: keyof Jet, currentlySortedBy: string | null) => {
        if(columnName === currentlySortedBy){
            setJets(jets=>[...jets].reverse());
        }
        else{
            setJets(unsortedJets => [...unsortedJets].sort((jetA: Jet, jetB: Jet)=> Number(jetA[columnName]) - Number(jetB[columnName]) ) );
            setCurrentlySortedBy(old => columnName);
        }
    };

    return (
        <div id="jets-table">
            <h1>Top 10 Charter Jets</h1>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th onClick={() => console.log('name')}>Name</th>
                        <th onClick={()=>sortJetsByColumn("wingspan", currentlySortedBy)} >Wingspan (ft)</th>
                        <th onClick={()=>sortJetsByColumn("engines", currentlySortedBy)} >Engines</th>
                        <th onClick={()=>sortJetsByColumn("year", currentlySortedBy)} >Manufactured</th>
                    </tr>
                </thead>
                <tbody id="jet-table-body">
                    {jets && jets.map(jet => (
                        <AvailableJetsTableRow
                            jet={jet}
                            hoveredJetId={hoveredJetId}
                            setHoveredJetId={setHoveredJetId}
                            setSelectedJets={setSelectedJets}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailableJetsTable;
