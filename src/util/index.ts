/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable total-functions/no-unsafe-readonly-mutable-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { readonlySet } from "readonly-types/dist";
import { NumberDictionary, TwoDArray, SetArray } from "../types/index";

export const EMPTY_DICTIONARY: NumberDictionary = {};
export const EMPTY_SET: ReadonlySet<number> = readonlySet([]);

/**
 * Takes two sets and returns the union of the two sets
 * @param set1 a number set to be merged with set2
 * @param set2 a number set to be merged with set1
 * @returns a merged set of set 1 and set 2
 */
export function setUnion(
  set1: ReadonlySet<number>,
  set2: ReadonlySet<number>
): ReadonlySet<number> {
  return readonlySet([...set1, ...set2]);
}

/**
 * Disassembles and re-assembles two number dictionaries back together
 * 1. gets keys from dict1 and dict2, iterating over them and getting the
 * respective values from both dictionaries to them merge them
 * 2. merges the values from the same key, and pushes them into a new accumulated
 * number dictionary
 * @param dict1 a number dictionary to be merged with dict2
 * @param dict2 a number dictionary to be merged with dict1
 * @returns a merged number dictionary
 */
export function dictionaryUnion(
  dict1: NumberDictionary,
  dict2: NumberDictionary
): NumberDictionary {
  const k1: ReadonlyArray<string> = [...Object.keys(dict1)];
  const k2: ReadonlyArray<string> = [...Object.keys(dict2)];
  const keys: ReadonlyArray<string> = [...k1, ...k2];
  return keys.reduce(function (
    acc: NumberDictionary,
    key: string
  ): NumberDictionary {
    const o1set: ReadonlySet<number> =
      dict1[key] !== undefined ? dict1[key]! : EMPTY_SET;
    const o2set: ReadonlySet<number> =
      dict2[key] !== undefined ? dict2[key]! : EMPTY_SET;

    const mergedSet = setUnion(o1set, o2set);

    return { ...acc, [key]: mergedSet };
  },
  EMPTY_DICTIONARY);
}

/**
 * @param source a two dimentional array of numbers
 * @returns drivers at their current stop relative to minutes passed
 * this assumes that your nested arrays repeat when accessed past their initial length
 */
export function arrayColumn(
  source: TwoDArray,
  index: number
): ReadonlyArray<number> {
  const res: ReadonlyArray<number> = source.map(
    (subArray) => subArray[index % subArray.length]!
  );
  return res;
}

/**
 * looks for duplicate numbers in a given array, and returns pairs of array index's whom held
 * the same values only if there was more than one array index holding that duplicate value
 * @param array an array of numbers, where we are searching for index's with the same value
 * @returns an array of sets, where each set is an index whom shared a value with the other index's in the set
 */
export function findArrayPairs(array: ReadonlyArray<number>): SetArray {
  return Object.values<ReadonlySet<number>>(
    array.reduce(function (
      acc: NumberDictionary,
      arrayValue: number,
      arrayIndex: number
    ): NumberDictionary {
      const setAtCurrentStop = acc[arrayValue];
      const res: NumberDictionary = {
        ...acc,
        ...{
          [arrayValue]: setUnion(
            setAtCurrentStop !== undefined ? setAtCurrentStop : EMPTY_SET,
            readonlySet([arrayIndex])
          ),
        },
      };
      return res;
    },
    EMPTY_DICTIONARY)
  );
}
