import { atom, selector, atomFamily, selectorFamily } from "recoil";
import axios from "axios";

export const firstNameAtom = atom({
    key: "firstNameAtom",
    default: ""
})

export const lastNameAtom = atom({
    key: "lastNameAtom",
    default: ""
})

export const emailAtom = atom({
    key: "emailAtom",
    default: ""
})

export const usersAtom = atom({
    key: "usersAtom",
    default: null
})

export const userAtom = atom({
    key: "userAtom",
    default: null
})

export const userBalanceAtom = atom({
    key: "userBalanceAtom",
    default: 0
})
