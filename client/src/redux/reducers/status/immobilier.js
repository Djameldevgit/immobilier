import { GLOBALTYPES } from "../../actions/globalTypes";




const initialState = {
  vente: false,
  location: false,
  locationvacances: false,
  echange: false,
  cherchelocation: false,
  chercheachat: false,
  smartphone:false,
};

const statusimmobilier= (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.VENTE:
      return { ...state, vente: action.payload };
    case GLOBALTYPES.LOCATION:
      return { ...state, location: action.payload };
    case GLOBALTYPES.LOCATIONVACANCES:
      return { ...state, locationvacances: action.payload };
    case GLOBALTYPES.ECHANGE:
      return { ...state, echange: action.payload };
    case GLOBALTYPES.CHERCHELOCATION:
      return { ...state, cherchelocation: action.payload };
    case GLOBALTYPES.CHERCHEACHAT:
      return { ...state, chercheachat: action.payload };
      case GLOBALTYPES.SMARTPHONE:
        return { ...state, smartphone: action.payload };

    default:
      return state;
  }
};

export default statusimmobilier;
