"use client"
import {SupportedCurrencies, SupportedThemes} from "@/lib/defaultData";

export const LOCAL_THEME_NAME = process.env.NEXT_PUBLIC_LOCAL_STORAGE_THEME_NAME
export const DEFAULT_THEME = SupportedThemes[0];
export const DEFAULT_CURRENCY = SupportedCurrencies[0];
export const DEFAULT_VIEWPORT_COLOR_LIGHT = "#060911";
export const DEFAULT_VIEWPORT_COLOR_DARK = "#FFFFFF";