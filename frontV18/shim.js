
import crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = Buffer;
globalThis.crypto = crypto;
global.process = process;
