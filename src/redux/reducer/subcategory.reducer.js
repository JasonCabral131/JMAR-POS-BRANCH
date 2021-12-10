import { subcategoryConstant } from "../constant";
const initialState = {
  subcategory: [],
  archived: [],
  loading: false,
};

const subcategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case subcategoryConstant.SUBCATEGORY_REQUEST:
      return (state = {
        ...state,
        loading: true,
      });
    case subcategoryConstant.SUBCATEGORY_CREATE_SUCCESS:
      return (state = {
        ...state,
        loading: false,
        subcategory: [...state.subcategory, action.payload.subcategory],
      });
    case subcategoryConstant.SUBCATEGORY_CREATE_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case subcategoryConstant.GET_SUBCATEGORY_SUCCESS:
      return (state = {
        ...state,
        subcategory: action.payload.subcategory,
        loading: false,
      });
    case subcategoryConstant.GET_SUBCATEGORY_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    case subcategoryConstant.GET_DELETED_SUBCATEGORY_SUCCESS:
      return (state = {
        ...state,
        archived: action.payload.archived,
        loading: false,
      });
    case subcategoryConstant.GET_DELETED_SUBCATEGORY_FAIL:
      return (state = {
        ...state,
        loading: false,
      });
    default:
      return state;
  }
};

export default subcategoryReducer;
