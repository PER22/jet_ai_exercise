import React, { useState } from 'react';
import Jet from '@/interfaces/Jet';

interface AvailableJetsTableProps {
    jets: Jet[];
    setSelectedJets: React.Dispatch<React.SetStateAction<number[]>>;
}

const AvailableJetsTable: React.FC<AvailableJetsTableProps> = ({ jets, setSelectedJets }) => {
    const [hoveredJetId, setHoveredJetId] = useState<number | null>(null);

    const handleMouseEnter = (jetId: number) => {
        setHoveredJetId(jetId);
    };

    const handleMouseLeave = () => {
        setHoveredJetId(null);
    };

    const handleCheckboxChange = (jetId: number, isChecked: boolean) => {
        setSelectedJets(prevSelectedJets => {
            if (isChecked) {
                return prevSelectedJets.includes(jetId) ? prevSelectedJets : [...prevSelectedJets, jetId];
            } else {
                return prevSelectedJets.filter(id => id !== jetId);
            }
        });
    };

    const toggleCheckbox = (e: React.MouseEvent<HTMLTableRowElement>, jetId: number) => {
        if (e.target === document.getElementById(`checkbox-${jetId}`)) {
            return;
        }

        const checkbox = document.getElementById(`checkbox-${jetId}`) as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            handleCheckboxChange(jetId, checkbox.checked);
        }
    };

    return (
        <div id="jets-table">
            <h1>Top 10 Charter Jets</h1>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Wingspan (ft)</th>
                        <th>Engines</th>
                        <th>Manufactured</th>
                    </tr>
                </thead>
                <tbody id="jet-table-body">
                    {jets && jets.map(jet => (
                        <tr 
                            key={jet.id} 
                            onClick={(e) => toggleCheckbox(e, jet.id)}
                            onMouseEnter={() => handleMouseEnter(jet.id)}
                            onMouseLeave={handleMouseLeave}
                            style={{ backgroundColor: hoveredJetId === jet.id ? '#f2f2f270' : 'transparent' }}
                        >
                            <td>
                                <input 
                                    type="checkbox" 
                                    name={`checkbox-${jet.id}`} 
                                    id={`checkbox-${jet.id}`} 
                                    onChange={(e) => handleCheckboxChange(jet.id, e.target.checked)} 
                                />
                            </td>
                            <td>{jet.name}</td>
                            <td>{jet.wingspan}</td>
                            <td>{jet.engines}</td>
                            <td>{jet.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AvailableJetsTable;
