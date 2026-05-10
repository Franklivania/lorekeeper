/**
 * Custom entry: polyfill MUST run before expo-router loads any route
 * (routes may import @solana/web3.js → @noble/hashes captures crypto at import time).
 */
import "react-native-get-random-values";
import "expo-router/entry";
