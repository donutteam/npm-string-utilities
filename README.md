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

### generateRandomString
Generates a cryptographically secure random string of the given length.

* **length**: The length of the string. 
	* Optional, defaults to 20.

```js
import { random } from "@donutteam/string-utilities";

const randomString = random(24);

// Returns a 24 character random string
```

## License
[MIT](https://github.com/donutteam/string-utilities/blob/main/LICENSE.md)