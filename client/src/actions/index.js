import axios from "axios";
import { FETCH_USER, FETCH_CLAIMS } from "./types";
import data from "../data/data.json";
export const fetchClaims = () => async (dispatch) => {
	try {
		const claims = data.claims;
		dispatch({ type: FETCH_CLAIMS, payload: claims });
	} catch (error) {}
};
export const fetchUser = () => async (dispatch) => {
	try {
		const response = await axios.get("/auth/me", {
			withCredentials: true
		});
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (error) {}
};

export const signUp = (body) => async (dispatch) => {
	try {
		const response = await axios.post("/auth/signup", body);
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (error) {}
};

export const logIn = (body) => async (dispatch) => {
	const response = await axios.post("/auth/login", body);
	dispatch({ type: FETCH_USER, payload: response.data });
};

export const logOut = () => async (dispatch) => {
	try {
		await axios.post("/auth/logout", {
			withCredentials: true
		});

		dispatch({ type: FETCH_USER, payload: undefined });
	} catch (error) {}
};

export const cancelAccount = () => async (dispatch) => {
	try {
		const response = await axios.delete("/user/delete", {
			withCredentials: true
		});

		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (e) {}
};

export const completeAccount = (body) => async (dispatch) => {
	try {
		const response = await axios.patch("/user/complete", body, {
			withCredentials: true
		});
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (e) {
		console.log(e.response);
	}
};
