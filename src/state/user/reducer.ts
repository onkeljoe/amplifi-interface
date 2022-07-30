import { createReducer } from "@reduxjs/toolkit";
import { updateVersion } from "../global/actions";
import {
  updateMatchesDarkMode,
  updateUserDarkMode,
  toggleURLWarning,
  updateTwitterAccount,
  updateLastSelectedProtocolID,
  updateAmplifiAirdropList,
} from "./actions";

const currentTimestamp = () => new Date().getTime();

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  twitterAccount?: string;

  userDarkMode: boolean | null; // the user's choice for dark mode or light mode
  matchesDarkMode: boolean; // whether the dark mode media query matches

  timestamp: number;
  URLWarningVisible: boolean;

  lastSelectedProtocolID: string | undefined;

  amplifiAirdrop: any;
}

export const initialState: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  lastSelectedProtocolID: undefined,
  amplifiAirdrop: {}
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible;
    })
    .addCase(updateTwitterAccount, (state, { payload: { twitterAccount } }) => {
      state.twitterAccount = twitterAccount;
    })
    .addCase(
      updateLastSelectedProtocolID,
      (state, { payload: { protocolID } }) => {
        state.lastSelectedProtocolID = protocolID;
      }
    ).addCase(
      updateAmplifiAirdropList,
      (state, {payload: { amplifiAirdrop }}) => {
        state.amplifiAirdrop = amplifiAirdrop
      }
    )
);
