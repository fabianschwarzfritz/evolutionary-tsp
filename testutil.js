/**
 * Helper test function so that we can assert statement
 * write test coding to verify certain behavior.
 */
function assert(actual, expected, message) {
    if (actual === expected) {
      console.log(`test ok`);
    } else {
        throw new Error(message || `Assertion failed.\n Actual: ${actual}\nExpected: ${expected}`);
    }
}

module.exports = {
  assert,
}

