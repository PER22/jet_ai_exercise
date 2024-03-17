import React from 'react';
import Jet from '@/interfaces/Jet';

interface AvailableJetsTableProps {
    jets: Jet[];
    setSelectedJets: React.Dispatch<React.SetStateAction<number[]>>;
}

const AvailableJetsTable: React.FC<AvailableJetsTableProps> = ({ jets, setSelectedJets }) => {

    const handleCheckboxChange = (jetId: number, isChecked: boolean) => {
        setSelectedJets(prevSelectedJets => {
            if (isChecked) {
                return prevSelectedJets.includes(jetId) ? prevSelectedJets : [...prevSelectedJets, jetId];
            } else {
                return prevSelectedJets.filter(id => id !== jetId);
            }
        });
    };

    return (
        <table id="jets-table">
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
                {jets && jets.map(jet => (<tr key={jet.id}>
                    <td><input type="checkbox" name={`checkbox-${jet.id}`} id={`${jet.id}`} onChange={(e) => handleCheckboxChange(jet.id, e.target.checked)} /> </td>
                    <td>{`${jet.name}`}</td>
                    <td>{`${jet.wingspan}`} </td>
                    <td>{`${jet.engines}`}</td>
                    <td>{`${jet.year}`}</td>
                </tr>))}
            </tbody>
        </table>
    );
};

export default AvailableJetsTable;
