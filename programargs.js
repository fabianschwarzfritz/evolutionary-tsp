
function parameters() {
  const options = {
    test: false,
    generated: true,
    predefined: false,
    evolutions: 1000,
    pool: 10,
  };

  const args = process.argv.slice(2);
  for(let i = 0; i < args.length; i++) {
    const arg = args[i];
    const argvalue = args[i+1];

    // Options remove the next arguments
    function nextOption() {
      i++;
    }
    // Options with parameters remove the next two arguments
    function nextArgumentOption() {
      i = i + 2;
    }

    if("--test" === arg) {
      options.test = true;
      nextOption();
    } else if("--generated" === arg) {
      options.generated = true;
      nextOption();
    } else if("--predefined" === arg) {
      options.predefined = true;
      nextOption();
    } else if("--evolutions" === arg) {
      options.evolutions = parseInt(argvalue);
      nextArgumentOption();
    } else if("--pool" === arg) {
      options.pool = parseInt(argvalue);
      nextArgumentOption();
    }
  }
  return options;
}

module.exports = parameters;

