import React, { useEffect, useState } from 'react';
import useDataApi from 'use-data-api';
import './DiagnosisComparison.scss';
import { ButtonSelection } from '../ButtonSelection/ButtonSelection';
import { getApiBaseEndpoint } from '../../utils';

export const DiagnosisComparison = ({ symptom, onRestartButtonClick }) => {
  const [diagnosisList, setDiagnosisList] = useState([]);

  const diagnosesBySelectionCountEndpoint = `${getApiBaseEndpoint()}/symptoms/${symptom}/diagnoses`;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(diagnosesBySelectionCountEndpoint, []);
  useEffect(() => {
    doFetch(diagnosesBySelectionCountEndpoint);
    setDiagnosisList(data);
  }, [data, doFetch, isError, isLoading, diagnosesBySelectionCountEndpoint]);

  const buttonData = [
    {
      label: 'Start over',
      value: 'start-over',
    },
  ];

  return (
    <>
      <p>Great! Thanks for using the tool.</p>
      <p>Diagnosis frequencies for <b>{symptom}</b>:</p>
      <div className="frequencies">
        {diagnosisList.map(diagnosis => {
          return (
            <p key={diagnosis.name}>
              {`${diagnosis.name}: ${diagnosis.selection_count}`}
            </p>
          );
        })}
      </div>
      <ButtonSelection buttonData={buttonData} onSelect={onRestartButtonClick} />
    </>
  );
};
