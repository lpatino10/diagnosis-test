import React, { useEffect, useState } from 'react';
import useDataApi from 'use-data-api';
import { ButtonSelection } from '../ButtonSelection/ButtonSelection';
import { displayNameToUrlName, getApiBaseEndpoint } from '../../utils';

const SYMPTOMS_ENDPOINT = `${getApiBaseEndpoint()}/symptoms`;

export const SymptomSelect = ({ onSelect }) => {
  const [symptoms, setSymptoms] = useState([]);

  const [{ data, isLoading, isError }, doFetch] = useDataApi(SYMPTOMS_ENDPOINT, []);

  useEffect(() => {
    doFetch(SYMPTOMS_ENDPOINT);
    setSymptoms(data);
  }, [data, doFetch, isError, isLoading]);

  const buttonData = symptoms.map(symptom => ({
    label: symptom,
    value: displayNameToUrlName(symptom),
  }));

  const onButtonSelect = (value) => {
    onSelect(value);
  };

  return (
    <div className="symptom-select">
      <p>Select your symptom:</p>
      <ButtonSelection buttonData={buttonData} onSelect={onButtonSelect} />
    </div>
  )
};
