import axios from "axios";
import { FETCH_CLAIMS, FETCH_GROUP } from "./types";

import claimsData from "../data/claims.json";

export const fetchClaims = () => async dispatch => {
    try {
        const claims = claimsData.claims;
        dispatch({ type: FETCH_CLAIMS, payload: claims });
    } catch (error) {}
};

export const createClaim = (summary, files) => async dispatch => {
    try {
        const claims = claimsData.claims;
        console.log("created claim");
        dispatch({ type: FETCH_CLAIMS, payload: claims });
    } catch (error) {}
};

export {
    fetchUser,
    signUp,
    logIn,
    logOut,
    cancelAccount,
    completeAccount,
} from "./user";

export {
    fetchGroup,
    createGroup,
} from "./group";
