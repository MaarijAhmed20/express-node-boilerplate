/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = <T, K extends keyof T>(object: T, keys: K[]): Partial<T> => {
  const result = keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      return { ...obj, [key]: object[key] };
    }
    return obj;
  }, {});
  return result;
};
