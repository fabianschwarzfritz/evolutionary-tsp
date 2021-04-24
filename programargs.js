
function parameters() {
  const options = {
    test: false,
    generated: true,
    predefined: false,
    evolutions: 1000,
    pool: 10,
    /*More options, optional:*/
    /*graph: "generated.svg",*/
  };

  const args = process.argv.slice(2);
  for(let i = 0; i < args.length; i++) {
    const arg = args[i];
    const argvalue = args[i+1];

    console.log("checkig option", arg, argvalue);

    // Skip one iteration to not reat
    // the argument as the option type.
    function nextOption() {
      i++;
    }

    if("--test" === arg) {
      options.test = true;
    } else if("--generated" === arg) {
      options.generated = true;
      options.predefined = false;
    } else if("--predefined" === arg) {
      options.predefined = true;
      options.generated = false;
    } else if("--evolutions" === arg) {
      options.evolutions = parseInt(argvalue);
      nextOption();
    } else if("--pool" === arg) {
      options.pool = parseInt(argvalue);
      nextOption();
    } else if("--graph" === arg) {
      options.graph = argvalue;
    }
  }
  return options;
}

module.exports = parameters;

