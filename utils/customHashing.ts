const hashPassword = (password: string, salt: string = ""): string => {
  let hash = 0;
  const input = password + salt;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${hash}:${salt}`;
};

function verifyPassword(password: string, hashedPassword: string): boolean {
  const [hash, salt] = hashedPassword.split(":");
  const calculatedHash = hashPassword(password, salt).split(":")[0];
  return parseInt(hash, 10) === parseInt(calculatedHash, 10);
}

// Example usage
const password = "RaviPasal";
const hashedPassword = hashPassword(password, "##MyKhata##");
console.log(hashedPassword); // Output: 1234567890:mySalt
const isValid = verifyPassword(password, hashedPassword);
console.log(isValid); // Output: true
