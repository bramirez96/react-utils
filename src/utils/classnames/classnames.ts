import { IClassnamesArgs } from './classnames.model';

const classnames = (...args: IClassnamesArgs[]) => {
  let response = '';

  args.forEach((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      response += `${arg} `;
    } else if (typeof arg === 'object' && arg !== null) {
      // Arg is an object, let's get its values and filter them
      const argMap = Object.entries(arg);
      const filteredArgMap = argMap
        .filter((argTuple) => argTuple[1] === true) // Filter out unwanted classnames
        .map((argTuple) => argTuple[0]); // Convert from array of tuples to array of string classnames

      // Recursively call the function to add names from object class maps
      const recursiveResponse = classnames(...filteredArgMap);
      // Add the recursively calculated names to the calculated classname string
      response += recursiveResponse + ' ';
    }
  });

  // Filter out excess spaces
  response = response.replace(/\s+/g, ' ').trim();

  return response;
};

export default classnames;
