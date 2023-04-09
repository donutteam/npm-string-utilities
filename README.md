# String Utilities
A collection of various string-related utility functions.

## Installation
Install the package with NPM:

```
npm install @donutteam/string-utilities
```

## Usage
### chunkify
Splits the given string into chunks.

* **string**: The input string.
* **chunkSize**: The maximum size of the chunks.
	* Note: The final chunk will be whatever remains of the string.

```js
import { chunkify } from "@donutteam/string-utilities";

const chunkedString = chunkify("This is a test", 4);

// Returns
// 	[ "This", " is ", "a te", "st" ]
```

### padNull
Pads the given string to a multiple of some amount (defaults to 16 bytes) with null characters.

```js
import { padNull } from "@donutteam/string-utilities";

const test1 = await padNull("potato");

const test2 = await padNull("salad", 32);
```

### random
Generates a cryptographically secure random string of the given length.

* **length**: The length of the string. 
	* Optional, defaults to 20.

```js
import { random } from "@donutteam/string-utilities";

const randomString = random(24);

// Returns a 24 character random string
```

### replaceAllSync
Takes an input string, a search value and an asyncronous replacer function to replace all instances of the search value asynchronously.

```js
import { replaceAllAsync } from "@donutteam/string-utilities";

const newString = await replaceAllAsync("potatosaladpotatosalad", "salad", async (match) =>
{
	return await somethingThatTakesTime(match);
});
```

### trimNull
Trims null characters off the end of the given string.

```js
import { trimNull } from "@donutteam/string-utilities";

const test1 = await trimNull("potato\0"); // Returns "potato"
```

## License
[MIT](https://github.com/donutteam/string-utilities/blob/main/LICENSE.md)