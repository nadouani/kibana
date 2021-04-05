/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Fragment } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiSelect, EuiSpacer } from '@elastic/eui';
import { ActionParamsProps } from '../../../../types';
import { TheHiveActionParams } from '.././types';
import { TextFieldWithMessageVariables } from '../../text_field_with_message_variables';

const TheHiveParamsFields: React.FunctionComponent<ActionParamsProps<TheHiveActionParams>> = ({
  actionParams,
  editAction,
  index,
  messageVariables,
  errors,
}) => {
  const {
    title,
    sourceRef,
    source,
    type,
    tags
  } = actionParams;

  return (
    <Fragment>
      <EuiFormRow
        id="thehiveAlertTitle"
        fullWidth
        error={errors.title}
        isInvalid={errors.title.length > 0 && title !== undefined}
        label="Title"
      >
        <TextFieldWithMessageVariables
          index={index}
          editAction={editAction}
          messageVariables={messageVariables}
          paramsProperty={'title'}
          inputTargetValue={title}
          errors={errors.title as string[]}
        />
      </EuiFormRow>
    </Fragment>
  )
}

// eslint-disable-next-line import/no-default-export
export { TheHiveParamsFields as default };
