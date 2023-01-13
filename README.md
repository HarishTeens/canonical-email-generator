A simple package to generate the canonical form of an email. A true unique identifier for user emails.

## Installation
Using npm:

```
npm i --save canonical-email-generator
```
## Usage

```javascript
const { canonicalizeEmail } = require('../canonical-email-generator')

console.log(canonicalizeEmail("hello.hello+123@gmail.com"));
// Output: hellohello@gmail.com
```
