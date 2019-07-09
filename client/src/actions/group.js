import axios from "axios";
import { FETCH_GROUP } from "./types";
import { API_BASE } from "../config.json";

/**
 * @summary generates the options to use with a request. this is a function
 *          and not a const because the document.cookie may change
 */
function config() {
    return {
        baseURL: "http://localhost:8080",
        headers: {
            Authorization:
                "Bearer " + document.cookie.match(/x-auth=(\S+);/)[1],
        },
    };
}

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = groupID => async dispatch => {
    try {
        const response = await axios.get("/groups/" + groupID, config());

        dispatch({ type: FETCH_GROUP, payload: response.data });
    } catch (err) {
        console.error(err);
    }
};

/**
 * @summary Redux action creator to create a group
 */
export const createGroup = ({ name, premium }) => async dispatch => {
    try {
        const response = await axios.post(
            "/groups/new",
            { groupName: name, premium },
            config()
        );

        dispatch({ type: FETCH_GROUP, payload: response.data });
    } catch (err) {
        console.error(JSON.stringify(err));
    }
};
