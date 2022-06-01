/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable total-functions/no-unsafe-readonly-mutable-assignment */
import {
  dictionaryUnion,
  findArrayPairs,
  arrayColumn,
  setUnion,
  EMPTY_SET,
  EMPTY_DICTIONARY,
} from "./util/index";
import { NumberDictionary, SetArray, TwoDArray } from "./types/index";

/**
 * Finds the minimum time to find out when drivers have all met eachother at a stop directly, or by proxy.
 * @param drivers a two dimentional array of the drivers routes
 * @returns the minimum time for a complete set of all drivers to have a set of all drivers, or never
 */
export default function (drivers: TwoDArray): string | number {
  const MAX_DRIVER_WORKING_MINUTES: number = 8 * 60;
  //without more than 1 driver, total gossip passes at 0 minutes
  const DRIVERS_LENGTH = drivers.length;
  if (DRIVERS_LENGTH <= 1) return 0;

  /**
   * @param gossips an array of sets representing drivers who are meeting one another
   * @param previousSet the previous set of all drivers who have met eachother
   * @returns a merged set of the previous gossip, and current gossip
   * goes through pairs of sets representing drivers who met eachother
   * checking through all drivers previous gossip, and merging it with the current gossip
   * then after handling all pairs, merges the total findings together
   */
  function handleGossip(
    currentGossip: SetArray,
    previousGossip: NumberDictionary
  ): NumberDictionary {
    //dont handle gossip if no gossip has been passed this iteration
    return currentGossip.reduce(
      (
        acc: NumberDictionary,
        gossip: ReadonlySet<number>
      ): NumberDictionary => {
        //0. get our gossip into an array to then reduce into total gossip
        const driversWhoSharedGossip: ReadonlyArray<number> =
          Array.from(gossip);

        const totalGossipPassed: NumberDictionary =
          driversWhoSharedGossip.reduce(function (
            acc: NumberDictionary,
            driverId: number
          ): NumberDictionary {
            //1. accumulate a single set of 'passed gossip' for all met drivers,
            //factoring in each drivers previously passed gossip
            const driversGossip: ReadonlySet<number> =
              driversWhoSharedGossip.reduce(function (
                acc: ReadonlySet<number>,
                driverId: number
              ): ReadonlySet<number> {
                const driversGossip = previousGossip[driverId];

                return setUnion(
                  acc,
                  driversGossip !== undefined ? driversGossip : EMPTY_SET
                );
              },
              EMPTY_SET);

            //2. accumulate the gossip passed across the drivers who shared gossip
            return {
              ...acc,
              [driverId]: setUnion(gossip, driversGossip),
            };
          },
          EMPTY_DICTIONARY);

        //3. merge drivers set of currently passed gossip with previous gossip
        return dictionaryUnion(
          { ...previousGossip, ...acc },
          totalGossipPassed
        );
      },
      EMPTY_DICTIONARY
    );
  }

  /**
   * Core algorithm
   * get drivers at their routes relative to time -> find drivers at same stops -> for each set of drivers at same stop, merge each driver with eachothers set (to resemble gossip)
   * -> evaluate for every driver having a set of every driver or if there are zero or 1 drivers
   * @param previous a boolean array where the driverid is the index, and the value is an array of booleans referencing which drivers have been met
   * @returns the minimum time till all drivers have a set of all drivers, or never
   */
  function processGossip(
    previousResults: NumberDictionary,
    minutesPassed: number
  ): number | "never" {
    const driversAtStop: ReadonlyArray<number> = arrayColumn(
      drivers,
      minutesPassed
    );

    const driversAtSameStop: SetArray = findArrayPairs(driversAtStop);

    const totalGossip: NumberDictionary = handleGossip(
      driversAtSameStop,
      previousResults
    );

    const testTotalGossip: SetArray = Object.values(totalGossip);
    const totalGossipHasAllGossip = testTotalGossip.every(
      (gossip: ReadonlySet<number>): boolean => gossip.size === DRIVERS_LENGTH
    );

    if (totalGossipHasAllGossip) {
      return minutesPassed + 1;
    } else if (minutesPassed === MAX_DRIVER_WORKING_MINUTES) {
      return "never";
    } else {
      return processGossip(totalGossip, minutesPassed + 1);
    }
  }

  return processGossip(EMPTY_DICTIONARY, 0);
}
