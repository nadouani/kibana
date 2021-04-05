/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { curry } from 'lodash';
import { schema, TypeOf } from '@kbn/config-schema';
import { ActionsConfigurationUtilities } from '../../actions_config';
import { Logger } from '../../../../../../src/core/server';
import { ActionType, ActionTypeExecutorOptions, ActionTypeExecutorResult } from '../../types';
import { postTheHiveAlert } from './api';

export type TheHiveActionType = ActionType<
  ActionTypeConfigType,
  ActionTypeSecretsType,
  ActionParamsType,
  unknown
>;

export type TheHiveActionTypeExecutorOptions = ActionTypeExecutorOptions<
  ActionTypeConfigType,
  ActionTypeSecretsType,
  ActionParamsType
>;

// config schema
export type ActionTypeConfigType = TypeOf<typeof ConfigSchema>;
const ConfigSchema = schema.object({
  apiUrl: schema.string(),
});

// Secret schema
export type ActionTypeSecretsType = TypeOf<typeof SecretsSchema>;
const SecretsSchema = schema.object({
  apiKey: schema.string(),
});

// Params schema
export type ActionParamsType = TypeOf<typeof ParamsSchema>;
const ParamsSchema = schema.object({
  title: schema.string(),
  sourceRef: schema.string(),
  type: schema.string(),
  source: schema.string(),
  description: schema.string(),
  tags: schema.maybe(
    schema.arrayOf(
      schema.string({
        validate: (tag) =>
          // Matches any space, tab or newline character.
          tag.match(/\s/g) ? `The tag ${tag} cannot contain spaces` : undefined,
      })
    )
  )
})

export const ActionTypeId = '.thehive'
// action type definition
export function getActionType({
  logger, configurationUtilities
}: {
  logger: Logger,
  configurationUtilities: ActionsConfigurationUtilities
}): TheHiveActionType {
  return {
    id: ActionTypeId,
    minimumLicenseRequired: 'basic',
    name: 'TheHive',
    validate: {
      config: ConfigSchema,
      secrets: SecretsSchema,
      params: ParamsSchema,
    },
    executor: curry(executor)({ logger, configurationUtilities }),
  }
}

// action executor
async function executor(
  {
    logger,
    configurationUtilities,
  }: { logger: Logger; configurationUtilities: ActionsConfigurationUtilities },
  execOptions: TheHiveActionTypeExecutorOptions
): Promise<ActionTypeExecutorResult<unknown>> {
  const actionId = execOptions.actionId;
  const config = execOptions.config;
  const secrets = execOptions.secrets;
  const params = execOptions.params;
  const services = execOptions.services;

  const apiUrl = config.apiUrl;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${secrets.apiKey}`
  };
  const data = getBodyForAlertAction(actionId, params);

  let response;
  try {
    response = await postTheHiveAlert(
      { apiUrl, data, headers, services },
      logger,
      configurationUtilities
    );
  } catch (err) {
    const message = 'error posting thehive event';
    logger.warn(`error thrown posting thehive event: ${err.message}`);
    return {
      status: 'error',
      actionId,
      message,
      serviceMessage: err.message,
    };
  }

  logger.debug(`response posting pagerduty event: ${response.status}`);
  if (response.status === 201) {
    return {
      status: 'ok',
      actionId,
      data: response.data,
    };
  }

  const message = `error posting thehive alert: unexpected status ${response.status}`;
  return {
    status: 'error',
    actionId,
    message,
  };
}

interface TheHiveAlertPayload {
  title: string;
  sourceRef: string;
  type: string;
  source: string;
  tags?: string[],
  description?: string;
}

function getBodyForAlertAction(actionId: string, params: ActionParamsType): TheHiveAlertPayload {

  const data: TheHiveAlertPayload = {
    ...params,
    sourceRef: actionId
  };

  return data;
}
