const initialState = {
    sessions: []
};

const walletconnectReducer = (state = initialState, action) => {

    switch (action.type) {
        case "setSession":
            return{
                ...state,
                sessions: action.data
            }
        default:
            return state;
    }
};

export default walletconnectReducer;
