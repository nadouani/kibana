/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Fragment } from 'react';
import { EuiCallOut, EuiFieldText, EuiFormRow, EuiFieldPassword, EuiSpacer, EuiText } from '@elastic/eui';
import { ActionConnectorFieldsProps } from '../../../../types';
import { TheHiveActionConnector } from '.././types';

const TheHiveActionConnectorFields: React.FunctionComponent<
  ActionConnectorFieldsProps<TheHiveActionConnector>
> = ({ errors, action, editActionConfig, editActionSecrets, readOnly }) => {

  const { apiUrl } = action.config;
  const { apiKey } = action.secrets;

  const isApiUrlInvalid: boolean = errors.apiUrl.length > 0 && apiUrl !== undefined;
  const isApiKeyInvalid: boolean = errors.apiKey.length > 0 && apiKey !== undefined;

  return (
    <Fragment>
      <EuiFormRow
        id="connector-thehive-apiUrl"
        fullWidth
        error={errors.apiUrl}
        isInvalid={isApiUrlInvalid}
        label="TheHive URL"
      >
        <EuiFieldText
          fullWidth
          name="apiUrl"
          value={apiUrl || ''}
          isInvalid={isApiUrlInvalid}
          data-test-subj="thehiveApiUrlInput"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            editActionConfig('apiUrl', e.target.value);
          }}
          onBlur={() => {
            if (!apiUrl) {
              editActionConfig('apiUrl', '');
            }
          }}
        />
      </EuiFormRow>
      <EuiSpacer size="m" />
      <EuiFormRow
        id="connector-thehive-apiKey"
        fullWidth
        error={errors.apiKey}
        isInvalid={isApiKeyInvalid}
        label="TheHive API key"
      >
        <EuiFieldPassword
          fullWidth
          isInvalid={isApiKeyInvalid}
          name="connector-thehive-apiKey"
          value={apiKey || ''}
          data-test-subj="thehiveApiSecretInput"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            editActionSecrets('apiKey', e.target.value);
          }}
          onBlur={() => {
            if (!apiKey) {
              editActionConfig('apiKey', '');
            }
          }}
        />
      </EuiFormRow>
    </Fragment>
  )
}

// eslint-disable-next-line import/no-default-export
export { TheHiveActionConnectorFields as default };
