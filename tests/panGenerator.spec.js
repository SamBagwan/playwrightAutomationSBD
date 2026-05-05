/**
 * panGenerator.js
 * Converted from PANGenerator.java
 */

class PANGenerator {
  static ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  static NUMBERS = "0123456789";
  static FIRST_NAMES = [
    "Aarav", "Aditi", "Arjun", "Ananya", "Dev", "Diya", "Ishaan", "Kavya",
    "Rohan", "Riya", "Vihaan", "Zara", "Kabir", "Kiara", "Reyansh", "Saisha"
  ];
  static LAST_NAMES = [
    "Kumar", "Singh", "Patel", "Shah", "Sharma", "Verma", "Gupta", "Joshi",
    "Reddy", "Kapoor", "Malhotra", "Mehta", "Chopra", "Desai", "Iyer", "Roy"
  ];

  /**
   * Helper to get a random character from a string
   */
  static _getRandomChar(source) {
    return source.charAt(Math.floor(Math.random() * source.length));
  }

  /**
   * Generate PAN Number following the format: AAAPA1234A (4th letter is P)
   * @returns {string}
   */
  static generatePAN() {
    let pan = "";

    // First 3 characters (Letters)
    for (let i = 0; i < 3; i++) {
      pan += this._getRandomChar(this.ALPHABETS);
    }

    // 4th character is always 'P'
    pan += 'P';

    // 5th character (Letter)
    pan += this._getRandomChar(this.ALPHABETS);

    // Next 4 characters (Numbers)
    for (let i = 0; i < 4; i++) {
      pan += this._getRandomChar(this.NUMBERS);
    }

    // Last character (Letter)
    pan += this._getRandomChar(this.ALPHABETS);

    return pan;
  }

  /**
   * Generate random full name
   * @returns {string}
   */
  static generateName() {
    const firstName = this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)];
    const lastName = this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
  }

  /**
   * Generate both PAN and Name
   * @returns {{pan: string, name: string}}
   */
  static generatePANDetails() {
    return {
      pan: this.generatePAN(),
      name: this.generateName()
    };
  }
}

// Export the class for use in Playwright tests
module.exports = PANGenerator;

// Simple testing block (equivalent to Java main method)
if (require.main === module) {
  const details = PANGenerator.generatePANDetails();
  console.log("\nPerson 1:");
  console.log(`Name: ${details.name}`);
  console.log(`PAN: ${details.pan}`);
}