import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import * as languageActions from '../redux/actions/languageAction';
import { Link } from 'react-router-dom';
 
function LanguageSelector() {
  const dispatch = useDispatch();
  const { auth, languageReducer } = useSelector(state => state);
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['language']);

  const handleLanguageChange = useCallback((language) => {
    switch (language) {
      case 'en':
        dispatch(languageActions.inglishLanguage(language, auth));
        setCookie('language', 'en', { path: '/' });
        break;
      case 'fr':
        dispatch(languageActions.franchLanguage(language, auth));
        setCookie('language', 'fr', { path: '/' });
        break;
      case 'ar':
        dispatch(languageActions.arabLanguage(language, auth));
        setCookie('language', 'ar', { path: '/' });
        break;
      case 'es':
        // handle 'es' case
        break;
      default:
        dispatch(languageActions.synchronizeLanguage(language, auth));
        setCookie('language', 'default', { path: '/' });
        break;
    }
  }, [auth, dispatch, setCookie]);

  useEffect(() => {
    const defaultLanguage = cookies.language || 'fr';
    handleLanguageChange(defaultLanguage);
  }, [cookies.language, handleLanguageChange]);

  return (
    <div className='language-component'>
    <Link to="/" className="dropdown-item" onClick={() => handleLanguageChange('ar')}>
      {t('Arabe', { lng: languageReducer.language })}
    </Link>
    <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('fr')}>
      {t('frances', { lng: languageReducer.language })}
    </Link>
    <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('en')}>
      {t('ingles', { lng: languageReducer.language })}
    </Link>
  </div>
  
  );
}

export default LanguageSelector;
