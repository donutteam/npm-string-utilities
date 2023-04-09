//
// Imports
//

if (globalThis.crypto == undefined)
{
	const nodeCrypto = await import("node:crypto");

	globalThis.crypto = nodeCrypto.webcrypto as Crypto;
}

//
// Exports
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

/** A list of characters available to generateRandomString. */
const randomStringCharacters : string[] = 
[
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"_", "-",
];

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
export async function replaceAllAsync(inputString : string, searchValue : string, asyncReplacer : (substring : string, ...args : unknown[]) => Promise<string>) : Promise<string>
{
	const matches = inputString.match(searchValue);

	if (!matches) 
	{
		return inputString;
	}

	const promises = matches.map(match => asyncReplacer(match));

	const replacements = await Promise.all(promises);

	let lastIndex = 0;

	let result = "";

	for (let index = 0; index < matches.length; index++) 
	{
		const match = matches[index];
		const replacement = replacements[index];
		
		const matchIndexInString = inputString.indexOf(match, lastIndex);

		result += inputString.substring(lastIndex, matchIndexInString);

		result += replacement;

		lastIndex = matchIndexInString + match.length;
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