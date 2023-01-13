/**
 * 
 * @param {string} email Input email
 * @returns Return canonicalized email
 */
function canonicalizeEmail(email) {
    // Remove leading/trailing whitespace
    email = email.trim();

    const re = /^(?=\s)|^(?:(?!.+\.{2,})(?!\.)(?:[\w.!#$%&'*+\-\/=?\^`{|} ~]|[^\x00-\x7F])+[^\."]@|^"(?:[\w.!#$%&'*+\-\/=?\^`{|} ~(),:;<>@\[\]]|[^\x00-\x7F])+"@|(?:[\w.!#$%&'*+\-\/=?\^`{|} ~]|[^\x00-\x7F])+\."(?:[\w.!#$%&'*+\-\/=?\^`{|} ~"(),:;<>\\@\[\]]|[^\x00-\x7F])+"\.(?:[\w.!#$%&'*+\-\/=?\^`{|} ~]|[^\x00-\x7F])+@)(?!-)(?!.*-\.)(?:[a-zA-Z0-9-.]|[^\x00-\x7F])+$|^".+"@.+|.+@\[(?:\w+\.|\w+:){3}.+\]|^\(.+\)|\(.+\)@/
    if (!re.test(email))
        throw new Error('Invalid Email Format');

    // 1. Lowercase the email address
    email = email.toLowerCase();

    // 2. Remove sub-addressing
    var subAddressingIndex = email.indexOf('+');
    if (subAddressingIndex != -1) {
        email = email.substring(0, subAddressingIndex) + email.substring(email.indexOf('@'));
    }

    // 3. Remove comments
    var commentIndex = email.indexOf('(');
    if (commentIndex != -1) {
        email = email.substring(0, commentIndex) + email.substring(email.indexOf(')') + 1);
    }

    // 4. remove dots
    const emailSplit = email.split('@')
    email = `${emailSplit[0].replace(/\./g, "")}@${emailSplit[1]}`

    return email;
}

module.exports = { canonicalizeEmail };