import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// Define the Reducers that will always be present in the application
const staticReducers = {};

// Configure the store
export default function configureStore(initialState) {
    const composeEnhancers =  compose;
    const store = createStore(() => { return {}; }, composeEnhancers(
        applyMiddleware(thunk)
    ));

    // Add a dictionary to keep track of the registered async reducers
    store.asyncReducers = {}

    // Create an inject reducer function
    // This function adds the async reducer, and creates a new combined reducer
    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer
        const newReducer=createReducer(store.asyncReducers);
        store.replaceReducer(newReducer);
    }

    // Return the modified store
    return store
}

function createReducer(asyncReducers) {

        return combineReducers({
            ...staticReducers,
            ...asyncReducers
        })
    
}