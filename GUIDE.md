Are you a backend dev? And your existing email check logic looks something like this?
```javascript
const email = req.body.email;
const resp = await UserDB.findOne({email: email});
if(resp.length >0)
    throw new Error("Email already exists");
// Create account
...
```

**Your application is at risk! Keep reading**

### What the heck is Email Canonicalization?

Consider the below emails:

1. [hello(home)@gmail.com](hello(home)@gmail.com)
2. [hell.o@gmail.com](hell.o@gmail.com)
3. [hell.o+nothing@gmail.com](hell.o+nothing@gmail.com)

If you are treating all these as different emails, you are wrong ❌  
The above emails are all treated as the same email address, is an example of a technique called "email canonicalization" that many email providers use to standardize email addresses for consistency and easier management.

The canonical form of all the above emails post standardisation is [hello@gmail.com](hello@gmail.com). Since Gmail doesn't bother about these mild modifications, emails sent to these different emails would land in a single Inbox allocated to [hello@gmail.com](hello@gmail.com).

There is not much information on the internet. But this is the textbook definition from RFC standard website: https://www.rfc-editor.org/rfc/rfc6376#section-3.4
>   Some mail systems modify email in transit, potentially invalidating a
>   signature.  For most Signers, mild modification of email is
>   immaterial to validation of the DKIM domain name's use.

### Why this matters?

Let's say your application collects user emails like majority of the applications. If your check to find existing email directly compares the raw email address. The above 3 email addresses would be treated as 3 different individuals, leading to creation of 3 user accounts. One does not usually expect users to sign up with these mild variatons. But when there is an incentive to, this behaviour tend to happen.  

At our company, every new user signup is rewarded. Both referrer and refree are eligible for the reward. Analysing our user data revealed these mild variations of emails being registered as different accounts. And this costed us as they were exploiting our referral program. One could easily  configure these mild variations on their Gmail. Since our systems would treat them as new email addresses, they were able to register, verify OTP that landed on the same Inbox and then refer themselves.


### The npm package you need

To abstract the logic for the check, I created this npm package [canonical-email-generator](https://www.npmjs.com/package/canonical-email-generator).

Installation:

```
npm i --save canonical-email-generator
```

So far the package refines the emails for these below cases:

1. **Lowercasing**: converting all letters in the email address to lowercase before comparing or storing it. This helps to ensure that "Hello@example.com" and "hello@example.com" are treated as the same email address.

2. **Removing sub-addressing**: removing the "+" character and any text following it in the local part of the email address. For example, "user+home@example.com" would be canonicalized to "user@example.com".

3. **Removing comments**: removing any text within parentheses in the local part of the email address. For example, "user(home)@example.com" would be canonicalized to "user@example.com".

4. **Removing leading or trailing whitespace**: removing any whitespace before or after the email address.

5. **Removing dots**: removing dots from local part of the address, For example "hell.o@gmail.com" would be canonicalized to "hello@gmail.com"

I would be actively maintaining it and adding more checks as I discover. So you're good to go.

### Implementing the better way


The invalid account signup could be eradicated by converting the email to its canonical form before checking the database. But for that you need to store the canonical form in your database as well.
```javascript
const { canonicalizeEmail } = require('canonical-email-generator');
...
const email = req.body.email;
const canEmail = canonicalizeEmail(email);
const resp = await UserDB.findOne({canEmail: canEmail});
if(resp.length >0)
    throw new Error("Email already exists");
// Create account and store canonical email to DB
...
```
Yes it is an extra field in the same table or a separate table if you wish. But the extra storage could prevent a ton of invalid users being created. 

Potentially a single gmail inbox could be used to create infinite variations. Hence it's worthwhile to implement.

### Conclusion
Exact email comparison fails. It's bad.
It is possible to generate infinite emails that lead to a canonical email.
The inbox is uniquely identified by its canonical email.

Hope you learnt something valuable ✨

Find me on Twitter: [@harishteens](https://twitter.com/HarishTeens)
GitHub: [@harishteens](https://github.com/harishteens)
