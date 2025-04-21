const initialState = {
    modal: "",
    modalShow: false,
    modalData: {},
};

const modalreducers = (state = initialState, action) => {

    switch (action.type) {
        case "openModal":
            return {
                ...state, modalShow: true, ...action.data
            }
        case "closeModal":
            return { ...state, modalShow: false }
        default:
            return state;
    }
};

export default modalreducers;
