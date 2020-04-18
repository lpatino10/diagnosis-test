import React, { useEffect, useState } from 'react';
import useDataApi from 'use-data-api';
import { ButtonSelection } from '../ButtonSelection/ButtonSelection';
import { getApiBaseEndpoint } from '../../utils';

export const DiagnosisSelect = ({ symptom, diagnosisGuess, onSelect }) => {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [buttonData, setButtonData] = useState([]);

  const diagnosesBySelectionCountEndpoint = `${getApiBaseEndpoint()}/symptoms/${symptom}/diagnoses`;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(diagnosesBySelectionCountEndpoint, []);
  useEffect(() => {
    doFetch(diagnosesBySelectionCountEndpoint);
    setDiagnosisList(data);
  }, [data, doFetch, isError, isLoading, diagnosesBySelectionCountEndpoint]);

  useEffect(() => {
    const filteredDiagnoses = diagnosisList
      .filter(diagnosis => diagnosis.name !== diagnosisGuess)
      .map(diagnosis => ({
        label: diagnosis.name,
        value: diagnosis.name,
      }));

    setButtonData(filteredDiagnoses);
  }, [diagnosisGuess, diagnosisList]);

  const onButtonSelect = (value) => {
    onSelect(value);
  };

  return (
    <>
      <p>
        Sorry about that. Which one of the following diagnoses is most accurate for you?
      </p>
      <ButtonSelection buttonData={buttonData} onSelect={onButtonSelect} />
    </>
  );
};
