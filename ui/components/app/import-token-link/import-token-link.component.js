import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { IMPORT_TOKEN_ROUTE } from '../../../helpers/constants/routes';
import Button from '../../ui/button';
import Box from '../../ui/box/box';
import { TextAlign } from '../../../helpers/constants/design-system';
import { detectNewTokens } from '../../../store/actions';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  getIsTokenDetectionSupported,
  getIsTokenDetectionInactiveOnMainnet,
} from '../../../selectors';

export default function ImportTokenLink() {
  const trackEvent = useContext(MetaMetricsContext);
  const t = useI18nContext();
  const history = useHistory();

  const isTokenDetectionSupported = useSelector(getIsTokenDetectionSupported);
  const isTokenDetectionInactiveOnMainnet = useSelector(
    getIsTokenDetectionInactiveOnMainnet,
  );

  const isTokenDetectionAvailable =
    isTokenDetectionSupported ||
    isTokenDetectionInactiveOnMainnet ||
    Boolean(process.env.IN_TEST);

  return (
    <Box className="import-token-link" textAlign={TextAlign.Center}>
      {isTokenDetectionAvailable && (
        <>
          <Button
            className="import-token-link__link"
            data-testid="refresh-list-button"
            type="link"
            onClick={() => detectNewTokens()}
          >
            {t('refreshList')}
          </Button>
          {t('or')}
        </>
      )}
      <Button
        className="import-token-link__link"
        data-testid="import-token-button"
        type="link"
        onClick={() => {
          history.push(IMPORT_TOKEN_ROUTE);
          trackEvent({
            event: MetaMetricsEventName.TokenImportButtonClicked,
            category: MetaMetricsEventCategory.Navigation,
            properties: {
              location: 'Home',
            },
          });
        }}
      >
        {isTokenDetectionAvailable
          ? t('importTokens')
          : t('importTokens').charAt(0).toUpperCase() +
            t('importTokens').slice(1)}
      </Button>
    </Box>
  );
}
