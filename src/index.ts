//
// Imports
//

if (globalThis.crypto == undefined)
{
	const nodeCrypto = await import("node:crypto");

	globalThis.crypto = nodeCrypto.webcrypto as Crypto;
}

//
// Functions
//

/**
 * Splits the given string into chunks.
 *
 * @param inputString The input string.
 * @param chunkLength The length of each chunk in the returned string array.
 * @returns An array of strings, each of which is a chunk of the input string.
 * @author Loren Goodwin
 */
export function chunkify(inputString : string, chunkLength : number) : string[]
{
	if (typeof inputString != "string")
	{
		throw new Error("[StringUtil] Cannot chunkify a non-string value.");
	}

	if (typeof chunkLength != "number")
	{
		throw new Error("[StringUtil] Chunkify chunk length must be a number.");
	}

	if (chunkLength < 1)
	{
		throw new Error("[StringUtil] Chunkify chunk length must be greater than 0.");
	}

	return inputString.match(new RegExp(".{1," + chunkLength.toString() + "}", "gu"));
}

/** A list of regular expressions that match local IP ranges. */
const localIpRanges : RegExp[] = 
[
	// 10.0.0.0 - 10.255.255.255
	/^(::f{4}:)?10\.\d{1,3}\.\d{1,3}\.\d{1,3}/,

	// 127.0.0.0 - 127.255.255.255
	/^(::f{4}:)?127\.\d{1,3}\.\d{1,3}\.\d{1,3}/,

	// 169.254.1.0 - 169.254.254.255
	/^(::f{4}:)?169\.254\.([1-9]|1?\d\d|2[0-4]\d|25[0-4])\.\d{1,3}/,

	// 172.16.0.0 - 172.31.255.255
	/^(::f{4}:)?(172\.1[6-9]|172\.2\d|172\.3[0-1])\.\d{1,3}\.\d{1,3}/,

	// 192.168.0.0 - 192.168.255.255
	/^(::f{4}:)?192\.168\.\d{1,3}\.\d{1,3}/,

	// fc00::/7
	/^f[c-d][0-9a-f]{2}(::1$|:[0-9a-f]{1,4}){1,7}/,

	// fe80::/10
	/^fe[89ab][0-9a-f](::1$|:[0-9a-f]{1,4}){1,7}/,
];

/**
 * Checks if the given IP address is a local IP address.
 * 
 * @param ipAddress An IP address.
 * @returns Whether the given IP address is a local IP address.
 * @author Loren Goodwin
 */
export function isLocalIpAddress(ipAddress : string) : boolean
{
	return ipAddress === "::1" || ipAddress === "::1" || localIpRanges.some((range) => range.test(ipAddress));
}

/**
 * Pads the given string to a multiple of 16 bytes with null characters.
 * 
 * @param inputString A string.
 * @param length? Pad to a multiple of this amount. Optional, defaults to 16.
 * @returns A null padded string.
 * @author Loren Goodwin
 */
export function padNull(inputString : string, length = 16) : string
{
	const paddingNeeded = length - (inputString.length % length);

	if (paddingNeeded > 0 && paddingNeeded < length)
	{
		for (let i = 0; i < paddingNeeded; i++)
		{
			inputString += "\0";
		}
	}

	return inputString;
}

/** A list of characters available to generateRandomString. */
const randomStringCharacters : string[] = 
[
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"_", "-",
];

/**
 * Generates a cryptographically secure random string.
 *
 * @param length The length of the random string. Optional, defaults to 20.
 * @returns A randomly generated string containing A-Z, a-z, 0-9, _ and/or -.
 * @author Lucas Cardellini
 */
export function random(length = 20) : string
{
	const Input = new Uint8Array(Math.ceil(length / 4) * 3);

	globalThis.crypto.getRandomValues(Input);

	let Result = "";
	let I = 0;
	let I2 = 0;

	while (I2 < length)
	{
		Result += randomStringCharacters[ (Input[ I ] & 252) >> 2 ];
		++I;
		++I2;

		if (I2 >= length)
		{
			break;
		}

		// eslint-disable-next-line no-mixed-operators
		Result += randomStringCharacters[ (Input[ I - 1 ] & 3) << 4 | (Input[ I ] & 240) >> 4 ];
		++I;
		++I2;

		if (I2 >= length)
		{
			break;
		}

		// eslint-disable-next-line no-mixed-operators
		Result += randomStringCharacters[ (Input[ I - 1 ] & 15) << 2 | (Input[ I ] & 192) >> 6 ];
		++I2;

		if (I2 >= length)
		{
			break;
		}

		Result += randomStringCharacters[ Input[ I ] & 63 ];
		++I;
		++I2;
	}

	return Result;
}


/**
 * Removes trailing null terminators from a string.
 * 
 * @param inputString The input value.
 * @param searchValue The value to search for.
 * @param asyncReplacer A function that returns a promise that resolves to the replacement string.
 * @returns A promise that resolves to the input string with all instances of the search value replaced by the result of the replacer function.
 * @author ChatGPT
 * @author Loren Goodwin
 */
export async function replaceAllAsync(inputString: string, searchValue: string | RegExp, asyncReplacer: (match: string, captureGroups: string[]) => Promise<string>): Promise<string> 
{
	const searchRegExp = typeof(searchValue) === "string" ? new RegExp(searchValue, "g") : searchValue;

	const matches = inputString.matchAll(searchRegExp);

	let lastIndex = 0;

	let result = "";

	for (const match of matches) 
	{
		const [fullMatch, ...captureGroups] = match;

		const matchIndex = match.index ?? 0;

		const matchLength = fullMatch.length;

		const replacement = await asyncReplacer(fullMatch, captureGroups);

		result += inputString.substring(lastIndex, matchIndex);

		result += replacement;

		lastIndex = matchIndex + matchLength;
	}

	result += inputString.substring(lastIndex);

	return result;
}
  

/**
 * Removes trailing null terminators from a string.
 * 
 * @param inputString A string.
 * @returns The string without trailing null terminators.
 * @author Loren Goodwin
 */
export function trimNull(inputString : string) : string
{
	const nullPosition = inputString.indexOf("\0");
	
	if (nullPosition > -1)
	{
		return inputString.substring(0, nullPosition);
	}

	return inputString;
}