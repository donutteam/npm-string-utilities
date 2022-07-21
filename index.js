//
// Imports
//

if (globalThis.crypto == undefined)
{
	const nodeCrypto = await import("node:crypto");

	globalThis.crypto = nodeCrypto.webcrypto;
}

//
// Exports
//

/**
 * Splits the given string into chunks.
 *
 * @param {String} string A string.
 * @param {Number} chunkLength The maximum length of each chunk.
 * @returns {Array<String>} An array of the string chunks.
 * @author Loren Goodwin
 */
export function chunkify(string, chunkLength)
{
	if (typeof string != "string")
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

	return string.match(new RegExp(".{1," + chunkLength.toString() + "}", "gu"));
}

/**
 * A list of characters available to generateRandomString.
 * 
 * @type {Array<String>}
 */
const randomStringCharacters = 
[
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"_", "-",
];

/**
 * Generates a cryptographically secure random string.
 *
 * @param {Number} length The length of the random string. Optional, defaults to 20.
 * @returns {String} A randomly generated string containing A-Z, a-z, 0-9, _ and/or -.
 * @author Lucas Cardellini
 */
export function random(length = 20)
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