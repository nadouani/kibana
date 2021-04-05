/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { lazy } from 'react';
import {
  ActionTypeModel,
  GenericValidationResult,
  ConnectorValidationResult,
} from '../../../../types';
import {
  TheHiveActionConnector,
  TheHiveConfig,
  TheHiveSecrets,
  TheHiveActionParams,
} from '.././types';
import thehiveSvg from './thehive.svg';
// import { hasMustacheTokens } from '../../../lib/has_mustache_tokens';

export function getActionType(): ActionTypeModel<
  TheHiveConfig,
  TheHiveSecrets,
  TheHiveActionParams
> {
  return {
    id: '.thehive',
    iconClass: thehiveSvg,
    selectMessage: 'Create an alert in TheHive.',
    actionTypeTitle: 'Send to TheHive',
    validateConnector: (
      action: TheHiveActionConnector
    ): ConnectorValidationResult<TheHiveConfig, TheHiveSecrets> => {
      const configErrors = {
        apiUrl: new Array<string>(),
      };
      const secretsErrors = {
        apiKey: new Array<string>(),
      };
      const validationResult = {
        config: { errors: configErrors },
        secrets: { errors: secretsErrors },
      };

      if (!action.config.apiUrl) {
        configErrors.apiUrl.push('TheHive URL is required.');
      }
      if (!action.secrets.apiKey) {
        secretsErrors.apiKey.push('TheHive API Key is required.');
      }
      return validationResult;
    },
    validateParams: (
      actionParams: TheHiveActionParams
    ): GenericValidationResult<
      Pick<TheHiveActionParams, 'title' | 'sourceRef' | 'type' | 'source'>
    > => {
      const errors = {
        title: new Array<string>(),
        sourceRef: new Array<string>(),
        type: new Array<string>(),
        source: new Array<string>()
      };
      const validationResult = { errors };
      if (!actionParams.title?.length) {
        errors.title.push('Summary is required.');
      }
      if (!actionParams.sourceRef?.length) {
        errors.title.push('Source reference is required.');
      }
      if (!actionParams.type?.length) {
        errors.title.push('Type is required.');
      }
      if (!actionParams.source?.length) {
        errors.title.push('Source is required.');
      }
      // if (actionParams.timestamp && !hasMustacheTokens(actionParams.timestamp)) {
      //   if (isNaN(Date.parse(actionParams.timestamp))) {
      //     const { nowShortFormat, nowLongFormat } = getValidTimestampExamples();
      //     errors.timestamp.push(
      //       i18n.translate(
      //         'xpack.triggersActionsUI.components.builtinActionTypes.pagerDutyAction.error.invalidTimestamp',
      //         {
      //           defaultMessage:
      //             'Timestamp must be a valid date, such as {nowShortFormat} or {nowLongFormat}.',
      //           values: {
      //             nowShortFormat,
      //             nowLongFormat,
      //           },
      //         }
      //       )
      //     );
      //   }
      // }
      return validationResult;
    },
    actionConnectorFields: lazy(() => import('./thehive_connectors')),
    actionParamsFields: lazy(() => import('./thehive_params')),
  };
}
